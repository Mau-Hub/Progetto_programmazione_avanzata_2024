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
const veicolo_1 = __importDefault(require("../models/veicolo"));
const varco_1 = __importDefault(require("../models/varco"));
const tariffa_1 = __importDefault(require("../models/tariffa"));
const errorFactory_1 = require("../ext/errorFactory");
class TransitoDao {
    findAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield transito_1.default.findAll(Object.assign(Object.assign({}, options), { include: [
                        { model: veicolo_1.default, as: 'veicolo' },
                        { model: varco_1.default, as: 'varcoIngresso' },
                        { model: varco_1.default, as: 'varcoUscita' },
                        { model: tariffa_1.default, as: 'tariffa' },
                    ] }));
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero dei transiti');
            }
        });
    }
    findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transito = yield transito_1.default.findByPk(id, Object.assign(Object.assign({}, options), { include: [
                        { model: veicolo_1.default, as: 'veicolo' },
                        { model: varco_1.default, as: 'varcoIngresso' },
                        { model: varco_1.default, as: 'varcoUscita' },
                        { model: tariffa_1.default, as: 'tariffa' },
                    ] }));
                if (!transito) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il transito con id ${id} è inesistente`);
                }
                return transito;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nel recupero del transito con id ${id}`);
            }
        });
    }
    create(item, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield transito_1.default.create(item, { transaction });
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nella creazione del transito');
            }
        });
    }
    update(id, item, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [affectedCount] = yield transito_1.default.update(item, {
                    where: { id },
                    returning: true,
                    transaction,
                });
                if (affectedCount === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il transito con id ${id} non è stato trovato`);
                }
                return affectedCount > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nell'aggiornamento del transito con id ${id}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield transito_1.default.destroy({ where: { id } });
                if (result === 0) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, `Il transito con id ${id} non è stato trovato`);
                }
                return result > 0;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nella cancellazione del transito con id ${id}`);
            }
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transito = yield transito_1.default.findOne(Object.assign(Object.assign({}, options), { include: [
                        { model: veicolo_1.default, as: 'veicolo' },
                        { model: varco_1.default, as: 'varcoIngresso' },
                        { model: varco_1.default, as: 'varcoUscita' },
                        { model: tariffa_1.default, as: 'tariffa' },
                    ] }));
                if (!transito) {
                    return null; // Nessun errore se non trovato, ritorna semplicemente null
                }
                return transito;
            }
            catch (error) {
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante la ricerca del transito');
            }
        });
    }
}
exports.default = new TransitoDao();
