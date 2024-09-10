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
const varcoRepository_1 = __importDefault(require("../repositories/varcoRepository"));
const errorFactory_1 = require("../ext/errorFactory");
class VarcoController {
    // Creazione di un varco
    createVarco(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nuovoVarco = yield varcoRepository_1.default.create(req.body);
                res.status(201).json(nuovoVarco);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Ottenere tutti i varchi
    getAllVarchi(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const varchi = yield varcoRepository_1.default.findAll();
                res.status(200).json(varchi);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Ottenere un varco specifico per ID
    getVarcoById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const varco = yield varcoRepository_1.default.findById(Number(req.params.id));
                if (!varco) {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Varco non trovato'));
                }
                res.status(200).json(varco);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Aggiornamento di un varco
    updateVarco(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield varcoRepository_1.default.update(Number(req.params.id), req.body);
                if (success) {
                    const varcoAggiornato = yield varcoRepository_1.default.findById(Number(req.params.id));
                    return res.status(200).json(varcoAggiornato);
                }
                else {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Varco non trovato'));
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Eliminazione di un varco
    deleteVarco(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield varcoRepository_1.default.delete(Number(req.params.id));
                if (success) {
                    return res.status(204).send();
                }
                else {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Varco non trovato'));
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new VarcoController();
