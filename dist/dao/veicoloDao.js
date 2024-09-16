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
const veicolo_1 = __importDefault(require("../models/veicolo"));
const errorFactory_1 = require("../ext/errorFactory");
const tipoVeicolo_1 = __importDefault(require("../models/tipoVeicolo"));
const sequelize_1 = require("sequelize");
// Classe VeicoloDao che implementa l'interfaccia DaoI per Veicolo
class VeicoloDao {
    /**
     * Recupera tutti i veicoli.
     *
     * @returns {Promise<Veicolo[]>} Promise che restituisce un array di veicoli.
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield veicolo_1.default.findAll();
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un problema nel recupero dei veicoli');
            }
        });
    }
    /**
     * Recupera un veicolo per ID.
     *
     * @param {number} id del veicolo.
     * @returns {Promise<Veicolo | null>} Promise che restituisce un veicolo o null se non esistente.
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const veicolo = yield veicolo_1.default.findByPk(id);
                if (!veicolo) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il veicolo con id ${id} è inesistente`);
                }
                return veicolo;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nel recupero del veicolo con id ${id}`);
            }
        });
    }
    /**
     * Crea un nuovo veicolo.
     *
     * @param {VeicoloAttributes} item dati per generare il veicolo.
     * @returns {Promise<Veicolo>} Promise che restituisce il veicolo appena creato.
     */
    create(item, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield veicolo_1.default.create(item, { transaction });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un errore nella creazione del veicolo');
            }
        });
    }
    /**
     * Aggiorna un veicolo esistente.
     *
     * @param {number} id id attribuito al veicolo.
     * @param {VeicoloAttributes} item dati necessari per l'aggiornamento del veicolo
     * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto, false in caso contrario.
     */
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [affectedCount] = yield veicolo_1.default.update(item, {
                    where: { id },
                    returning: true,
                });
                return affectedCount > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nell'aggiornamento del veicolo con id ${id}`);
            }
        });
    }
    /**
     * Cancella un veicolo per ID.
     *
     * @param {number} id id del veicolo.
     * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta, false in caso contrario.
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield veicolo_1.default.destroy({ where: { id } });
                return result > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nella cancellazione del veicolo con id ${id}`);
            }
        });
    }
    /**
     * Recupera un veicolo per targa.
     *
     * @param {string} targa La targa del veicolo da cercare.
     * @returns {Promise<Veicolo | null>} Promise che restituisce il veicolo trovato o null se non esistente.
     */
    findByTarga(targa) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield veicolo_1.default.findOne({ where: { targa } });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nella ricerca del veicolo con targa ${targa}`);
            }
        });
    }
    /**
     * Recupera veicoli per più targhe.
     *
     * @param {string[]} targhe Array di targhe dei veicoli da cercare.
     * @returns {Promise<Veicolo[]>} Promise che restituisce un array di veicoli corrispondenti alle targhe specificate.
     */
    findByTarghe(targhe) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield veicolo_1.default.findAll({
                    where: {
                        targa: {
                            [sequelize_1.Op.in]: targhe,
                        },
                    },
                });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nella ricerca dei veicoli per le targhe specificate`);
            }
        });
    }
    /**
     * Recupera un veicolo per ID con il TipoVeicolo associato.
     *
     * @param {number} id ID del veicolo.
     * @returns {Promise<Veicolo | null>} Promise che restituisce un veicolo con il TipoVeicolo o null se non esistente.
     */
    findByIdWithTipoVeicolo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield veicolo_1.default.findByPk(id, {
                    include: [
                        {
                            model: tipoVeicolo_1.default,
                            as: 'tipoVeicolo',
                        },
                    ],
                });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nel recupero del veicolo con id ${id} e il suo TipoVeicolo`);
            }
        });
    }
}
exports.default = new VeicoloDao();
