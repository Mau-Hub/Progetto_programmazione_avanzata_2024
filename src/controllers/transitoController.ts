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
      if (error instanceof Error) {
        next(ErrorGenerator.generateError(ApplicationErrorTypes.INVALID_INPUT, error.message));
      } else {
        next(ErrorGenerator.generateError(ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto durante la creazione del transito'));
      }
    }
  }

  // Ottenere tutti i transiti
  async getAllTransiti(req: Request, res: Response, next: NextFunction) {
    try {
      const transiti = await TransitoRepository.findAll();
      res.status(200).json(transiti);
    } catch (error) {
      next(ErrorGenerator.generateError(ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero dei transiti'));
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
      next(ErrorGenerator.generateError(ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero del transito'));
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
      if (error instanceof Error) {
        next(ErrorGenerator.generateError(ApplicationErrorTypes.SERVER_ERROR, `Errore nell'aggiornamento del transito: ${error.message}`));
      } else {
        next(ErrorGenerator.generateError(ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto durante l\'aggiornamento del transito'));
      }
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
      next(ErrorGenerator.generateError(ApplicationErrorTypes.SERVER_ERROR, 'Errore durante l\'eliminazione del transito'));
    }
  }

  // Gestione dell'uscita del veicolo
  async exitTransito(req: Request, res: Response, next: NextFunction) {
    try {
      const transitoId = Number(req.params.id);
      const dataOraUscita = new Date();

      const transitoAggiornato = await TransitoRepository.aggiornaTransitoConImporto(transitoId, dataOraUscita);

      if (!transitoAggiornato) {
        return next(ErrorGenerator.generateError(ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato'));
      }

      res.status(200).json(transitoAggiornato);
    } catch (error) {
      if (error instanceof Error) {
        next(ErrorGenerator.generateError(ApplicationErrorTypes.SERVER_ERROR, `Errore durante l'uscita del veicolo: ${error.message}`));
      } else {
        next(ErrorGenerator.generateError(ApplicationErrorTypes.SERVER_ERROR, 'Errore sconosciuto durante l\'uscita del veicolo'));
      }
    }
  }
}

export default new TransitoController();