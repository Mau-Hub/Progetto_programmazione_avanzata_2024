"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
/**
 * Middleware per la gestione degli errori personalizzati in Express.
 * Questo middleware analizza un oggetto errore, estrae le informazioni rilevanti
 * e prepara una risposta strutturata da inviare al client.
 *
 * @param err: Istanza di CustomHttpError che rappresenta l'errore da gestire.
 * @param req: Oggetto Request di Express.
 * @param res: Oggetto Response di Express.
 * @param next: Funzione NextFunction per passare al middleware successivo, se necessario.
 */
const errorHandler = (err, req, res, next) => {
    // Determina il codice di stato HTTP da utilizzare nella risposta
    const statusCode = err.statusCode || 500;
    // Estrae il messaggio di errore dall'oggetto errore, con un messaggio di default
    const message = err.message || 'Errore interno del server';
    // Estrae il codice errore specifico dall'oggetto errore, con un codice di default
    const errorCode = err.errorCode || 'ERRORE_SERVER';
    // Costruisce la risposta JSON con i dettagli dell'errore da restituire al client
    res.status(statusCode).json({
        errore: {
            codiceStatus: statusCode,
            codiceErrore: errorCode,
            messaggio: message,
        },
    });
};
exports.errorHandler = errorHandler;
