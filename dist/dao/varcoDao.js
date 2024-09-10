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
     * Recupera tutti i varchi.
     *
     * @returns {Promise<Varco[]>} Promise che restituice un array di varchi.
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield varco_1.default.findAll();
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un errore nel recupero dei varchi');
            }
        });
    }
    /**
     * Recupero del varco per ID.
     *
     * @param {number} id del varco.
     * @returns {Promise<Varco | null>} Promise che restituisce un varco o restituisce null se non esistente.
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const varco = yield varco_1.default.findByPk(id);
                if (!varco) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il varco con l'id ${id} inesistente`);
                }
                return varco;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nel recupero del varco con id ${id}`);
            }
        });
    }
    /**
     * Crea un nuovo varco.
     *
     * @param {VarcoAttributes} item dati per generare il varco.
     * @returns {Promise<Varco>} Promise che restituisce il varco appena creato.
     */
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield varco_1.default.create(item);
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un errore nella creazione del varco');
            }
        });
    }
    /**
     * Aggiorna un varco esistente.
     *
     * @param {number} id id attribuito al varco.
     * @param {VarcoAttributes} item dati necessari per l'aggiornamento del varco
     * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto, false in caso contrario.
     */
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [affectedCount] = yield varco_1.default.update(item, {
                    where: { id },
                    returning: true,
                });
                return affectedCount > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nell'aggiornamento del varco con id ${id}`);
            }
        });
    }
    /**
     * Cancella un varco per ID.
     *
     * @param {number} id id del varco.
     * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta, false in caso contrario.
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield varco_1.default.destroy({ where: { id } });
                return result > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nella cancellazione del varco con id ${id}`);
            }
        });
    }
    /**
     * Recupera tutti i varchi di un parcheggio specifico.
     *
     * @param {number} idParcheggio ID del parcheggio.
     * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi del parcheggio specificato.
     */
    findByParcheggio(idParcheggio) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield varco_1.default.findAll({
                    where: { id_parcheggio: idParcheggio },
                });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nel recupero dei varchi per il parcheggio con id ${idParcheggio}`);
            }
        });
    }
    /**
     * Recupera tutti i varchi bidirezionali.
     *
     * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi bidirezionali.
     */
    findBidirezionali() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield varco_1.default.findAll({
                    where: { bidirezionale: true },
                });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un errore nel recupero dei varchi bidirezionali');
            }
        });
    }
    /**
     * Recupera tutti i varchi di un tipo specifico (INGRESSO o USCITA).
     *
     * @param {('INGRESSO' | 'USCITA')} tipo Tipo del varco.
     * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi del tipo specificato.
     */
    findByTipo(tipo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield varco_1.default.findAll({
                    where: { tipo },
                });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nel recupero dei varchi di tipo ${tipo}`);
            }
        });
    }
}
exports.default = new VarcoDao();
