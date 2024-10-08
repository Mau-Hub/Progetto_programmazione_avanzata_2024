import { Request, Response, NextFunction } from 'express';
import { ApplicationErrorTypes, ErrorGenerator } from '../ext/errorFactory';
import { isValidISODate } from '../ext/dateUtils';

/**
 * Middleware di validazione per la creazione o l'aggiornamento di un parcheggio.
 *
 * Verifica che i campi 'nome', 'capacita', e 'varchi' siano validi e che 'posti_disponibili' non sia impostato manualmente.
 */
const validateParcheggio = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { nome, capacita, varchi, posti_disponibili } = req.body;

  // Verifica che 'nome' sia presente e sia una stringa non vuota
  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        'Nome è obbligatorio e deve essere una stringa valida'
      )
    );
  }

  // Verifica che 'capacita' sia un numero intero positivo
  if (
    typeof capacita !== 'number' ||
    !Number.isInteger(capacita) ||
    capacita <= 0
  ) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        'Capacità è obbligatoria e deve essere un numero intero positivo'
      )
    );
  }

  // Verifica che 'varchi' sia un array se è fornito
  if (varchi && !Array.isArray(varchi)) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        'I varchi devono essere un array'
      )
    );
  }

  // Verifica la validità di ciascun elemento in 'varchi' se fornito
  if (varchi) {
    for (const varco of varchi) {
      if (
        !['INGRESSO', 'USCITA'].includes(varco.tipo) ||
        typeof varco.bidirezionale !== 'boolean'
      ) {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.INVALID_INPUT,
            'Ogni varco deve avere un tipo valido ("INGRESSO" o "USCITA") e un valore bidirezionale booleano'
          )
        );
      }
    }
  }

  // Impedisce all'utente di impostare 'posti_disponibili' manualmente
  if (posti_disponibili !== undefined) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        'Non è permesso impostare manualmente "posti_disponibili"'
      )
    );
  }

  // Passa al middleware successivo se tutti i controlli sono superati
  next();
};

/**
 * Middleware di validazione per la creazione o l'aggiornamento di un varco.
 *
 * Verifica che i campi 'tipo', 'bidirezionale', e 'id_parcheggio' siano validi.
 *
 */
const validateVarco = (req: Request, res: Response, next: NextFunction) => {
  const { tipo, bidirezionale, id_parcheggio } = req.body;

  // Verifica che 'tipo' sia presente e sia 'INGRESSO' o 'USCITA'
  if (!tipo || !['INGRESSO', 'USCITA'].includes(tipo)) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        'Tipo è obbligatorio e deve essere "INGRESSO" o "USCITA"'
      )
    );
  }

  // Verifica che 'bidirezionale' sia un valore booleano
  if (typeof bidirezionale !== 'boolean') {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        'Bidirezionale è obbligatorio e deve essere un valore booleano (true o false)'
      )
    );
  }

  // Verifica che 'id_parcheggio' esista e sia un numero intero positivo
  if (
    !id_parcheggio ||
    typeof id_parcheggio !== 'number' ||
    !Number.isInteger(id_parcheggio) ||
    id_parcheggio <= 0
  ) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.MALFORMED_ID,
        'id_parcheggio è obbligatorio e deve essere un numero intero positivo'
      )
    );
  }

  // Passa al middleware successivo se tutti i controlli sono superati
  next();
};

/**
 * Middleware di validazione per la creazione o l'aggiornamento di una tariffa.
 *
 * Verifica che i campi 'id_tipo_veicolo', 'importo', 'fascia_oraria', 'id_parcheggio', e 'feriale_festivo' siano validi.
 */
