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
const varco_1 = __importDefault(require("../models/varco"));
const errorFactory_1 = require("../ext/errorFactory");
class VarcoDao {
    /**
     * Creazione di un nuovo varco.
     *
     * @param {VarcoCreationAttributes} varcoData Dati per la creazione del nuovo varco.
     * @returns {Promise<Varco>} Promise che restituisce il varco appena creato.
     */
    create(varcoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nuovoVarco = yield varco_1.default.create(varcoData);
                return nuovoVarco;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nella creazione del varco');
            }
        });
    }
    /**
     * Ottenere tutti i varchi.
     *
     * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi.
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const varchi = yield varco_1.default.findAll();
                return varchi;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero dei varchi');
            }
        });
    }
    /**
     * Ottenere un varco specifico per ID.
     *
     * @param {number} id ID del varco.
     * @returns {Promise<Varco | null>} Promise che restituisce un varco o null se non esistente.
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const varco = yield varco_1.default.findByPk(id);
                if (!varco) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Varco con ID ${id} non trovato`);
                }
                return varco;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero del varco');
            }
        });
    }
    /**
     * Aggiornare un varco.
     *
     * @param {number} id ID del varco da aggiornare.
     * @param {Partial<VarcoAttributes>} varcoData Dati parziali per aggiornare il varco.
     * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto con successo, false altrimenti.
     */
    update(id, varcoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [numUpdated] = yield varco_1.default.update(varcoData, { where: { id } });
                if (numUpdated === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Varco con ID ${id} non trovato`);
                }
                return numUpdated === 1;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nell\'aggiornamento del varco');
            }
        });
    }
    /**
     * Eliminare un varco.
     *
     * @param {number} id ID del varco da eliminare.
     * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta con successo, false altrimenti.
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const numDeleted = yield varco_1.default.destroy({ where: { id } });
                if (numDeleted === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Varco con ID ${id} non trovato`);
                }
                return numDeleted === 1;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nell\'eliminazione del varco');
            }
        });
    }
    /**
     * Ottenere tutti i varchi di un parcheggio specifico.
     *
     * @param {number} idParcheggio ID del parcheggio.
     * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi per il parcheggio specificato.
     */
    findByParcheggio(idParcheggio) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const varchi = yield varco_1.default.findAll({ where: { id_parcheggio: idParcheggio } });
                return varchi;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero dei varchi per il parcheggio specificato');
            }
        });
    }
    /**
     * Ottenere tutti i varchi bidirezionali.
     *
     * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi bidirezionali.
     */
    findBidirezionali() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const varchi = yield varco_1.default.findAll({ where: { bidirezionale: true } });
                return varchi;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero dei varchi bidirezionali');
            }
        });
    }
    /**
     * Ottenere tutti i varchi di un tipo specifico.
     *
     * @param {('INGRESSO' | 'USCITA')} tipo Tipo del varco da cercare.
     * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi del tipo specificato.
     */
    findByTipo(tipo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const varchi = yield varco_1.default.findAll({ where: { tipo } });
                return varchi;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero dei varchi per il tipo specificato');
            }
        });
    }
}
exports.default = new VarcoDao();
