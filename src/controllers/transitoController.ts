import { Request, Response, NextFunction } from 'express';
import TransitoRepository from '../repositories/transitoRepository';
import {
  ApplicationErrorTypes,
  ErrorGenerator,
  CustomHttpError,
} from '../ext/errorFactory';

class TransitoController {
  // Creazione di un transito
  async createTransito(req: Request, res: Response, next: NextFunction) {
    try {
      const { targa, id_tipo_veicolo, id_utente, id_varco_ingresso } = req.body;

      console.log('Dati in ingresso:', {
        targa,
        id_tipo_veicolo,
        id_utente,
        id_varco_ingresso,
      });

      // Creazione del transito passando i dati necessari
      const nuovoTransito = await TransitoRepository.create(
        {
          id_varco_ingresso: id_varco_ingresso,
        },
        targa,
        id_tipo_veicolo
      );

      console.log('Nuovo transito creato:', nuovoTransito);
      res.status(201).json(nuovoTransito);
    } catch (error) {
      console.error('Errore nel controller createTransito:', error); // Log dell'errore dettagliato
      if (error instanceof CustomHttpError) {
        // Passa l'errore personalizzato direttamente al middleware di gestione degli errori
        next(error);
      } else {
        next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.SERVER_ERROR,
            'Errore sconosciuto durante la creazione del transito'
          )
        );
      }
    }
  }

  // Ottenere un transito specifico per ID
  async getTransitoById(req: Request, res: Response, next: NextFunction) {
    try {
      const transito = await TransitoRepository.findById(Number(req.params.id));
      if (!transito) {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Transito non trovato'
          )
        );
      }
      res.status(200).json(transito);
    } catch (error) {
      if (error instanceof Error) {
        next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.SERVER_ERROR,
            `Errore nel recupero del transito: ${error.message}`
          )
        );
      } else {
        next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.SERVER_ERROR,
            'Errore sconosciuto nel recupero del transito'
          )
        );
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
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Transito non trovato'
          )
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.SERVER_ERROR,
            `Errore durante l'eliminazione del transito: ${error.message}`
          )
        );
      } else {
        next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.SERVER_ERROR,
            "Errore sconosciuto durante l'eliminazione del transito"
          )
        );
      }
    }
  }

  // Gestione dell'uscita del veicolo
  async exitTransito(req: Request, res: Response, next: NextFunction) {
    try {
      const transitoId = Number(req.params.id);
      const { id_varco_uscita } = req.body; // Prendi il varco di uscita dal body

      const dataOraUscita = new Date(); // Ora corrente per l'uscita

      const transitoAggiornato = await TransitoRepository.updateUscita(
        transitoId,
        id_varco_uscita,
        dataOraUscita
      );

      if (!transitoAggiornato) {
        return next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Transito non trovato'
          )
        );
      }

      res.status(200).json(transitoAggiornato);
    } catch (error) {
      if (error instanceof Error) {
        next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.SERVER_ERROR,
            `Errore durante l'uscita del veicolo: ${error.message}`
          )
        );
      } else {
        next(
          ErrorGenerator.generateError(
            ApplicationErrorTypes.SERVER_ERROR,
            "Errore sconosciuto durante l'uscita del veicolo"
          )
        );
      }
    }
  }
}

export default new TransitoController();
