"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorFactory_1 = require("./errorFactory");
dotenv_1.default.config();
const secretKey = process.env.JWT_SECRET; // Recupera la chiave segreta JWT dalla variabile d'ambiente
/**
 * Genera un token JWT con un payload specificato e una durata di 1 ora.
 * @param payload Oggetto contenente le informazioni da includere nel token.
 * @returns Una stringa rappresentante il token JWT generato.
 */
const generateToken = (payload) => {
    try {
        return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '1h' });
    }
    catch (error) {
        throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante la generazione del token');
    }
};
exports.generateToken = generateToken;
/**
 * Verifica e decodifica un token JWT.
 * @param token Il token JWT da verificare.
 * @returns Il payload decodificato del token se valido, altrimenti null.
 */
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        if (typeof decoded === 'string') {
            return null; // Se il token decodificato è una stringa, restituisce null
        }
        return decoded; // Ritorna il payload decodificato se il token è valido
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.EXPIRED_TOKEN, 'Il token è scaduto');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            // Qui cattura il caso di un token completamente non valido, come "pippo"
            throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_AUTH_TOKEN, 'Token JWT non valido');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.JWT_ERROR, 'Token JWT non valido');
        }
        else {
            throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante la verifica del token');
        }
    }
};
exports.verifyToken = verifyToken;
