import { Request, Response, NextFunction } from 'express';
import TariffaRepository from '../repositories/tariffaRepository';
import { ApplicationErrorTypes, ErrorGenerator } from '../ext/errorFactory';

class TariffaController {
  // Creazione di una nuova tariffa per parcheggio
  async createTariffa(req: Request, res: Response, next: NextFunction) {
    try {
      const nuovaTariffa = await TariffaRepository.create(req.body);
      res.status(201).json(nuovaTariffa);
    } catch (error) {
      next(error);
    }
  }

  // Lettura di tutte le tariffe disponibili
  async getAllTariffe(req: Request, res: Response, next: NextFunction) {
    try {
      const tariffe = await TariffaRepository.findAll();
      res.status(200).json(tariffe);
    } catch (error) {
      next(error);
    }
  }

  // Lettura di una tariffa specifica per ID
  async getTariffaById(req: Request, res: Response, next: NextFunction) {
    try {
      const tariffa = await TariffaRepository.findById(Number(req.params.id));
      if (!tariffa) {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Tariffa non trovata'
          )
        );
      }
      res.status(200).json(tariffa);
    } catch (error) {
      next(error);
    }
  }

  // Aggiornamento di una tariffa per parcheggio
  async updateTariffa(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await TariffaRepository.update(
        Number(req.params.id),
        req.body
      );
      if (success) {
        const tariffaAggiornata = await TariffaRepository.findById(
          Number(req.params.id)
        );
        return res.status(200).json(tariffaAggiornata);
      } else {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Tariffa non trovata'
          )
        );
      }
    } catch (error) {
      if ((error as Error).message === 'Tariffa non trovata') {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Tariffa non trovata'
          )
        );
      }
      next(error);
    }
  }

  // Eliminazione di una tariffa per ID
  async deleteTariffa(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await TariffaRepository.delete(Number(req.params.id));
      if (success) {
        return res.status(204).send();
      } else {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Tariffa non trovata'
          )
        );
      }
    } catch (error) {
      if ((error as Error).message === 'Tariffa non trovata') {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Tariffa non trovata'
          )
        );
      }
      next(error);
    }
  }
}

export default new TariffaController();
