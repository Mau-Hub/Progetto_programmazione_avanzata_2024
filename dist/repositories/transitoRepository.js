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
const transitoDao_1 = __importDefault(require("../dao/transitoDao")); // Assicurati che il percorso sia corretto
const parcheggio_1 = __importDefault(require("../models/parcheggio"));
const transitoService_1 = __importDefault(require("../ext/transitoService"));
const errorFactory_1 = require("../ext/errorFactory");
class TransitoRepository {
    constructor() {
        this.transitoDao = transitoDao_1.default;
    }
    // Creazione di un nuovo transito con controllo sulla capacità del parcheggio
    create(transitoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parcheggio = yield parcheggio_1.default.findByPk(transitoData.id_posto);
                if (!parcheggio) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Parcheggio non trovato');
                }
                // Controllo sulla capacità del parcheggio
                const postiOccupati = yield this.transitoDao.findAll({
                    where: { id_posto: parcheggio.id, uscita: null },
                });
                if (postiOccupati.length >= parcheggio.capacita) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Parcheggio pieno');
                }
                return yield this.transitoDao.create(transitoData);
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
                return yield this.transitoDao.findAll();
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nel recupero dei transiti: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto nel recupero dei transiti');
                }
            }
        });
    }
    // Ottenere un transito specifico per ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.transitoDao.findById(id);
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
                return yield this.transitoDao.update(id, transitoData);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nell'aggiornamento del transito: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Errore sconosciuto nell'aggiornamento del transito");
                }
            }
        });
    }
    // Eliminare un transito
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.transitoDao.delete(id);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nell'eliminazione del transito: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Errore sconosciuto nell'eliminazione del transito");
                }
            }
        });
    }
    // Calcolo dell'importo basato su durata e fascia oraria e giorni feriali/festivi
    calcolaImporto(transitoId, dataOraUscita) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield transitoService_1.default.calcolaImporto(transitoId, dataOraUscita);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nel calcolo dell'importo: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Errore sconosciuto nel calcolo dell'importo");
                }
            }
        });
    }
    // Aggiorna il transito con l'uscita e l'importo calcolato
    aggiornaTransitoConImporto(transitoId, dataOraUscita) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const importo = yield this.calcolaImporto(transitoId, dataOraUscita);
                const updated = yield this.transitoDao.update(transitoId, {
                    uscita: dataOraUscita,
                    importo,
                });
                if (!updated) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, "Transito non trovato per l'aggiornamento");
                }
                return yield this.findById(transitoId);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nell'aggiornamento del transito con importo: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Errore sconosciuto nell'aggiornamento del transito con importo");
                }
            }
        });
    }
}
exports.default = new TransitoRepository();
