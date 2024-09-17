import Veicolo from '../models/veicolo';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { DaoI } from './DaoI';
import {
  VeicoloAttributes,
  VeicoloCreationAttributes,
} from '../models/veicolo';
import TipoVeicolo from '../models/tipoVeicolo';
import { Op, Transaction } from 'sequelize';

/**
 * Classe VeicoloDao che implementa l'interfaccia DaoI per Veicolo.
 *
 * Fornisce metodi per gestire le operazioni CRUD relative ai veicoli nel database.
 */
class VeicoloDao implements DaoI<VeicoloAttributes, number> {
  /**
   * Recupera tutti i veicoli.
   *
   * @param {any} [options] Opzioni aggiuntive per personalizzare la query.
   * @returns {Promise<Veicolo[]>} Promise che restituisce un array di veicoli.
   */
  public async findAll(options?: any): Promise<Veicolo[]> {
    try {
      return await Veicolo.findAll(options);
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Si è verificato un problema nel recupero dei veicoli'
      );
    }
  }

  /**
   * Recupera un veicolo per ID.
   *
   * @param {number} id ID del veicolo.
   * @returns {Promise<Veicolo | null>} Promise che restituisce un veicolo o null se non esistente.
   */
  public async findById(id: number): Promise<Veicolo | null> {
    try {
      const veicolo = await Veicolo.findByPk(id);
      if (!veicolo) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il veicolo con id ${id} è inesistente`
        );
      }
      return veicolo;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nel recupero del veicolo con id ${id}`
      );
    }
  }

  /**
   * Crea un nuovo veicolo.
   *
   * @param {VeicoloCreationAttributes} item Dati per creare il nuovo veicolo.
   * @param {Transaction} [transaction] Transazione Sequelize opzionale per garantire l'atomicità.
   * @returns {Promise<Veicolo>} Promise che restituisce il veicolo appena creato.
   */
  public async create(
    item: VeicoloCreationAttributes,
    transaction?: Transaction
  ): Promise<Veicolo> {
    try {
      return await Veicolo.create(item, { transaction });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Si è verificato un errore nella creazione del veicolo'
      );
    }
  }

  /**
   * Aggiorna un veicolo esistente.
   *
   * @param {number} id ID del veicolo da aggiornare.
   * @param {VeicoloCreationAttributes} item Dati aggiornati del veicolo.
   * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto con successo, false in caso contrario.
   */
  public async update(
    id: number,
    item: VeicoloCreationAttributes
  ): Promise<boolean> {
    try {
      const [affectedCount] = await Veicolo.update(item, {
        where: { id },
        returning: true,
      });
      return affectedCount > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nell'aggiornamento del veicolo con id ${id}`
      );
    }
  }

  /**
   * Cancella un veicolo per ID.
   *
   * @param {number} id ID del veicolo da cancellare.
   * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta con successo, false in caso contrario.
   */
  public async delete(id: number): Promise<boolean> {
    try {
      const result = await Veicolo.destroy({ where: { id } });
      return result > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nella cancellazione del veicolo con id ${id}`
      );
    }
  }

  /**
   * Recupera un veicolo per targa.
   *
   * @param {string} targa La targa del veicolo da cercare.
   * @returns {Promise<Veicolo | null>} Promise che restituisce il veicolo trovato o null se non esistente.
   */
  public async findByTarga(targa: string): Promise<Veicolo | null> {
    try {
      return await Veicolo.findOne({ where: { targa } });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nella ricerca del veicolo con targa ${targa}`
      );
    }
  }

  /**
   * Recupera veicoli per più targhe.
   *
   * @param {string[]} targhe Array di targhe dei veicoli da cercare.
   * @returns {Promise<Veicolo[]>} Promise che restituisce un array di veicoli corrispondenti alle targhe specificate.
   */
  public async findByTarghe(targhe: string[]): Promise<Veicolo[]> {
    try {
      return await Veicolo.findAll({
        where: {
          targa: {
            [Op.in]: targhe,
          },
        },
      });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nella ricerca dei veicoli per le targhe specificate`
      );
    }
  }

  /**
   * Recupera un veicolo per ID con il TipoVeicolo associato.
   *
   * @param {number} id ID del veicolo.
   * @returns {Promise<Veicolo | null>} Promise che restituisce un veicolo con il TipoVeicolo o null se non esistente.
   */
  public async findByIdWithTipoVeicolo(id: number): Promise<Veicolo | null> {
    try {
      return await Veicolo.findByPk(id, {
        include: [
          {
            model: TipoVeicolo,
            as: 'tipoVeicolo',
          },
        ],
      });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nel recupero del veicolo con id ${id} e il suo TipoVeicolo`
      );
    }
  }
}

export default new VeicoloDao();