const validateTariffa = (req: Request, res: Response, next: NextFunction) => {
  const {
    id_tipo_veicolo,
    importo,
    fascia_oraria,
    id_parcheggio,
    feriale_festivo,
  } = req.body;

  // Verifica che 'id_tipo_veicolo' sia un numero intero positivo
  if (
    !id_tipo_veicolo ||
    typeof id_tipo_veicolo !== 'number' ||
    !Number.isInteger(id_tipo_veicolo) ||
    id_tipo_veicolo <= 0
  ) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.MALFORMED_ID,
        "'id_tipo_veicolo' è obbligatorio e deve essere un numero intero positivo"
      )
    );
  }

  // Verifica che 'importo' sia un numero positivo
  if (typeof importo !== 'number' || importo <= 0) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'importo' è obbligatorio e deve essere un numero positivo"
      )
    );
  }

  // Verifica che 'fascia_oraria' sia valida ('DIURNA' o 'NOTTURNA')
  if (!['DIURNA', 'NOTTURNA'].includes(fascia_oraria)) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'fascia_oraria' deve essere 'DIURNA' o 'NOTTURNA'"
      )
    );
  }

  // Verifica che 'id_parcheggio' sia un numero intero positivo
  if (
    !id_parcheggio ||
    typeof id_parcheggio !== 'number' ||
    !Number.isInteger(id_parcheggio) ||
    id_parcheggio <= 0
  ) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.MALFORMED_ID,
        "'id_parcheggio' è obbligatorio e deve essere un numero intero positivo"
      )
    );
  }

  // Verifica che 'feriale_festivo' sia valido ('FERIALE' o 'FESTIVO')
  if (!['FERIALE', 'FESTIVO'].includes(feriale_festivo)) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'feriale_festivo' deve essere 'FERIALE' o 'FESTIVO'"
      )
    );
  }

  // Passa al middleware successivo se tutti i controlli sono superati
  next();
};

/**
 * Middleware di validazione per la creazione o l'aggiornamento di un transito.
 *
 * Verifica che i campi 'targa', 'id_tipo_veicolo' e 'id_varco_ingresso' siano validi.
 */
const validateTransito = (req: Request, res: Response, next: NextFunction) => {
  const { targa, id_tipo_veicolo, id_varco_ingresso } = req.body;

  // Verifica che 'targa' sia presente e sia una stringa non vuota
  if (!targa || typeof targa !== 'string' || targa.trim() === '') {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'targa' è obbligatorio e deve essere una stringa valida"
      )
    );
  }

  // Verifica che 'id_tipo_veicolo' sia un numero intero positivo
  if (
    !id_tipo_veicolo ||
    typeof id_tipo_veicolo !== 'number' ||
    !Number.isInteger(id_tipo_veicolo) ||
    id_tipo_veicolo <= 0
  ) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.MALFORMED_ID,
        "'id_tipo_veicolo' è obbligatorio e deve essere un numero intero positivo"
      )
    );
  }

  // Verifica che 'id_varco_ingresso' sia un numero intero positivo
  if (
    !id_varco_ingresso ||
    typeof id_varco_ingresso !== 'number' ||
    !Number.isInteger(id_varco_ingresso) ||
    id_varco_ingresso <= 0
  ) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.MALFORMED_ID,
        "'id_varco_ingresso' è obbligatorio e deve essere un numero intero positivo"
      )
    );
  }

  // Passa al middleware successivo se tutti i controlli sono superati
  next();
};

/**
 * Middleware di validazione per l'aggiornamento dell'uscita di un transito.
 *
 * Verifica che i campi 'id' nei parametri della richiesta e 'id_varco_uscita' nel corpo della richiesta siano validi.
 */
const validateUpdateUscita = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id_varco_uscita } = req.body;

  // Verifica che 'id' sia presente nei parametri e sia un numero intero positivo
  if (
    !id ||
    isNaN(Number(id)) ||
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0
  ) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.MALFORMED_ID,
        "L'ID del transito fornito non è valido. Deve essere un numero intero positivo."
      )
    );
  }

  // Verifica che 'id_varco_uscita' sia un numero intero positivo
  if (
    !id_varco_uscita ||
    typeof id_varco_uscita !== 'number' ||
    !Number.isInteger(id_varco_uscita) ||
    id_varco_uscita <= 0
  ) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.MALFORMED_ID,
        "'id_varco_uscita' è obbligatorio e deve essere un numero intero positivo"
      )
    );
  }

  // Passa al middleware successivo se tutti i controlli sono superati
  next();
};

