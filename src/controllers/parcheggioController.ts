/* eslint-disable class-methods-use-this */
import { Request, Response, NextFunction } from 'express';
import ParcheggioRepository from '../repositories/parcheggioRepository';
import { AppError, errorFactory } from '../ext/errorFactory';

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

  // Lettura di tutti i parcheggi con varchi associati
  async getAllParcheggi(req: Request, res: Response, next: NextFunction) {
    try {
      const parcheggi = await ParcheggioRepository.findAll();
      res.status(200).json(parcheggi);
    } catch (error) {
      next(error);
    }
  }

  // Lettura di un singolo parcheggio con varchi associati
  async getParcheggioById(req: Request, res: Response, next: NextFunction) {
    try {
      const parcheggio = await ParcheggioRepository.findById(
        Number(req.params.id)
      );
      if (!parcheggio) {
        return next(errorFactory.notFound('Parcheggio non trovato'));
      }
      return res.status(200).json(parcheggio);
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
        res.status(200).json(parcheggioAggiornato);
      }
    } catch (error) {
      if (error.message === 'Parcheggio non trovato') {
        return next(errorFactory.notFound(error.message));
      }
      next(error);
    }
  }

  // Eliminazione di un parcheggio e dei suoi varchi
  async deleteParcheggio(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await ParcheggioRepository.delete(Number(req.params.id));
      if (success) {
        res.status(204).send();
      }
    } catch (error) {
      if (error.message === 'Parcheggio non trovato') {
        return next(errorFactory.notFound(error.message));
      }
      next(error);
    }
  }
}

export default new ParcheggioController();
