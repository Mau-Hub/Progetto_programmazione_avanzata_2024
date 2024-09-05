import { Request, Response, NextFunction } from 'express';
import Utente from '../models/utente'; 
import { generateToken } from '../ext/jwt';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { StatusCodes } from 'http-status-codes';

/**
 * Gestisce le richieste di login degli utenti, verificando l'username e generando un token JWT se l'utente esiste.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Recupera l'username dal corpo della richiesta
    const { username } = req.body;

    if (!username) {
      // Se l'username non viene fornito, ritorna un errore di richiesta errata
      return next(ErrorGenerator.generateError(
        ApplicationErrorTypes.INVALID_INPUT,
        'Nome utente non fornito'
      ));
    }

    // Cerca un utente nel database utilizzando il username fornito
    const utente = await Utente.findOne({ where: { username } });

    if (!utente) {
      // Se l'utente non viene trovato, genera un errore di autorizzazione
      return next(ErrorGenerator.generateError(
        ApplicationErrorTypes.AUTH_FAILED,
        `Nessun utente trovato con il nome utente ${username}`
      ));
    }

    // Se l'utente esiste, genera un token JWT utilizzando l'id utente, il nome e il ruolo
    const token = generateToken({ id: utente.id, nome: utente.nome, ruolo: utente.ruolo });

    // Restituisce il token generato con uno stato di successo
    res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    // Gestisce eventuali altri errori durante il processo di login
    next(error);
  }
};
