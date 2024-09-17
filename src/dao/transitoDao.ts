import Transito from '../models/transito';
import Veicolo from '../models/veicolo';
import Varco from '../models/varco';
import Tariffa from '../models/tariffa';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { DaoI } from './DaoI';
import {
  TransitoAttributes,
  TransitoCreationAttributes,
} from '../models/transito';
import { Transaction, IncludeOptions } from 'sequelize';

/**
 * Classe TransitoDao che implementa l'interfaccia DaoI per Transito.
 *
 * Questa classe fornisce metodi per interagire con il modello Transito nel database.
 */
class TransitoDao implements DaoI<Transito, number> {
  /**
   * Recupera tutti i transiti.
   *
   * @param {any} [options] Opzioni aggiuntive per personalizzare la query.
   * @returns {Promise<Transito[]>} Promise che restituisce un array di transiti.
   */
  public async findAll(options?: any): Promise<Transito[]> {
    try {
      return await Transito.findAll({
        ...options,
        include: [
          { model: Veicolo, as: 'veicolo' },
          { model: Varco, as: 'varcoIngresso' },
          { model: Varco, as: 'varcoUscita' },
          { model: Tariffa, as: 'tariffa' },
        ],
      });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei transiti'
      );
    }
  }

  /**
   * Recupera un transito per ID.
   *
   * @param {number} id ID del transito da recuperare.
   * @param {object} [options] Opzioni aggiuntive come le associazioni da includere.
   * @returns {Promise<Transito | null>} Promise che restituisce il transito trovato o null se non esiste.
   */
  public async findById(
    id: number,
    options?: { include?: IncludeOptions[] }
  ): Promise<Transito | null> {
    try {
      const transito = await Transito.findByPk(id, {
        ...options,
        include: [
          { model: Veicolo, as: 'veicolo' },
          { model: Varco, as: 'varcoIngresso' },
          { model: Varco, as: 'varcoUscita' },
          { model: Tariffa, as: 'tariffa' },
        ],
      });
      if (!transito) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il transito con id ${id} è inesistente`
        );
      }
      return transito;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore nel recupero del transito con id ${id}`
      );
    }
  }

  /**
   * Crea un nuovo transito.
   *
   * @param {TransitoCreationAttributes} item Dati per creare il nuovo transito.
   * @param {Transaction} [transaction] Transazione Sequelize opzionale per garantire l'atomicità.
   * @returns {Promise<Transito>} Promise che restituisce il transito appena creato.
   */
  public async create(
    item: TransitoCreationAttributes,
    transaction?: Transaction
  ): Promise<Transito> {
    try {
      return await Transito.create(item, { transaction });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nella creazione del transito'
      );
    }
  }

  /**
   * Aggiorna un transito esistente.
   *
   * @param {number} id ID del transito da aggiornare.
   * @param {Partial<TransitoAttributes>} item Dati aggiornati del transito.
   * @param {Transaction} [transaction] Transazione Sequelize opzionale per garantire l'atomicità.
   * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto con successo, false in caso contrario.
   */
  public async update(
    id: number,
    item: Partial<TransitoAttributes>,
    transaction?: Transaction
  ): Promise<boolean> {
    try {
      const [affectedCount] = await Transito.update(item, {
        where: { id },
        returning: true,
        transaction,
      });

      if (affectedCount === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il transito con id ${id} non è stato trovato`
        );
      }

      return affectedCount > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore nell'aggiornamento del transito con id ${id}`
      );
    }
  }

  /**
   * Elimina un transito per ID.
   *
   * @param {number} id ID del transito da eliminare.
   * @returns {Promise<boolean>} Promise che restituisce true se l'eliminazione è avvenuta, false in caso contrario.
   */
  public async delete(id: number): Promise<boolean> {
    try {
      const result = await Transito.destroy({ where: { id } });

      if (result === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il transito con id ${id} non è stato trovato`
        );
      }

      return result > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore nella cancellazione del transito con id ${id}`
      );
    }
  }

  /**
   * Trova un transito con criteri personalizzati.
   *
   * @param {object} [options] Opzioni di ricerca per personalizzare i criteri di ricerca.
   * @returns {Promise<Transito | null>} Promise che restituisce il transito trovato o null se non esiste.
   */
  public async findOne(options?: {
    where?: any;
    include?: IncludeOptions[];
  }): Promise<Transito | null> {
    try {
      const transito = await Transito.findOne({
        ...options,
        include: [
          { model: Veicolo, as: 'veicolo' },
          { model: Varco, as: 'varcoIngresso' },
          { model: Varco, as: 'varcoUscita' },
          { model: Tariffa, as: 'tariffa' },
        ],
      });

      if (!transito) {
        return null; // Nessun errore se non trovato, ritorna semplicemente null
      }

      return transito;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore durante la ricerca del transito'
      );
    }
  }
}

export default new TransitoDao();
