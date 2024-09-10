"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticationMiddleware = void 0;
const jwt_1 = require("../ext/jwt");
const errorFactory_1 = require("../ext/errorFactory");
/**
 * Middleware per l'autenticazione degli utenti tramite token JWT.
 * Controlla la presenza di un token di autenticazione e lo verifica.
 * Se il token è valido, aggiunge i dati dell'utente alla richiesta.
 */
const authenticationMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            // Nessun token fornito
            return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.AUTH_FAILED, 'Accesso negato: nessun token fornito.'));
        }
        const token = authHeader.replace('Bearer ', '');
        const decodedPayload = (0, jwt_1.verifyToken)(token);
        if (!decodedPayload) {
            // Token non valido o errore nella verifica
            return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_AUTH_TOKEN, 'Token di autenticazione non valido.'));
        }
        // Attacca le informazioni dell'utente decodificate alla richiesta
        req.user = decodedPayload;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticationMiddleware = authenticationMiddleware;
/**
 * Middleware per autorizzare gli utenti in base ai loro ruoli.
 * Controlla se l'utente autenticato ha uno dei ruoli specificati.
 *
 * @param roles - Lista di ruoli che hanno accesso alla risorsa.
 */
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                // Utente non autenticato
                return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.ACCESS_DENIED, 'Accesso negato: utente non autenticato.'));
            }
            if (!roles.includes(user.ruolo)) {
                // Utente non autorizzato per il ruolo richiesto
                return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.AUTH_FAILED, 'Accesso negato: ruolo utente non autorizzato.'));
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorizeRoles = authorizeRoles;
exports.default = { authenticationMiddleware: exports.authenticationMiddleware, authorizeRoles: exports.authorizeRoles };
