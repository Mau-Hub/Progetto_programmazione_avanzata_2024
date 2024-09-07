import { Request, Response, NextFunction } from 'express';
import VarcoRepository from '../repositories/varcoRepository'; 
import { ApplicationErrorTypes, ErrorGenerator } from '../ext/errorFactory';

class VarcoController {
  // Creazione di un varco
  async createVarco(req: Request, res: Response, next: NextFunction) {
    try {
      const nuovoVarco = await VarcoRepository.create(req.body);
      res.status(201).json(nuovoVarco);
    } catch (error) {
      next(error);
    }
  }

  // Ottenere tutti i varchi
  async getAllVarchi(req: Request, res: Response, next: NextFunction) {
    try {
      const varchi = await VarcoRepository.findAll();
      res.status(200).json(varchi);
    } catch (error) {
      next(error);
    }
  }

  // Ottenere un varco specifico per ID
  async getVarcoById(req: Request, res: Response, next: NextFunction) {
    try {
      const varco = await VarcoRepository.findById(Number(req.params.id));
      if (!varco) {
        return next(
          ErrorGenerator.generateError(ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Varco non trovato')
        );
      }
      res.status(200).json(varco);
    } catch (error) {
      next(error);
    }
  }

  // Aggiornamento di un varco
  async updateVarco(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await VarcoRepository.update(Number(req.params.id), req.body);
      if (success) {
        const varcoAggiornato = await VarcoRepository.findById(Number(req.params.id));
        return res.status(200).json(varcoAggiornato);
      } else {
        return next(
          ErrorGenerator.generateError(ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Varco non trovato')
        );
      }
    } catch (error) {
      next(error);
    }
  }

  // Eliminazione di un varco
  async deleteVarco(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await VarcoRepository.delete(Number(req.params.id));
      if (success) {
        return res.status(204).send();
      } else {
        return next(
          ErrorGenerator.generateError(ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Varco non trovato')
        );
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new VarcoController();
