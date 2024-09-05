import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ErrorGenerator, ApplicationErrorTypes } from './errorFactory';

dotenv.config();

const secretKey = process.env.JWT_SECRET as string; // Recupera la chiave segreta JWT dalla variabile d'ambiente

/**
 * Genera un token JWT con un payload specificato e una durata di 1 ora.
 * @param payload Oggetto contenente le informazioni da includere nel token.
 * @returns Una stringa rappresentante il token JWT generato.
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
 * @param token Il token JWT da verificare.
 * @returns Il payload decodificato del token se valido, altrimenti null.
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
