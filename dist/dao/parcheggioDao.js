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
Object.defineProperty(exports, "__esModule", { value: true });
const errorFactory_1 = require("../ext/errorFactory");
const parcheggio_1 = require("../models/parcheggio");
// Classe ParcheggioDao che implementa l'interfaccia DaoI per Parcheggio
class ParcheggioDao {
    /**
     * Recupera tutti i parcheggi.
     *
     * @returns {Promise<Parcheggio[]>} Promise che restituisce un array di parcheggi.
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield parcheggio_1.Parcheggio.findAll();
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un problema nel recupero dei parcheggi');
            }
        });
    }
    /**
     * Recupero del parcheggio per ID.
     *
     * @param {number} id del parcheggio.
     * @returns {Promise<Parcheggio | null>} Promise che restituisce un parcheggio o restituisce null se non esistente.
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parcheggio = yield parcheggio_1.Parcheggio.findByPk(id);
                if (!parcheggio) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il parcheggio con id ${id} è inesistente`);
                }
                return parcheggio;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `SI è verificato un errore nel recupero del parcheggio con id ${id}`);
            }
        });
    }
    /**
     * Crea un nuovo parcheggio.
     *
     * @param {ParcheggioAttributes} item dati per generare il parcheggio.
     * @returns {Promise<Parcheggio>} Promise che restituisce il parcheggio appena creato.
     */
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield parcheggio_1.Parcheggio.create(item);
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Si è verificato un errore nella creazione del parcheggio');
            }
        });
    }
    /**
     * Aggiorna un parcheggio esistente.
     *
     * @param {number} id id attribuito al parcheggio.
     * @param {ParcheggioAttributes} item dati necessari per l’aggiornamento del parcheggio
     * @returns {Promise<boolean>} “Promise che restituisce true se l’aggiornamento è avvenuto, false in caso contrario.
     */
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [affectedCount] = yield parcheggio_1.Parcheggio.update(item, {
                    where: { id },
                    returning: true,
                });
                return affectedCount > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nell'aggiornamento del parcheggio con id ${id}`);
            }
        });
    }
    /**
     * Cancella un parcheggio per ID.
     *
     * @param {number} id id del parcheggio.
     * @returns {Promise<boolean>} Promise che resitutisce true se la cancellazione è avvenuta, false in caso contrario.
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield parcheggio_1.Parcheggio.destroy({ where: { id } });
                return result > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Si è verificato un errore nella cancellazione del parcheggio con id ${id}`);
            }
        });
    }
}
exports.default = new ParcheggioDao();
