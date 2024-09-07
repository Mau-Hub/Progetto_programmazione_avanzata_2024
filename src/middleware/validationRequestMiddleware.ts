import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';

/**
 * Middleware per la validazione delle richieste HTTP in ingresso.
 * Verifica se ci sono errori nei dati forniti nelle richieste e li gestisce adeguatamente.
 *
 * @param req - L'oggetto della richiesta HTTP.
 * @param res - L'oggetto della risposta HTTP.
 * @param next - Funzione per passare al middleware successivo.
 */
const validationRequest = (req: Request, res: Response, next: NextFunction) => {
  // Estrae eventuali errori di validazione dalla richiesta
  const validationErrors = validationResult(req);



  // Se sono presenti errori di validazione, li raccoglie e genera un errore personalizzato
  if (!validationErrors.isEmpty()) {
    const errorMessages = validationErrors.array().map((error: ValidationError) => error.msg).join(', ');
    const validationError = ErrorGenerator.generateError(
      ApplicationErrorTypes.INVALID_INPUT,
      `Errore di validazione: ${errorMessages}`
    );

    // Passa l'errore generato al middleware di gestione degli errori
    return next(validationError);
  }

  // Se non ci sono errori, passa al middleware successivo
  next();
};

export default validationRequest;


