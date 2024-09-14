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
const errorFactory_1 = require("../ext/errorFactory");
const tariffa_1 = __importDefault(require("../models/tariffa"));
const tipoVeicolo_1 = __importDefault(require("../models/tipoVeicolo"));
const parcheggio_1 = __importDefault(require("../models/parcheggio"));
// Creazione tariffa
class TariffaDao {
    // Creare una nuova tariffa
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tariffa = yield tariffa_1.default.create(item);
                return tariffa;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante la creazione della tariffa: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Trovare una tariffa per ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tariffa = yield tariffa_1.default.findByPk(id, {
                    include: [
                        { model: tipoVeicolo_1.default, as: 'tipoVeicolo' },
                        { model: parcheggio_1.default, as: 'parcheggio' },
                    ],
                });
                if (!tariffa) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `La tariffa con ID ${id} non è stata trovata`);
                }
                return tariffa;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante il recupero della tariffa con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Trovare una tariffa con criteri personalizzati
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tariffa = yield tariffa_1.default.findOne(options);
                // Se non trovi la tariffa, puoi decidere se lanciare un errore o restituire null.
                if (!tariffa) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Tariffa non trovata per i criteri specificati');
                }
                return tariffa;
            }
            catch (error) {
                // Questo cattura errori inaspettati come problemi di connessione al DB.
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante la ricerca della tariffa: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Ottenere tutte le tariffe
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tariffe = yield tariffa_1.default.findAll({
                    include: [
                        { model: tipoVeicolo_1.default, as: 'tipoVeicolo' },
                        { model: parcheggio_1.default, as: 'parcheggio' },
                    ],
                });
                return tariffe;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante il recupero di tutte le tariffe: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Aggiornare una tariffa
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield tariffa_1.default.update(item, {
                    where: { id },
                });
                if (result[0] === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `La tariffa con ID ${id} non esiste`);
                }
                return result[0] > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante l'aggiornamento della tariffa con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Eliminare una tariffa
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield tariffa_1.default.destroy({
                    where: { id },
                });
                if (result === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `La tariffa con ID ${id} non è stata trovata`);
                }
                return result > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante l'eliminazione della tariffa con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
}
exports.default = new TariffaDao();