/**
 * Middleware di validazione per l'esportazione dei transiti.
 *
 * Verifica che i campi 'targhe', 'from', 'to' e 'formato' siano validi.
 */
const validateExportTransiti = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { targhe, from, to, formato } = req.body;

  // Verifica che 'targhe' sia un array di stringhe non vuote
  if (
    !Array.isArray(targhe) ||
    targhe.length === 0 ||
    !targhe.every((targa) => typeof targa === 'string' && targa.trim() !== '')
  ) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'targhe' è obbligatorio e deve essere un array di stringhe non vuote"
      )
    );
  }

  // Verifica che 'from' sia una data ISO valida
  if (!from || !isValidISODate(from)) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'from' è obbligatorio e deve essere una data ISO valida"
      )
    );
  }

  // Verifica che 'to' sia una data ISO valida
  if (!to || !isValidISODate(to)) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'to' è obbligatorio e deve essere una data ISO valida"
      )
    );
  }

  // Verifica che 'formato' sia valido ('csv' o 'pdf')
  if (!['csv', 'pdf'].includes(formato)) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'formato' deve essere 'csv' o 'pdf'"
      )
    );
  }

  // Passa al middleware successivo se tutti i controlli sono superati
  next();
};

/**
 * Middleware di validazione per la richiesta delle statistiche.
 *
 * Verifica che i campi 'from' e 'to' siano stringhe rappresentanti date ISO valide.
 */
const validateStatistiche = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { from, to } = req.body;

  // Verifica che 'from' sia una stringa rappresentante una data ISO valida
  if (!from || typeof from !== 'string' || !isValidISODate(from)) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'from' è obbligatorio e deve essere una stringa rappresentante una data ISO valida"
      )
    );
  }

  // Verifica che 'to' sia una stringa rappresentante una data ISO valida
  if (!to || typeof to !== 'string' || !isValidISODate(to)) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'to' è obbligatorio e deve essere una stringa rappresentante una data ISO valida"
      )
    );
  }

  // Passa al middleware successivo se tutti i controlli sono superati
  next();
};

/**
 * Middleware di validazione per la richiesta delle statistiche del parcheggio.
 *
 * Verifica che i campi 'idParcheggio', 'from' e 'to' siano validi.
 * 'idParcheggio' deve essere un numero intero positivo.
 * 'from' e 'to' devono essere stringhe rappresentanti date ISO valide.
 */
const validateStatisticheParcheggio = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idParcheggio, from, to } = req.body;

  // Verifica che 'idParcheggio' sia un numero intero positivo
  if (
    !idParcheggio ||
    typeof idParcheggio !== 'number' ||
    !Number.isInteger(idParcheggio) ||
    idParcheggio <= 0
  ) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.MALFORMED_ID,
        "'idParcheggio' è obbligatorio e deve essere un numero intero positivo"
      )
    );
  }

  // Verifica che 'from' sia una stringa rappresentante una data ISO valida
  if (!from || typeof from !== 'string' || !isValidISODate(from)) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'from' è obbligatorio e deve essere una stringa rappresentante una data ISO valida"
      )
    );
  }

  // Verifica che 'to' sia una stringa rappresentante una data ISO valida
  if (!to || typeof to !== 'string' || !isValidISODate(to)) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        "'to' è obbligatorio e deve essere una stringa rappresentante una data ISO valida"
      )
    );
  }

  // Passa al middleware successivo se tutti i controlli sono superati
  next();
};

/**
 * Middleware per la validazione dell'ID nei parametri delle rotte.
 */
const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Verifica che l'ID sia presente e sia un numero intero positivo
  if (
    !id ||
    isNaN(Number(id)) ||
    !Number.isInteger(Number(id)) ||
    Number(id) <= 0
  ) {
    return next(
      ErrorGenerator.generateError(
        ApplicationErrorTypes.MALFORMED_ID,
        "L'ID fornito non è valido. Deve essere un numero intero positivo."
      )
    );
  }

  next();
};

export default {
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
