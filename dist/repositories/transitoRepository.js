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
const parcheggioDao_1 = __importDefault(require("../dao/parcheggioDao"));
const varcoDao_1 = __importDefault(require("../dao/varcoDao"));
const tariffaDao_1 = __importDefault(require("../dao/tariffaDao"));
const utenteDao_1 = __importDefault(require("../dao/utenteDao"));
const errorFactory_1 = require("../ext/errorFactory");
const transitoService_1 = __importDefault(require("../ext/transitoService"));
const database_1 = __importDefault(require("../db/database"));
class TransitoRepository {
    constructor() {
        this.sequelize = database_1.default.getInstance();
    }
    create(transitoData, targa, id_tipo_veicolo, id_utente) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.sequelize.transaction();
            try {
                // Cerca il veicolo con la targa fornita
                let veicolo = yield veicoloDao_1.default.findByTarga(targa);
                if (!veicolo) {
                    // Se il veicolo non esiste, crea un nuovo utente e un nuovo veicolo
                    const nuovoUtente = yield utenteDao_1.default.create({
                        nome: `Automobilista-${targa}`,
                        ruolo: 'automobilista',
                        username: `user_${targa}`,
                    }, transaction);
                    veicolo = yield veicoloDao_1.default.create({
                        targa: targa,
                        id_tipo_veicolo: id_tipo_veicolo,
                        id_utente: nuovoUtente.id,
                    }, transaction);
                }
                else {
                    // Verifica se esiste già un transito attivo per questo veicolo
                    const transitoAttivo = yield transitoDao_1.default.findOne({
                        where: {
                            id_veicolo: veicolo.id,
                            uscita: null,
                        },
                    });
                    if (transitoAttivo) {
                        throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, `Il veicolo con targa ${targa} è già in un transito attivo e non può entrare in un altro parcheggio.`);
                    }
                }
                const varcoIngresso = yield varcoDao_1.default.findById(transitoData.id_varco_ingresso);
                if (!varcoIngresso) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Varco di ingresso non trovato');
                }
                const parcheggio = yield parcheggioDao_1.default.findById(varcoIngresso.id_parcheggio);
                if (!parcheggio) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Parcheggio non trovato');
                }
                if (parcheggio.posti_disponibili <= 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Nessun posto disponibile nel parcheggio');
                }
                parcheggio.posti_disponibili -= 1;
                yield parcheggio.save({ transaction });
                const nuovoTransito = yield transitoDao_1.default.create(Object.assign(Object.assign({}, transitoData), { ingresso: new Date(), id_veicolo: veicolo.id }), transaction);
                yield transaction.commit();
                return nuovoTransito;
            }
            catch (error) {
                yield transaction.rollback();
                // Se l'errore è già un CustomHttpError, rilancialo
                if (error instanceof errorFactory_1.CustomHttpError) {
                    throw error;
                }
                // Altrimenti, lancia un errore generico
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante la creazione del transito');
            }
        });
    }
    updateUscita(transitoId, varcoUscitaId, dataOraUscita) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.sequelize.transaction();
            try {
                // Recupera il transito
                const transito = (yield this.findById(transitoId));
                if (!transito) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il transito con id ${transitoId} non è stato trovato`);
                }
                // Controllo per verificare se il transito è già stato chiuso
                if (transito.uscita) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, `Il transito con id ${transitoId} è già stato chiuso`);
                }
                const varcoUscita = yield varcoDao_1.default.findById(varcoUscitaId);
                if (!varcoUscita) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Varco di uscita non trovato');
                }
                const parcheggio = yield parcheggioDao_1.default.findById(varcoUscita.id_parcheggio);
                if (!parcheggio) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Parcheggio non trovato');
                }
                // Incrementa i posti disponibili e salva il parcheggio
                parcheggio.posti_disponibili += 1;
                // Assicurati che i posti disponibili non superino la capacità massima
                if (parcheggio.posti_disponibili > parcheggio.capacita) {
                    parcheggio.posti_disponibili = parcheggio.capacita;
                }
                yield parcheggio.save({ transaction });
                // Recupera il veicolo associato al transito
                const veicolo = yield veicoloDao_1.default.findById(transito.id_veicolo);
                if (!veicolo) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Veicolo non trovato per il transito');
                }
                const idTipoVeicolo = veicolo.id_tipo_veicolo;
                console.log({
                    id_tipo_veicolo: idTipoVeicolo,
                    fascia_oraria: transitoService_1.default.determinaFasciaOraria(dataOraUscita),
                    feriale_festivo: transitoService_1.default.determinaFerialeFestivo(dataOraUscita),
                    id_parcheggio: varcoUscita.id_parcheggio,
                });
                // Trova la tariffa appropriata
                const tariffa = yield tariffaDao_1.default.findOne({
                    where: {
                        id_tipo_veicolo: idTipoVeicolo,
                        fascia_oraria: transitoService_1.default.determinaFasciaOraria(dataOraUscita),
                        feriale_festivo: transitoService_1.default.determinaFerialeFestivo(dataOraUscita),
                        id_parcheggio: varcoUscita.id_parcheggio,
                    },
                });
                if (!tariffa) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Tariffa non disponibile per questo transito');
                }
                // Calcolo dell'importo
                const importo = yield transitoService_1.default.calcolaImporto(transitoId, dataOraUscita);
                // Aggiorna il transito con tutte le informazioni
                yield transitoDao_1.default.update(transitoId, {
                    id_tariffa: tariffa.id,
                    id_varco_uscita: varcoUscitaId,
                    uscita: dataOraUscita,
                    importo,
                }, transaction);
                yield transaction.commit();
                return {
                    id: transito.id,
                    ingresso: transito.ingresso,
                    uscita: dataOraUscita,
                    id_veicolo: transito.id_veicolo,
                    id_varco_ingresso: transito.id_varco_ingresso,
                    id_varco_uscita: varcoUscitaId,
                    id_tariffa: tariffa.id,
                    importo: importo,
                };
            }
            catch (error) {
                console.error("Errore durante l'uscita del veicolo:", error);
                try {
                    yield transaction.rollback();
                }
                catch (rollbackError) {
                    console.error('Errore durante il rollback della transazione:', rollbackError);
                }
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante l'aggiornamento del transito con uscita per id ${transitoId}`);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transito = (yield transitoDao_1.default.findById(id));
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
