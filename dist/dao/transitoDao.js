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
const veicolo_1 = __importDefault(require("../models/veicolo")); // Importa il modello Veicolo
const varco_1 = __importDefault(require("../models/varco")); // Importa il modello Varco
const tariffa_1 = __importDefault(require("../models/tariffa")); // Importa il modello Tariffa
const posto_1 = __importDefault(require("../models/posto")); // Importa il modello Posto
const errorFactory_1 = require("../ext/errorFactory");
// Classe TransitoDao che implementa l'interfaccia DaoI per Transito
class TransitoDao {
    /**
     * Recupera tutti i transiti.
     *
     * @returns {Promise<Transito[]>} Promise che restituisce un array di transiti.
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield transito_1.default.findAll({
                    include: [
                        { model: veicolo_1.default, as: 'veicolo' },
                        { model: varco_1.default, as: 'varcoIngresso' },
                        { model: varco_1.default, as: 'varcoUscita' },
                        { model: tariffa_1.default, as: 'tariffa' },
                        { model: posto_1.default, as: 'posto' },
                    ],
                });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un problema nel recupero dei transiti');
            }
        });
    }
    /**
     * Recupero del transito per ID.
     *
     * @param {number} id del transito.
     * @returns {Promise<Transito | null>} Promise che restituisce un transito o restituisce null se non esistente.
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transito = yield transito_1.default.findByPk(id, {
                    include: [
                        { model: veicolo_1.default, as: 'veicolo' },
                        { model: varco_1.default, as: 'varcoIngresso' },
                        { model: varco_1.default, as: 'varcoUscita' },
                        { model: tariffa_1.default, as: 'tariffa' },
                        { model: posto_1.default, as: 'posto' },
                    ],
                });
                if (!transito) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il transito con id ${id} è inesistente`);
                }
                return transito;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nel recupero del transito con id ${id}`);
            }
        });
    }
    /**
     * Crea un nuovo transito.
     *
     * @param {TransitoAttributes} item dati per generare il transito.
     * @returns {Promise<Transito>} Promise che restituisce il transito appena creato.
     */
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield transito_1.default.create(item);
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un errore nella creazione del transito');
            }
        });
    }
    /**
     * Aggiorna un transito esistente.
     *
     * @param {number} id id attribuito al transito.
     * @param {TransitoAttributes} item dati necessari per l’aggiornamento del transito
     * @returns {Promise<boolean>} “Promise che restituisce true se l’aggiornamento è avvenuto, false in caso contrario.
     */
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [affectedCount] = yield transito_1.default.update(item, {
                    where: { id },
                    returning: true,
                });
                return affectedCount > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nell'aggiornamento del transito con id ${id}`);
            }
        });
    }
    /**
     * Cancella un transito per ID.
     *
     * @param {number} id id del transito.
     * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta, false in caso contrario.
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield transito_1.default.destroy({ where: { id } });
                return result > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nella cancellazione del transito con id ${id}`);
            }
        });
    }
}
exports.default = new TransitoDao();
