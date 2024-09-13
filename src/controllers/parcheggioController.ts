import { Request, Response, NextFunction } from 'express';
import ParcheggioRepository from '../repositories/parcheggioRepository';
import { ApplicationErrorTypes, ErrorGenerator } from '../ext/errorFactory';

class ParcheggioController {
  // Creazione di un parcheggio con varchi
  async createParcheggio(req: Request, res: Response, next: NextFunction) {
    try {
      const nuovoParcheggio = await ParcheggioRepository.create(req.body);
      res.status(201).json(nuovoParcheggio);
    } catch (error) {
      next(error);
    }
  }

  // Lettura di tutti i parcheggi
  async getAllParcheggi(req: Request, res: Response, next: NextFunction) {
    try {
      const parcheggi = await ParcheggioRepository.findAll();
      res.status(200).json(parcheggi);
    } catch (error) {
      next(error);
    }
  }

  // Lettura di un singolo parcheggio
  async getParcheggioById(req: Request, res: Response, next: NextFunction) {
    try {
      const parcheggio = await ParcheggioRepository.findById(
        Number(req.params.id)
      );
      if (!parcheggio) {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Parcheggio non trovato'
          )
        );
      }
      res.status(200).json(parcheggio);
    } catch (error) {
      next(error);
    }
  }

  // Aggiornamento di un parcheggio e dei suoi varchi
  async updateParcheggio(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await ParcheggioRepository.update(
        Number(req.params.id),
        req.body
      );
      if (success) {
        const parcheggioAggiornato = await ParcheggioRepository.findById(
          Number(req.params.id)
        );
        return res.status(200).json(parcheggioAggiornato);
      } else {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Parcheggio non trovato'
          )
        );
      }
    } catch (error) {
      if ((error as Error).message === 'Parcheggio non trovato') {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Parcheggio non trovato'
          )
        );
      }
      next(error);
    }
  }

  // Eliminazione di un parcheggio e dei suoi varchi
  async deleteParcheggio(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await ParcheggioRepository.delete(Number(req.params.id));
      if (success) {
        return res.status(204).send();
      } else {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Parcheggio non trovato'
          )
        );
      }
    } catch (error) {
      if ((error as Error).message === 'Parcheggio non trovato') {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Parcheggio non trovato'
          )
        );
      }
      next(error);
    }
  }

  // Nuovo metodo: Controllo dei posti disponibili
  async getPostiDisponibili(req: Request, res: Response, next: NextFunction) {
    try {
      const parcheggioId = Number(req.params.id);
      const parcheggio = await ParcheggioRepository.findById(parcheggioId);
      if (!parcheggio) {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Parcheggio non trovato'
          )
        );
      }
      res.status(200).json({ posti_disponibili: parcheggio.posti_disponibili });
    } catch (error) {
      next(error);
    }
  }
}

export default new ParcheggioController();
