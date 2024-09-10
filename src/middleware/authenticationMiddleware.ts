import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../ext/jwt';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';

/**
 * Middleware per l'autenticazione degli utenti tramite token JWT.
 * Controlla la presenza di un token di autenticazione e lo verifica.
 * Se il token è valido, aggiunge i dati dell'utente alla richiesta.
 */
export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      // Nessun token fornito
      return next(ErrorGenerator.generateError(
        ApplicationErrorTypes.AUTH_FAILED,
        'Accesso negato: nessun token fornito.'
      ));
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedPayload = verifyToken(token);

    if (!decodedPayload) {
      // Token non valido o errore nella verifica
      return next(ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_AUTH_TOKEN,
        'Token di autenticazione non valido.'
      ));
    }

    // Attacca le informazioni dell'utente decodificate alla richiesta
    (req as any).user = decodedPayload;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware per autorizzare gli utenti in base ai loro ruoli.
 * Controlla se l'utente autenticato ha uno dei ruoli specificati.
 * 
 * @param roles - Lista di ruoli che hanno accesso alla risorsa.
 */
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      if (!user) {
        // Utente non autenticato
        return next(ErrorGenerator.generateError(
          ApplicationErrorTypes.ACCESS_DENIED,
          'Accesso negato: utente non autenticato.'
        ));
      }

      if (!roles.includes(user.ruolo)) {
        // Utente non autorizzato per il ruolo richiesto
        return next(ErrorGenerator.generateError(
          ApplicationErrorTypes.AUTH_FAILED,
          'Accesso negato: ruolo utente non autorizzato.'
        ));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default { authenticationMiddleware, authorizeRoles };

