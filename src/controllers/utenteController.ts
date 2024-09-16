import { Request, Response, NextFunction } from 'express';
import UtenteDao from '../dao/utenteDao';
import { ApplicationErrorTypes, ErrorGenerator } from '../ext/errorFactory';

class UtenteController {
  // Metodo per ottenere tutti gli utenti
  async getAllUtenti(req: Request, res: Response, next: NextFunction) {
    try {
      const utenti = await UtenteDao.findAll();
      res.status(200).json(utenti);
    } catch (error) {
      next(
        ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore nel recupero degli utenti.'
        )
      );
    }
  }
}

export default new UtenteController();
