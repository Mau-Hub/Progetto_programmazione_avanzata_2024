import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ErrorGenerator, ApplicationErrorTypes } from './errorFactory';

dotenv.config();

const secretKey = process.env.JWT_SECRET as string; // Recupera la chiave segreta JWT dalla variabile d'ambiente

/**
 * Genera un token JWT con un payload specificato e una durata di 1 ora.
 *
 * @param {object} payload - Oggetto contenente le informazioni da includere nel token.
 * @returns {string} - Una stringa rappresentante il token JWT generato.
 * @throws {Error} - Se si verifica un errore durante la generazione del token.
 */
export const generateToken = (payload: object): string => {
  try {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
  } catch (error) {
    throw ErrorGenerator.generateError(
      ApplicationErrorTypes.SERVER_ERROR,
      'Errore durante la generazione del token'
    );
  }
};

/**
 * Verifica e decodifica un token JWT.
 *
 * @param {string} token - Il token JWT da verificare.
 * @returns {JwtPayload | null} - Il payload decodificato del token se valido, altrimenti null.
 * @throws {Error} - Se si verifica un errore durante la verifica del token.
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, secretKey);
    if (typeof decoded === 'string') {
      return null; // Se il token decodificato è una stringa, restituisce null
    }
    return decoded as JwtPayload; // Ritorna il payload decodificato se il token è valido
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.EXPIRED_TOKEN,
        'Il token è scaduto'
      );
    } else if (error instanceof jwt.JsonWebTokenError) {
      // Qui cattura il caso di un token completamente non valido, come "pippo"
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_AUTH_TOKEN,
        'Token JWT non valido'
      );
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.JWT_ERROR,
        'Token JWT non valido'
      );
    } else {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore durante la verifica del token'
      );
    }
  }
};
