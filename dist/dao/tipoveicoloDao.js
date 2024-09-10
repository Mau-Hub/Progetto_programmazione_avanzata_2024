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
const tipoVeicolo_1 = __importDefault(require("../models/tipoVeicolo"));
const errorFactory_1 = require("../ext/errorFactory");
// Classe TipoVeicoloDao che implementa l'interfaccia DaoI per TipoVeicolo
class TipoVeicoloDao {
    /**
     * Recupera tutti i tipi di veicoli.
     *
     * @returns {Promise<TipoVeicolo[]>} Promise che restituisce un array di tipi di veicolo.
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield tipoVeicolo_1.default.findAll();
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un problema nel recupero dei tipi di veicolo');
            }
        });
    }
    /**
     * Recupero del tipo di veicolo per ID.
     *
     * @param {number} id del tipo di veicolo.
     * @returns {Promise<TipoVeicolo | null>} Promise che restituisce un tipo di veicolo o null se non esistente.
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tipoVeicolo = yield tipoVeicolo_1.default.findByPk(id);
                if (!tipoVeicolo) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il tipo di veicolo con id ${id} è inesistente`);
                }
                return tipoVeicolo;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nel recupero del tipo di veicolo con id ${id}`);
            }
        });
    }
    /**
     * Crea un nuovo tipo di veicolo.
     *
     * @param {TipoVeicoloAttributes} item Dati per creare il nuovo tipo di veicolo.
     * @returns {Promise<TipoVeicolo>} Promise che restituisce il tipo di veicolo appena creato.
     */
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield tipoVeicolo_1.default.create(item);
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un errore nella creazione del tipo di veicolo');
            }
        });
    }
    /**
     * Aggiorna un tipo di veicolo esistente.
     *
     * @param {number} id ID del tipo di veicolo da aggiornare.
     * @param {TipoVeicoloAttributes} item Dati aggiornati del tipo di veicolo.
     * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto con successo, false in caso contrario.
     */
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [affectedCount] = yield tipoVeicolo_1.default.update(item, {
                    where: { id },
                    returning: true,
                });
                return affectedCount > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nell'aggiornamento del tipo di veicolo con id ${id}`);
            }
        });
    }
    /**
     * Cancella un tipo di veicolo per ID.
     *
     * @param {number} id ID del tipo di veicolo da cancellare.
     * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta, false in caso contrario.
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield tipoVeicolo_1.default.destroy({ where: { id } });
                return result > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nella cancellazione del tipo di veicolo con id ${id}`);
            }
        });
    }
}
exports.default = new TipoVeicoloDao();
