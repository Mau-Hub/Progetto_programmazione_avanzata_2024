import { Request, Response, NextFunction } from 'express';
import TransitoRepository from '../repositories/transitoRepository'; 
import { ApplicationErrorTypes, ErrorGenerator } from '../ext/errorFactory';

class TransitoController {
  // Creazione di un transito
  async createTransito(req: Request, res: Response, next: NextFunction) {
    try {
      const nuovoTransito = await TransitoRepository.create(req.body);
      res.status(201).json(nuovoTransito);
    } catch (error) {
      next(error);
    }
  }

  // Ottenere tutti i transiti
  async getAllTransiti(req: Request, res: Response, next: NextFunction) {
    try {
      const transiti = await TransitoRepository.findAll();
      res.status(200).json(transiti);
    } catch (error) {
      next(error);
    }
  }

  // Ottenere un transito specifico per ID
  async getTransitoById(req: Request, res: Response, next: NextFunction) {
    try {
      const transito = await TransitoRepository.findById(Number(req.params.id));
      if (!transito) {
        return next(
          ErrorGenerator.generateError(ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato')
        );
      }
      res.status(200).json(transito);
    } catch (error) {
      next(error);
    }
  }

  // Aggiornamento di un transito
  async updateTransito(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await TransitoRepository.update(Number(req.params.id), req.body);
      if (success) {
        const transitoAggiornato = await TransitoRepository.findById(Number(req.params.id));
        return res.status(200).json(transitoAggiornato);
      } else {
        return next(
          ErrorGenerator.generateError(ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato')
        );
      }
    } catch (error) {
      next(error);
    }
  }

  // Eliminazione di un transito
  async deleteTransito(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await TransitoRepository.delete(Number(req.params.id));
      if (success) {
        return res.status(204).send();
      } else {
        return next(
          ErrorGenerator.generateError(ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato')
        );
      }
    } catch (error) {
      next(error);
    }
  }

  // Gestione dell'uscita del veicolo
  async exitTransito(req: Request, res: Response, next: NextFunction) {
    try {
      const transitoId = Number(req.params.id);
      const dataOraUscita = new Date(); // Usa l'ora corrente come ora di uscita

      const transitoAggiornato = await TransitoRepository.aggiornaTransitoConImporto(transitoId, dataOraUscita);

      if (!transitoAggiornato) {
        return res.status(404).json({ message: 'Transito non trovato' });
      }

      res.status(200).json(transitoAggiornato);
    } catch (error) {
      next(error);
    }
  }
}

export default new TransitoController();
