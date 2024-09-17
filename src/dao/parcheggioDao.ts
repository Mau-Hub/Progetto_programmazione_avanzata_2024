import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import {
  ParcheggioAttributes,
  ParcheggioCreationAttributes,
} from '../models/parcheggio';
import { Parcheggio } from '../models/parcheggio';
import { DaoI } from './DaoI';

/**
 * Classe ParcheggioDao che implementa l'interfaccia DaoI per Parcheggio.
 *
 * Questa classe fornisce metodi per interagire con il modello Parcheggio nel database.
 */
class ParcheggioDao implements DaoI<ParcheggioAttributes, number> {
  /**
   * Recupera tutti i parcheggi.
   *
   * @returns {Promise<Parcheggio[]>} Promise che restituisce un array di parcheggi.
   */
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

  /**
   * Recupera un parcheggio per ID.
   *
   * @param {number} id ID del parcheggio.
   * @returns {Promise<Parcheggio | null>} Promise che restituisce un parcheggio o null se non esiste.
   */
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

  /**
   * Crea un nuovo parcheggio.
   *
   * @param {ParcheggioCreationAttributes} item Dati per creare il nuovo parcheggio.
   * @returns {Promise<Parcheggio>} Promise che restituisce il parcheggio appena creato.
   */
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

  /**
   * Aggiorna un parcheggio esistente.
   *
   * @param {number} id ID del parcheggio da aggiornare.
   * @param {ParcheggioCreationAttributes} item Dati aggiornati del parcheggio.
   * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto con successo, false in caso contrario.
   */
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

  /**
   * Elimina un parcheggio per ID.
   *
   * @param {number} id ID del parcheggio da eliminare.
   * @returns {Promise<boolean>} Promise che restituisce true se l'eliminazione è avvenuta, false in caso contrario.
   */
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
