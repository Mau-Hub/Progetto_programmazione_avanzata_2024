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
const varcoDao_1 = __importDefault(require("../dao/varcoDao"));
const utenteDao_1 = __importDefault(require("../dao/utenteDao"));
const database_1 = __importDefault(require("../db/database"));
const errorFactory_1 = require("../ext/errorFactory");
const errorFactory_2 = require("../ext/errorFactory");
class VarcoRepository {
    constructor() {
        this.sequelize = database_1.default.getInstance();
    }
    /**
     * Creazione di un nuovo varco
     *
     * @param {VarcoCreationAttributes} varcoData
     * @returns {Promise<Varco>}
     */
    create(varcoData) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.sequelize.transaction();
            try {
                // Crea il nuovo varco
                const nuovoVarco = yield varcoDao_1.default.create(varcoData, transaction);
                // Crea l'utente "varco" associato
                yield utenteDao_1.default.create({
                    nome: `UtenteVarco-${nuovoVarco.id}`,
                    ruolo: 'varco',
                    username: `varco${nuovoVarco.id}`,
                }, transaction);
                yield transaction.commit();
                return nuovoVarco;
            }
            catch (error) {
                yield transaction.rollback();
                if (error instanceof errorFactory_2.CustomHttpError) {
                    // Rilancia l'errore originale se è un errore gestito
                    throw error;
                }
                else {
                    // Genera un nuovo errore per gli errori non gestiti
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Errore nella creazione del varco e dell'utente varco");
                }
            }
        });
    }
    /**
     * Ottenere tutti i varchi
     *
     * @returns {Promise<Varco[]>}
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // Chiama il metodo del DAO per ottenere tutti i varchi
            return varcoDao_1.default.findAll();
        });
    }
    /**
     * Ottenere un varco specifico per ID
     *
     * @param {number} id
     * @returns {Promise<Varco | null>}
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chiama il metodo del DAO per ottenere il varco con un ID specifico
            return varcoDao_1.default.findById(id);
        });
    }
    /**
     * Aggiornare un varco
     *
     * @param {number} id
     * @param {Partial<VarcoAttributes>} varcoData
     * @returns {Promise<boolean>}
     */
    update(id, varcoData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chiama il metodo del DAO per aggiornare un varco
            return varcoDao_1.default.update(id, varcoData);
        });
    }
    /**
     * Eliminare un varco
     *
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chiama il metodo del DAO per eliminare un varco
            return varcoDao_1.default.delete(id);
        });
    }
    /**
     * Ottenere tutti i varchi di un parcheggio specifico
     *
     * @param {number} idParcheggio
     * @returns {Promise<Varco[]>}
     */
    findByParcheggio(idParcheggio) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chiama il metodo del DAO per ottenere tutti i varchi di un parcheggio specifico
            return varcoDao_1.default.findByParcheggio(idParcheggio);
        });
    }
    /**
     * Ottenere tutti i varchi bidirezionali
     *
     * @returns {Promise<Varco[]>}
     */
    findBidirezionali() {
        return __awaiter(this, void 0, void 0, function* () {
            // Chiama il metodo del DAO per ottenere tutti i varchi bidirezionali
            return varcoDao_1.default.findBidirezionali();
        });
    }
    /**
     * Ottenere tutti i varchi di un tipo specifico
     *
     * @param {('INGRESSO' | 'USCITA')} tipo
     * @returns {Promise<Varco[]>}
     */
    findByTipo(tipo) {
        return __awaiter(this, void 0, void 0, function* () {
            // Chiama il metodo del DAO per ottenere tutti i varchi di un tipo specifico
            return varcoDao_1.default.findByTipo(tipo);
        });
    }
}
exports.default = new VarcoRepository();
