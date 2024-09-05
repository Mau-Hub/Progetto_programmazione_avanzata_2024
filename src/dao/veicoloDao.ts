import Veicolo from '../models/veicolo';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { DaoI } from './DaoI';
import { VeicoloAttributes } from '../models/veicolo';
import { Op } from 'sequelize';

// Classe VeicoloDao che implementa l'interfaccia DaoI per Veicolo
class VeicoloDao implements DaoI<VeicoloAttributes, number> {
  /**
   * Recupera tutti i veicoli.
   *
   * @returns {Promise<Veicolo[]>} Promise che restituisce un array di veicoli.
   */
  public async findAll(): Promise<Veicolo[]> {
    try {
      return await Veicolo.findAll();
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
   * @param {number} id del veicolo.
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
   * @param {VeicoloAttributes} item dati per generare il veicolo.
   * @returns {Promise<Veicolo>} Promise che restituisce il veicolo appena creato.
   */
  public async create(item: VeicoloAttributes): Promise<Veicolo> {
    try {
      return await Veicolo.create(item);
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
   * @param {number} id id attribuito al veicolo.
   * @param {VeicoloAttributes} item dati necessari per l'aggiornamento del veicolo
   * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto, false in caso contrario.
   */
  public async update(id: number, item: VeicoloAttributes): Promise<boolean> {
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
   * @param {number} id id del veicolo.
   * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta, false in caso contrario.
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
}

export default new VeicoloDao();
