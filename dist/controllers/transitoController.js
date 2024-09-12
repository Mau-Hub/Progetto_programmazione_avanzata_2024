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
const transitoRepository_1 = __importDefault(require("../repositories/transitoRepository"));
const errorFactory_1 = require("../ext/errorFactory");
class TransitoController {
    // Creazione di un transito
    createTransito(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nuovoTransito = yield transitoRepository_1.default.create(req.body);
                res.status(201).json(nuovoTransito);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, error.message));
                }
                else {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto durante la creazione del transito'));
                }
            }
        });
    }
    // Ottenere tutti i transiti
    getAllTransiti(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transiti = yield transitoRepository_1.default.findAll();
                res.status(200).json(transiti);
            }
            catch (error) {
                next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero dei transiti'));
            }
        });
    }
    // Ottenere un transito specifico per ID
    getTransitoById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transito = yield transitoRepository_1.default.findById(Number(req.params.id));
                if (!transito) {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato'));
                }
                res.status(200).json(transito);
            }
            catch (error) {
                next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero del transito'));
            }
        });
    }
    // Aggiornamento di un transito
    updateTransito(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield transitoRepository_1.default.update(Number(req.params.id), req.body);
                if (success) {
                    const transitoAggiornato = yield transitoRepository_1.default.findById(Number(req.params.id));
                    return res.status(200).json(transitoAggiornato);
                }
                else {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato'));
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nell'aggiornamento del transito: ${error.message}`));
                }
                else {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto durante l\'aggiornamento del transito'));
                }
            }
        });
    }
    // Eliminazione di un transito
    deleteTransito(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield transitoRepository_1.default.delete(Number(req.params.id));
                if (success) {
                    return res.status(204).send();
                }
                else {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato'));
                }
            }
            catch (error) {
                next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante l\'eliminazione del transito'));
            }
        });
    }
    // Gestione dell'uscita del veicolo
    exitTransito(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transitoId = Number(req.params.id);
                const dataOraUscita = new Date();
                const transitoAggiornato = yield transitoRepository_1.default.aggiornaTransitoConImporto(transitoId, dataOraUscita);
                if (!transitoAggiornato) {
                    return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato'));
                }
                res.status(200).json(transitoAggiornato);
            }
            catch (error) {
                if (error instanceof Error) {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante l'uscita del veicolo: ${error.message}`));
                }
                else {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto durante l\'uscita del veicolo'));
                }
            }
        });
    }
}
exports.default = new TransitoController();
