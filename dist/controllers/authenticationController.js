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
exports.login = void 0;
const utente_1 = __importDefault(require("../models/utente"));
const jwt_1 = require("../ext/jwt");
const errorFactory_1 = require("../ext/errorFactory");
const http_status_codes_1 = require("http-status-codes");
/**
 * Gestisce le richieste di login degli utenti, verificando l'username e generando un token JWT se l'utente esiste.
 */
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Recupera l'username dal corpo della richiesta
        const { username } = req.body;
        if (!username) {
            // Se l'username non viene fornito, ritorna un errore di richiesta errata
            return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Nome utente non fornito'));
        }
        // Cerca un utente nel database utilizzando il username fornito
        const utente = yield utente_1.default.findOne({ where: { username } });
        if (!utente) {
            // Se l'utente non viene trovato, genera un errore di autorizzazione
            return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.AUTH_FAILED, `Nessun utente trovato con il nome utente ${username}`));
        }
        // Se l'utente esiste, genera un token JWT utilizzando l'id utente, il nome e il ruolo
        const token = (0, jwt_1.generateToken)({ id: utente.id, nome: utente.nome, ruolo: utente.ruolo });
        // Restituisce il token generato con uno stato di successo
        res.status(http_status_codes_1.StatusCodes.OK).json({ token });
    }
    catch (error) {
        // Gestisce eventuali altri errori durante il processo di login
        next(error);
    }
});
exports.login = login;
