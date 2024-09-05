import Parcheggio from '../models/parcheggio';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { DaoI } from './DaoI';
import { ParcheggioAttributes } from '../models/parcheggio';

// Classe ParcheggioDao che implementa l'interfaccia DaoI per Parcheggio
class ParcheggioDao implements DaoI<ParcheggioAttributes, number> {
  /**
   * Recupera tutti i parcheggi.
   *
   * @returns {Promise<Parcheggio[]>} Promise che risolve un array di parcheggi.
   */
  public async findAll(): Promise<Parcheggio[]> {
    try {
      return await Parcheggio.findAll();
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Problema nel recupero dei parcheggi'
      );
    }
  }

  /**
   * Recupero del parcheggio per ID.
   *
   * @param {number} id del parcheggio.
   * @returns {Promise<Parcheggio | null>} Promise che risolve un parcheggio o restituisce null se non esistente.
   */

  public async findById(id: number): Promise<Parcheggio | null> {
    try {
      const parcheggio = await Parcheggio.findByPk(id);
      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Parcheggio con id ${id} inesistente`
        );
      }
      return parcheggio;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore nel recupero del parcheggio con id ${id}`
      );
    }
  }

  /**
   * Crea un nuovo parcheggio.
   *
   * @param {ParcheggioAttributes} item dati per generare il parcheggio.
   * @returns {Promise<Parcheggio>} Promise che risolve il parcheggio appena creato.
   */

  public async create(item: ParcheggioAttributes): Promise<Parcheggio> {
    try {
      return await Parcheggio.create(item);
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Si è verificato un problema nella creazione del parcheggio'
      );
    }
  }

  /**
   * Aggiorna un parcheggio esistente.
   *
   * @param {number} id id attribuito al parcheggio.
   * @param {ParcheggioAttributes} item dati necessari per l’aggiornamento del parcheggio
   * @returns {Promise<boolean>} “Promise che risolve con true se l’aggiornamento è avvenuto, false in caso contrario.
   */

  public async update(
    id: number,
    item: ParcheggioAttributes
  ): Promise<boolean> {
    try {
      const [affectedCount] = await Parcheggio.update(item, {
        where: { id },
        returning: true,
      });
      return affectedCount > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nell'aggiornamento del parcheggio con id ${id}`
      );
    }
  }

  /**
   * Cancella un parcheggio per ID.
   *
   * @param {number} id id del parcheggio.
   * @returns {Promise<boolean>} Promise che risolve true se la cancellazione è avvenuta, false in caso contrario.
   */

  public async delete(id: number): Promise<boolean> {
    try {
      const result = await Parcheggio.destroy({ where: { id } });
      return result > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore nella cancellazione del parcheggio con id ${id}`
      );
    }
  }
}

export default new ParcheggioDao();
