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
const transito_1 = __importDefault(require("../models/transito"));
const tariffa_1 = __importDefault(require("../models/tariffa"));
const parcheggio_1 = __importDefault(require("../models/parcheggio"));
const dateUtils_1 = require("../ext/dateUtils");
const errorFactory_1 = require("../ext/errorFactory");
class TransitoRepository {
    // Creazione di un nuovo transito con controllo sulla capacità del parcheggio
    create(transitoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parcheggio = yield parcheggio_1.default.findByPk(transitoData.id_posto);
                if (!parcheggio) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Parcheggio non trovato');
                }
                // Controllo sulla capacità del parcheggio
                const postiOccupati = yield transito_1.default.count({ where: { id_posto: parcheggio.id, uscita: null } });
                if (postiOccupati >= parcheggio.capacita) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Parcheggio pieno');
                }
                const nuovoTransito = yield transito_1.default.create(transitoData);
                return nuovoTransito;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nella creazione del transito: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto nella creazione del transito');
                }
            }
        });
    }
    // Ottenere tutti i transiti
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transiti = yield transito_1.default.findAll();
                return transiti;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero dei transiti');
            }
        });
    }
    // Ottenere un transito specifico per ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transito = yield transito_1.default.findByPk(id);
                if (!transito) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato');
                }
                return transito;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nel recupero del transito: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto nel recupero del transito');
                }
            }
        });
    }
    // Aggiornare un transito
    update(id, transitoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [numUpdated] = yield transito_1.default.update(transitoData, {
                    where: { id },
                });
                if (numUpdated === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato per l\'aggiornamento');
                }
                return true;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nell'aggiornamento del transito: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto nell\'aggiornamento del transito');
                }
            }
        });
    }
    // Eliminare un transito
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const numDeleted = yield transito_1.default.destroy({
                    where: { id },
                });
                if (numDeleted === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato per l\'eliminazione');
                }
                return true;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nell'eliminazione del transito: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto nell\'eliminazione del transito');
                }
            }
        });
    }
    // Calcolo della tariffa basato su durata e fascia oraria e giorni feriali/festivi
    calcolaImporto(transitoId, dataOraUscita) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transito = yield transito_1.default.findByPk(transitoId);
                if (!transito) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato');
                }
                // Recupera la tariffa dal TariffaRepository
                const tariffa = yield tariffa_1.default.findByPk(transito.id_tariffa);
                if (!tariffa) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Tariffa non trovata');
                }
                // Calcolo della durata in ore
                const durataInMs = dataOraUscita.getTime() - transito.ingresso.getTime();
                const durataInOre = durataInMs / (1000 * 60 * 60);
                // Determina se è feriale o festivo
                const giornoSettimana = transito.ingresso.getDay();
                const giornoSettimanaString = (0, dateUtils_1.getGiornoSettimanaString)(giornoSettimana);
                const giornoFestivo = giornoSettimana === 0 || giornoSettimana === 6; // Considera domenica (0) e sabato (6) come festivi
                // Determina se la durata è diurna o notturna
                const oraIngresso = transito.ingresso.getHours();
                const fasciaOraria = oraIngresso >= 8 && oraIngresso < 20 ? 'DIURNA' : 'NOTTURNA';
                // Recupera l'importo dalla tariffa basata sulla fascia oraria e giorno festivo/feriale
                const importoOrario = (tariffa.fascia_oraria === fasciaOraria && tariffa.giorno_settimana === giornoSettimanaString)
                    ? tariffa.importo
                    : 0;
                // Calcolo dell'importo totale
                const importo = durataInOre * importoOrario;
                return importo;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nel calcolo dell'importo: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto nel calcolo dell\'importo');
                }
            }
        });
    }
    // Aggiorna il transito con l'uscita e l'importo calcolato
    aggiornaTransitoConImporto(transitoId, dataOraUscita) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const importo = yield this.calcolaImporto(transitoId, dataOraUscita);
                // Aggiorna il record con l'uscita e l'importo calcolato
                const [numUpdated, transitoAggiornato] = yield transito_1.default.update({ uscita: dataOraUscita, importo: importo }, { where: { id: transitoId }, returning: true });
                if (numUpdated === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato per l\'aggiornamento');
                }
                return transitoAggiornato[0]; // Restituisce il transito aggiornato
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nell'aggiornamento del transito con importo: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto nell\'aggiornamento del transito con importo');
                }
            }
        });
    }
}
exports.default = new TransitoRepository();
