import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import {
  ParcheggioAttributes,
  ParcheggioCreationAttributes,
} from '../models/parcheggio';
import { Parcheggio } from '../models/parcheggio';
import { DaoI } from './DaoI';

class ParcheggioDao implements DaoI<ParcheggioAttributes, number> {
  // Metodo per ottenere tutti i parcheggi
  public async findAll(): Promise<Parcheggio[]> {
    try {
      return await Parcheggio.findAll();
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore durante il recupero di tutti i parcheggi'
      );
    }
  }

  // Metodo per trovare un parcheggio per ID
  public async findById(id: number): Promise<Parcheggio | null> {
    try {
      const parcheggio = await Parcheggio.findByPk(id);

      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il parcheggio con ID ${id} non esiste`
        );
      }

      return parcheggio;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante il recupero del parcheggio con ID ${id}`
      );
    }
  }

  // Metodo per creare un nuovo parcheggio
  public async create(item: ParcheggioCreationAttributes): Promise<Parcheggio> {
    try {
      return await Parcheggio.create(item);
    } catch (error) {
      console.error(
        'Errore durante la creazione del parcheggio nel DAO:',
        error
      ); // Log dettagliato
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore durante la creazione del parcheggio'
      );
    }
  }

  // Metodo per aggiornare un parcheggio
  public async update(
    id: number,
    item: ParcheggioCreationAttributes
  ): Promise<boolean> {
    try {
      const [affectedCount] = await Parcheggio.update(item, {
        where: { id },
        returning: true,
      });

      if (affectedCount === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il parcheggio con ID ${id} non esiste`
        );
      }

      return affectedCount > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante l'aggiornamento del parcheggio con ID ${id}`
      );
    }
  }

  // Metodo per eliminare un parcheggio
  public async delete(id: number): Promise<boolean> {
    try {
      const result = await Parcheggio.destroy({ where: { id } });

      if (result === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il parcheggio con ID ${id} non è stato trovato`
        );
      }

      return result > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante l'eliminazione del parcheggio con ID ${id}`
      );
    }
  }
}

export default new ParcheggioDao();
