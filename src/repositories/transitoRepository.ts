import TransitoDao from '../dao/transitoDao'; // Assicurati che il percorso sia corretto
import Parcheggio from '../models/parcheggio';
import TransitoService from '../ext/transitoService';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import {
  TransitoAttributes,
  TransitoCreationAttributes,
} from '../models/transito';

class TransitoRepository {
  private transitoDao = TransitoDao;

  // Creazione di un nuovo transito con controllo sulla capacità del parcheggio
  async create(
    transitoData: TransitoCreationAttributes
  ): Promise<TransitoAttributes> {
    try {
      const parcheggio = await Parcheggio.findByPk(transitoData.id_posto);

      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Parcheggio non trovato'
        );
      }

      // Controllo sulla capacità del parcheggio
      const postiOccupati = await this.transitoDao.findAll({
        where: { id_posto: parcheggio.id, uscita: null },
      });

      if (postiOccupati.length >= parcheggio.capacita) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.INVALID_INPUT,
          'Parcheggio pieno'
        );
      }

      return await this.transitoDao.create(
        transitoData as TransitoCreationAttributes
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nella creazione del transito: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore sconosciuto nella creazione del transito'
        );
      }
    }
  }

  // Ottenere tutti i transiti
  async findAll(): Promise<TransitoAttributes[]> {
    try {
      return await this.transitoDao.findAll();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nel recupero dei transiti: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore sconosciuto nel recupero dei transiti'
        );
      }
    }
  }

  // Ottenere un transito specifico per ID
  async findById(id: number): Promise<TransitoAttributes | null> {
    try {
      return await this.transitoDao.findById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nel recupero del transito: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore sconosciuto nel recupero del transito'
        );
      }
    }
  }

  // Aggiornare un transito
  async update(
    id: number,
    transitoData: Partial<TransitoAttributes>
  ): Promise<boolean> {
    try {
      return await this.transitoDao.update(id, transitoData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nell'aggiornamento del transito: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          "Errore sconosciuto nell'aggiornamento del transito"
        );
      }
    }
  }

  // Eliminare un transito
  async delete(id: number): Promise<boolean> {
    try {
      return await this.transitoDao.delete(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nell'eliminazione del transito: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          "Errore sconosciuto nell'eliminazione del transito"
        );
      }
    }
  }

  // Calcolo dell'importo basato su durata e fascia oraria e giorni feriali/festivi
  async calcolaImporto(
    transitoId: number,
    dataOraUscita: Date
  ): Promise<number> {
    try {
      return await TransitoService.calcolaImporto(transitoId, dataOraUscita);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nel calcolo dell'importo: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          "Errore sconosciuto nel calcolo dell'importo"
        );
      }
    }
  }

  // Aggiorna il transito con l'uscita e l'importo calcolato
  async aggiornaTransitoConImporto(
    transitoId: number,
    dataOraUscita: Date
  ): Promise<TransitoAttributes | null> {
    try {
      const importo = await this.calcolaImporto(transitoId, dataOraUscita);

      const updated = await this.transitoDao.update(transitoId, {
        uscita: dataOraUscita,
        importo,
      } as Partial<TransitoAttributes>);

      if (!updated) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          "Transito non trovato per l'aggiornamento"
        );
      }

      return await this.findById(transitoId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nell'aggiornamento del transito con importo: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          "Errore sconosciuto nell'aggiornamento del transito con importo"
        );
      }
    }
  }
}

export default new TransitoRepository();
