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
class ParcheggioDao {
    // Metodo per ottenere tutti i parcheggi
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield parcheggio_1.Parcheggio.findAll();
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante il recupero di tutti i parcheggi');
            }
        });
    }
    // Metodo per trovare un parcheggio per ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parcheggio = yield parcheggio_1.Parcheggio.findByPk(id);
                if (!parcheggio) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il parcheggio con ID ${id} non esiste`);
                }
                return parcheggio;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante il recupero del parcheggio con ID ${id}`);
            }
        });
    }
    // Metodo per creare un nuovo parcheggio
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield parcheggio_1.Parcheggio.create(item);
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante la creazione del parcheggio');
            }
        });
    }
    // Metodo per aggiornare un parcheggio
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [affectedCount] = yield parcheggio_1.Parcheggio.update(item, {
                    where: { id },
                    returning: true,
                });
                if (affectedCount === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il parcheggio con ID ${id} non esiste`);
                }
                return affectedCount > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante l'aggiornamento del parcheggio con ID ${id}`);
            }
        });
    }
    // Metodo per eliminare un parcheggio
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield parcheggio_1.Parcheggio.destroy({ where: { id } });
                if (result === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il parcheggio con ID ${id} non è stato trovato`);
                }
                return result > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante l'eliminazione del parcheggio con ID ${id}`);
            }
        });
    }
}
exports.default = new ParcheggioDao();
