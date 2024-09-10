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
const utente_1 = __importDefault(require("../models/utente"));
const errorFactory_1 = require("../ext/errorFactory");
class UtenteDao {
    /**
     * Recupera tutti gli utenti.
     *
     * @returns {Promise<Utente[]>} Promise che restituisce un array di utenti.
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield utente_1.default.findAll();
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un errore nel recupero degli utenti');
            }
        });
    }
    /**
     * Recupero dell'utente per ID.
     *
     * @param {number} id dell'utente.
     * @returns {Promise<Utente | null>} Promise che restituisce un utente o restituisce null se non esistente.
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utente = yield utente_1.default.findByPk(id);
                if (!utente) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `L'Utente con id ${id} inesistente`);
                }
                return utente;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nel recupero dell'utente con id ${id}`);
            }
        });
    }
    /**
     * Crea un nuovo utente.
     *
     * @param {UtenteAttributes} item dati per generare l'utente.
     * @returns {Promise<Utente>} Promise che restituisce l'utente appena creato.
     */
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield utente_1.default.create(item);
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Si è verificato un errore nella creazione dell'utente");
            }
        });
    }
    /**
     * Aggiorna un utente esistente.
     *
     * @param {number} id id attribuito all'utente.
     * @param {UtenteAttributes} item dati necessari per l'aggiornamento dell'utente
     * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto, false in caso contrario.
     */
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [affectedCount] = yield utente_1.default.update(item, {
                    where: { id },
                    returning: true,
                });
                return affectedCount > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nell'aggiornamento dell'utente con id ${id}`);
            }
        });
    }
    /**
     * Cancella un utente per ID.
     *
     * @param {number} id id dell'utente.
     * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta, false in caso contrario.
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield utente_1.default.destroy({ where: { id } });
                return result > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nella cancellazione dell'utente con id ${id}`);
            }
        });
    }
    /**
     * Recupera un utente per nome.
     *
     * @param {string} nome Nome dell'utente.
     * @returns {Promise<Utente | null>} Promise che restituisce un utente o null se non trovato.
     */
    findByNome(nome) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield utente_1.default.findOne({ where: { nome } });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nel recupero dell'utente con nome ${nome}`);
            }
        });
    }
    /**
     * Recupera tutti gli utenti per ruolo.
     *
     * @param {('operatore' | 'automobilista' | 'varco')} ruolo Ruolo degli utenti da recuperare.
     * @returns {Promise<Utente[]>} Promise che restituisce un array di utenti con il ruolo specificato.
     */
    findByRuolo(ruolo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield utente_1.default.findAll({ where: { ruolo } });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nel recupero degli utenti con ruolo ${ruolo}`);
            }
        });
    }
    /**
     * Recupera un utente per username.
     *
     * @param {string} username username dell'utente.
     * @returns {Promise<Utente | null>} Promise che restituisce un utente o null se non trovato.
     */
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield utente_1.default.findOne({ where: { username } });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Si è verificato un errore nel recupero dell'utente tramite username");
            }
        });
    }
}
exports.default = new UtenteDao();
