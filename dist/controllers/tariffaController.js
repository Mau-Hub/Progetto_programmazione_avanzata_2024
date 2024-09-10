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
const tariffaRepository_1 = __importDefault(require("../repositories/tariffaRepository"));
const errorFactory_1 = require("../ext/errorFactory");
class TariffaController {
    // Creazione di una nuova tariffa per parcheggio
    createTariffa(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nuovaTariffa = yield tariffaRepository_1.default.create(req.body);
                res.status(201).json(nuovaTariffa);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Lettura di tutte le tariffe disponibili
    getAllTariffe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tariffe = yield tariffaRepository_1.default.findAll();
                res.status(200).json(tariffe);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Lettura di una tariffa specifica per ID
    getTariffaById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tariffa = yield tariffaRepository_1.default.findById(Number(req.params.id));
                if (!tariffa) {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Tariffa non trovata'));
                }
                res.status(200).json(tariffa);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Aggiornamento di una tariffa per parcheggio
    updateTariffa(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield tariffaRepository_1.default.update(Number(req.params.id), req.body);
                if (success) {
                    const tariffaAggiornata = yield tariffaRepository_1.default.findById(Number(req.params.id));
                    return res.status(200).json(tariffaAggiornata);
                }
                else {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Tariffa non trovata'));
                }
            }
            catch (error) {
                if (error.message === 'Tariffa non trovata') {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Tariffa non trovata'));
                }
                next(error);
            }
        });
    }
    // Eliminazione di una tariffa per ID
    deleteTariffa(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield tariffaRepository_1.default.delete(Number(req.params.id));
                if (success) {
                    return res.status(204).send();
                }
                else {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Tariffa non trovata'));
                }
            }
            catch (error) {
                if (error.message === 'Tariffa non trovata') {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Tariffa non trovata'));
                }
                next(error);
            }
        });
    }
}
exports.default = new TariffaController();
