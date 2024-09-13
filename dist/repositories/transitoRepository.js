"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transitoDao_1 = __importDefault(require("../dao/transitoDao"));
const veicoloDao_1 = __importDefault(require("../dao/veicoloDao"));
const varcoDao_1 = __importDefault(require("../dao/varcoDao"));
const errorFactory_1 = require("../ext/errorFactory");
const transitoService_1 = __importDefault(require("../ext/transitoService"));
const database_1 = __importDefault(require("../db/database"));
class TransitoRepository {
    constructor() {
        this.sequelize = database_1.default.getInstance(); // Recupero dell'istanza del database
    }
    /**
     * Creazione di un transito in ingresso.
     * Nel transito in ingresso non viene fornito il varco di uscita né la tariffa, poiché saranno calcolati al momento dell'uscita.
     * Se il veicolo non è presente nel database, viene creato automaticamente.
     *
     * @param transitoData - Dati del nuovo transito (solo ingresso)
     * @param targa - La targa del veicolo che entra
     * @param id_tipo_veicolo - Il tipo del veicolo
     * @param id_utente - L'utente a cui è associato il veicolo
     * @returns Il transito creato
     */
    create(transitoData, targa, id_tipo_veicolo, id_utente) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.sequelize.transaction();
            try {
                // Verifica se il veicolo esiste tramite la targa, altrimenti crealo
                let veicolo = yield veicoloDao_1.default.findByTarga(targa);
                if (!veicolo) {
                    // Crea il veicolo se non esiste
                    veicolo = yield veicoloDao_1.default.create({
                        targa: targa,
                        id_tipo_veicolo: id_tipo_veicolo,
                        id_utente: id_utente,
                    });
                }
                // Verifica esistenza varco di ingresso
                const varcoIngresso = yield varcoDao_1.default.findById(transitoData.id_varco_ingresso);
                if (!varcoIngresso) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Varco di ingresso non trovato');
                }
                // Creazione del nuovo transito con solo ingresso
                const nuovoTransito = yield transitoDao_1.default.create(Object.assign(Object.assign({}, transitoData), { id_veicolo: veicolo.id }));
                yield transaction.commit(); // Commit della transazione
                return nuovoTransito;
            }
            catch (error) {
                yield transaction.rollback(); // Rollback della transazione in caso di errore
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante la creazione del transito');
            }
        });
    }
    /**
     * Aggiornamento di un transito con varco di uscita e calcolo della tariffa dinamica.
     *
     * @param transitoId - L'ID del transito da aggiornare
     * @param varcoUscitaId - L'ID del varco di uscita
     * @param dataOraUscita - La data e ora di uscita
     * @returns Il transito aggiornato con l'importo calcolato
     */
    updateUscita(transitoId, varcoUscitaId, dataOraUscita) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.sequelize.transaction();
            try {
                const transito = yield this.findById(transitoId);
                if (!transito) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il transito con id ${transitoId} non è stato trovato`);
                }
                // Verifica esistenza varco di uscita
                const varcoUscita = yield varcoDao_1.default.findById(varcoUscitaId);
                if (!varcoUscita) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Varco di uscita non trovato');
                }
                // Calcolo dell'importo basato sulla durata e sulla tariffa dinamica
                const importo = yield transitoService_1.default.calcolaImporto(transitoId, dataOraUscita);
                // Aggiornamento del transito con il varco di uscita, la data di uscita e l'importo calcolato
                const updateData = {
                    id_varco_uscita: varcoUscitaId,
                    uscita: dataOraUscita,
                    importo, // Importo calcolato dinamicamente
                };
                yield transitoDao_1.default.update(transitoId, updateData);
                yield transaction.commit();
                return Object.assign(Object.assign({}, transito), updateData); // Restituisce il transito aggiornato
            }
            catch (error) {
                yield transaction.rollback();
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante l'aggiornamento del transito con uscita per id ${transitoId}`);
            }
        });
    }
    /**
     * Recupera un transito per ID.
     *
     * @param id - L'ID del transito da recuperare
     * @returns Il transito trovato
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transito = yield transitoDao_1.default.findById(id);
                if (!transito) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il transito con id ${id} non è stato trovato`);
                }
                return transito;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nel recupero del transito con id ${id}`);
            }
        });
    }
    /**
     * Cancella un transito per ID.
     *
     * @param id - L'ID del transito da eliminare
     * @returns true se l'eliminazione è avvenuta correttamente, false altrimenti
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.sequelize.transaction();
            try {
                const transito = yield this.findById(id);
                if (!transito) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il transito con id ${id} non esiste`);
                }
                const deleted = yield transitoDao_1.default.delete(id);
                yield transaction.commit();
                return deleted;
            }
            catch (error) {
                yield transaction.rollback();
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante l'eliminazione del transito con id ${id}`);
            }
        });
    }
}
exports.default = new TransitoRepository();
