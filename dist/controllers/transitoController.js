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
                const { targa, id_tipo_veicolo, id_utente, id_varco_ingresso } = req.body;
                console.log('Dati in ingresso:', {
                    targa,
                    id_tipo_veicolo,
                    id_utente,
                    id_varco_ingresso,
                });
                // Creazione del transito passando i dati necessari
                const nuovoTransito = yield transitoRepository_1.default.create({
                    id_varco_ingresso: id_varco_ingresso,
                }, targa, id_tipo_veicolo, id_utente);
                console.log('Nuovo transito creato:', nuovoTransito);
                res.status(201).json(nuovoTransito);
            }
            catch (error) {
                console.error('Errore nel controller createTransito:', error); // Log dell'errore dettagliato
                if (error instanceof Error) {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, `Errore nella creazione del transito: ${error.message}`));
                }
                else {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto durante la creazione del transito'));
                }
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
                if (error instanceof Error) {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nel recupero del transito: ${error.message}`));
                }
                else {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto nel recupero del transito'));
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
                if (error instanceof Error) {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore durante l'eliminazione del transito: ${error.message}`));
                }
                else {
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Errore sconosciuto durante l'eliminazione del transito"));
                }
            }
        });
    }
    // Gestione dell'uscita del veicolo
    exitTransito(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transitoId = Number(req.params.id);
                const { id_varco_uscita } = req.body; // Prendi il varco di uscita dal body
                const dataOraUscita = new Date(); // Ora corrente per l'uscita
                const transitoAggiornato = yield transitoRepository_1.default.updateUscita(transitoId, id_varco_uscita, dataOraUscita);
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
                    next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Errore sconosciuto durante l'uscita del veicolo"));
                }
            }
        });
    }
}
exports.default = new TransitoController();
