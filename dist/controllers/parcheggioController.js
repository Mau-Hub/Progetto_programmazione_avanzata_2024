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
const parcheggioRepository_1 = __importDefault(require("../repositories/parcheggioRepository"));
const errorFactory_1 = require("../ext/errorFactory");
class ParcheggioController {
    // Creazione di un parcheggio con varchi
    createParcheggio(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nuovoParcheggio = yield parcheggioRepository_1.default.create(req.body);
                res.status(201).json(nuovoParcheggio);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Lettura di tutti i parcheggi con varchi associati
    getAllParcheggi(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parcheggi = yield parcheggioRepository_1.default.findAll();
                res.status(200).json(parcheggi);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Lettura di un singolo parcheggio con varchi associati
    getParcheggioById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parcheggio = yield parcheggioRepository_1.default.findById(Number(req.params.id));
                if (!parcheggio) {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, "Parcheggio non trovato"));
                }
                res.status(200).json(parcheggio);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Aggiornamento di un parcheggio e dei suoi varchi
    updateParcheggio(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield parcheggioRepository_1.default.update(Number(req.params.id), req.body);
                if (success) {
                    const parcheggioAggiornato = yield parcheggioRepository_1.default.findById(Number(req.params.id));
                    return res.status(200).json(parcheggioAggiornato);
                }
                else {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, "Parcheggio non trovato"));
                }
            }
            catch (error) {
                if (error.message === 'Parcheggio non trovato') {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, "Parcheggio non trovato"));
                }
                next(error);
            }
        });
    }
    // Eliminazione di un parcheggio e dei suoi varchi
    deleteParcheggio(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield parcheggioRepository_1.default.delete(Number(req.params.id));
                if (success) {
                    return res.status(204).send();
                }
                else {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, "Parcheggio non trovato"));
                }
            }
            catch (error) {
                if (error.message === 'Parcheggio non trovato') {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, "Parcheggio non trovato"));
                }
                next(error);
            }
        });
    }
}
exports.default = new ParcheggioController();
