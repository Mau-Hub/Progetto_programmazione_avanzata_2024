"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const errorFactory_1 = require("../ext/errorFactory");
/**
 * Middleware per la validazione delle richieste HTTP in ingresso.
 * Verifica se ci sono errori nei dati forniti nelle richieste e li gestisce adeguatamente.
 *
 * @param req - L'oggetto della richiesta HTTP.
 * @param res - L'oggetto della risposta HTTP.
 * @param next - Funzione per passare al middleware successivo.
 */
const validationRequest = (req, res, next) => {
    // Estrae eventuali errori di validazione dalla richiesta
    const validationErrors = (0, express_validator_1.validationResult)(req);
    // Se sono presenti errori di validazione, li raccoglie e genera un errore personalizzato
    if (!validationErrors.isEmpty()) {
        const errorMessages = validationErrors.array().map((error) => error.msg).join(', ');
        const validationError = errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, `Errore di validazione: ${errorMessages}`);
        // Passa l'errore generato al middleware di gestione degli errori
        return next(validationError);
    }
    // Se non ci sono errori, passa al middleware successivo
    next();
};
exports.default = validationRequest;
