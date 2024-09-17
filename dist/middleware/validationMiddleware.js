"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorFactory_1 = require("../ext/errorFactory");
const dateUtils_1 = require("../ext/dateUtils");
const validateParcheggio = (req, res, next) => {
    const { nome, capacita, varchi, posti_disponibili } = req.body;
    // Verifica che 'nome' sia presente e sia una stringa
    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Nome è obbligatorio e deve essere una stringa valida'));
    }
    // Verifica che 'capacita' sia un numero intero positivo
    if (typeof capacita !== 'number' ||
        !Number.isInteger(capacita) ||
        capacita <= 0) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Capacità è obbligatoria e deve essere un numero intero positivo'));
    }
    // Verifica che 'varchi' sia un array (se fornito)
    if (varchi && !Array.isArray(varchi)) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'I varchi devono essere un array'));
    }
    // Verifica la validità di ciascun 'varco'
    if (varchi) {
        for (const varco of varchi) {
            if (!['INGRESSO', 'USCITA'].includes(varco.tipo) ||
                typeof varco.bidirezionale !== 'boolean') {
                return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Ogni varco deve avere un tipo valido ("INGRESSO" o "USCITA") e un valore bidirezionale booleano'));
            }
        }
    }
    // Impedisce all'utente di impostare 'posti_disponibili' manualmente
    if (posti_disponibili !== undefined) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Non è permesso impostare manualmente "posti_disponibili"'));
    }
    next();
};
const validateVarco = (req, res, next) => {
    const { tipo, bidirezionale, id_parcheggio } = req.body;
    // Verifica che 'tipo' sia presente e sia 'INGRESSO' o 'USCITA'
    if (!tipo || !['INGRESSO', 'USCITA'].includes(tipo)) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Tipo è obbligatorio e deve essere "INGRESSO" o "USCITA"'));
    }
    // Verifica che 'bidirezionale' sia booleano
    if (typeof bidirezionale !== 'boolean') {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, 'Bidirezionale è obbligatorio e deve essere un valore booleano (true o false)'));
    }
    // Verifica che 'id_parcheggio' esista e sia un numero intero positivo
    if (!id_parcheggio ||
        typeof id_parcheggio !== 'number' ||
        !Number.isInteger(id_parcheggio) ||
        id_parcheggio <= 0) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.MALFORMED_ID, 'id_parcheggio è obbligatorio e deve essere un numero intero positivo'));
    }
    next();
};
const validateTariffa = (req, res, next) => {
    const { id_tipo_veicolo, importo, fascia_oraria, id_parcheggio, feriale_festivo, } = req.body;
    // Verifica che l'id del tipi di veicolo sia un numero intero positivo
    if (!id_tipo_veicolo ||
        typeof id_tipo_veicolo !== 'number' ||
        !Number.isInteger(id_tipo_veicolo) ||
        id_tipo_veicolo <= 0) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.MALFORMED_ID, "'id_tipo_veicolo' è obbligatorio e deve essere un numero intero positivo"));
    }
    // Verifica che 'importo' sia un numero positivo
    if (typeof importo !== 'number' || importo <= 0) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'importo' è obbligatorio e deve essere un numero positivo"));
    }
    // Verifica che 'fascia_oraria' sia valida (DIURNA o NOTTURNA)
    if (!['DIURNA', 'NOTTURNA'].includes(fascia_oraria)) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'fascia_oraria' deve essere 'DIURNA' o 'NOTTURNA'"));
    }
    // Verifica che 'id_parcheggio' sia un numero intero positivo
    if (!id_parcheggio ||
        typeof id_parcheggio !== 'number' ||
        !Number.isInteger(id_parcheggio) ||
        id_parcheggio <= 0) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.MALFORMED_ID, "'id_parcheggio' è obbligatorio e deve essere un numero intero positivo"));
    }
    // Verifica che 'feriale_festivo' sia valido
    if (!['FERIALE', 'FESTIVO'].includes(feriale_festivo)) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'feriale_festivo' deve essere 'FERIALE' o 'FESTIVO'"));
    }
    next();
};
const validateTransito = (req, res, next) => {
    const { targa, id_tipo_veicolo, id_varco_ingresso } = req.body;
    // Verifica che 'targa' sia presente e sia una stringa valida
    if (!targa || typeof targa !== 'string' || targa.trim() === '') {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'targa' è obbligatorio e deve essere una stringa valida"));
    }
    // Verifica che 'id_tipo_veicolo' sia un numero intero positivo
    if (!id_tipo_veicolo ||
        typeof id_tipo_veicolo !== 'number' ||
        !Number.isInteger(id_tipo_veicolo) ||
        id_tipo_veicolo <= 0) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.MALFORMED_ID, "'id_tipo_veicolo' è obbligatorio e deve essere un numero intero positivo"));
    }
    // Verifica che 'id_varco_ingresso' sia un numero intero positivo
    if (!id_varco_ingresso ||
        typeof id_varco_ingresso !== 'number' ||
        !Number.isInteger(id_varco_ingresso) ||
        id_varco_ingresso <= 0) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.MALFORMED_ID, "'id_varco_ingresso' è obbligatorio e deve essere un numero intero positivo"));
    }
    next();
};
const validateUpdateUscita = (req, res, next) => {
    const { id } = req.params;
    const { id_varco_uscita } = req.body;
    // Verifica che 'id' sia presente nei parametri e sia un numero intero positivo
    if (!id ||
        isNaN(Number(id)) ||
        !Number.isInteger(Number(id)) ||
        Number(id) <= 0) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.MALFORMED_ID, "L'ID del transito fornito non è valido. Deve essere un numero intero positivo."));
    }
    // Verifica che 'id_varco_uscita' sia un numero intero positivo
    if (!id_varco_uscita ||
        typeof id_varco_uscita !== 'number' ||
        !Number.isInteger(id_varco_uscita) ||
        id_varco_uscita <= 0) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.MALFORMED_ID, "'id_varco_uscita' è obbligatorio e deve essere un numero intero positivo"));
    }
    next();
};
const validateExportTransiti = (req, res, next) => {
    const { targhe, from, to, formato } = req.body;
    // Verifica che 'targhe' sia un array di stringhe
    if (!Array.isArray(targhe) ||
        targhe.length === 0 ||
        !targhe.every((targa) => typeof targa === 'string' && targa.trim() !== '')) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'targhe' è obbligatorio e deve essere un array di stringhe non vuote"));
    }
    // Verifica che 'from' e 'to' siano date ISO valide
    if (!from || !(0, dateUtils_1.isValidISODate)(from)) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'from' è obbligatorio e deve essere una data ISO valida"));
    }
    if (!to || !(0, dateUtils_1.isValidISODate)(to)) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'to' è obbligatorio e deve essere una data ISO valida"));
    }
    // Verifica che 'formato' sia valido ('csv' o 'pdf')
    if (!['csv', 'pdf'].includes(formato)) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'formato' deve essere 'csv' o 'pdf'"));
    }
    next();
};
const validateStatistiche = (req, res, next) => {
    const { from, to } = req.body;
    // Verifica che 'from' e 'to' siano stringhe e rappresentino date ISO valide
    if (!from || typeof from !== 'string' || !(0, dateUtils_1.isValidISODate)(from)) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'from' è obbligatorio e deve essere una stringa rappresentante una data ISO valida"));
    }
    if (!to || typeof to !== 'string' || !(0, dateUtils_1.isValidISODate)(to)) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'to' è obbligatorio e deve essere una stringa rappresentante una data ISO valida"));
    }
    next();
};
const validateStatisticheParcheggio = (req, res, next) => {
    const { idParcheggio, from, to } = req.body;
    // Verifica che 'idParcheggio' sia un numero intero positivo
    if (!idParcheggio ||
        typeof idParcheggio !== 'number' ||
        !Number.isInteger(idParcheggio) ||
        idParcheggio <= 0) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.MALFORMED_ID, "'idParcheggio' è obbligatorio e deve essere un numero intero positivo"));
    }
    // Verifica che 'from' e 'to' siano stringhe e rappresentino date ISO valide
    if (!from || typeof from !== 'string' || !(0, dateUtils_1.isValidISODate)(from)) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'from' è obbligatorio e deve essere una stringa rappresentante una data ISO valida"));
    }
    if (!to || typeof to !== 'string' || !(0, dateUtils_1.isValidISODate)(to)) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.INVALID_INPUT, "'to' è obbligatorio e deve essere una stringa rappresentante una data ISO valida"));
    }
    next();
};
/**
 * Middleware per la validazione dell'ID nei parametri delle rotte.
 */
const validateIdParam = (req, res, next) => {
    const { id } = req.params;
    // Verifica che l'ID sia presente e sia un numero intero positivo
    if (!id ||
        isNaN(Number(id)) ||
        !Number.isInteger(Number(id)) ||
        Number(id) <= 0) {
        return next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.MALFORMED_ID, "L'ID fornito non è valido. Deve essere un numero intero positivo."));
    }
    next();
};
exports.default = {
    validateParcheggio,
    validateVarco,
    validateTariffa,
    validateTransito,
    validateUpdateUscita,
    validateExportTransiti,
    validateStatistiche,
    validateStatisticheParcheggio,
    validateIdParam,
};
