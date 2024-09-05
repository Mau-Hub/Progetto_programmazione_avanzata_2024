import Transito from '../models/transito';
import Veicolo from '../models/veicolo'; // Importa il modello Veicolo
import Varco from '../models/varco'; // Importa il modello Varco
import Tariffa from '../models/tariffa'; // Importa il modello Tariffa
import Posto from '../models/posto'; // Importa il modello Posto
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { DaoI } from './DaoI';
import { TransitoAttributes } from '../models/transito';

// Classe TransitoDao che implementa l'interfaccia DaoI per Transito
class TransitoDao implements DaoI<TransitoAttributes, number> {
  /**
   * Recupera tutti i transiti.
   *
   * @returns {Promise<Transito[]>} Promise che restituisce un array di transiti.
   */
  public async findAll(): Promise<Transito[]> {
    try {
      return await Transito.findAll({
        include: [
          { model: Veicolo, as: 'veicolo' },
          { model: Varco, as: 'varcoIngresso' },
          { model: Varco, as: 'varcoUscita' },
          { model: Tariffa, as: 'tariffa' },
          { model: Posto, as: 'posto' },
        ],
      });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Si è verificato un problema nel recupero dei transiti'
      );
    }
  }

  /**
   * Recupero del transito per ID.
   *
   * @param {number} id del transito.
   * @returns {Promise<Transito | null>} Promise che restituisce un transito o restituisce null se non esistente.
   */
  public async findById(id: number): Promise<Transito | null> {
    try {
      const transito = await Transito.findByPk(id, {
        include: [
          { model: Veicolo, as: 'veicolo' },
          { model: Varco, as: 'varcoIngresso' },
          { model: Varco, as: 'varcoUscita' },
          { model: Tariffa, as: 'tariffa' },
          { model: Posto, as: 'posto' },
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
        `Si è verificato un errore nel recupero del transito con id ${id}`
      );
    }
  }

  /**
   * Crea un nuovo transito.
   *
   * @param {TransitoAttributes} item dati per generare il transito.
   * @returns {Promise<Transito>} Promise che restituisce il transito appena creato.
   */
  public async create(item: TransitoAttributes): Promise<Transito> {
    try {
      return await Transito.create(item);
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Si è verificato un errore nella creazione del transito'
      );
    }
  }

  /**
   * Aggiorna un transito esistente.
   *
   * @param {number} id id attribuito al transito.
   * @param {TransitoAttributes} item dati necessari per l’aggiornamento del transito
   * @returns {Promise<boolean>} “Promise che restituisce true se l’aggiornamento è avvenuto, false in caso contrario.
   */
  public async update(id: number, item: TransitoAttributes): Promise<boolean> {
    try {
      const [affectedCount] = await Transito.update(item, {
        where: { id },
        returning: true,
      });
      return affectedCount > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nell'aggiornamento del transito con id ${id}`
      );
    }
  }

  /**
   * Cancella un transito per ID.
   *
   * @param {number} id id del transito.
   * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta, false in caso contrario.
   */
  public async delete(id: number): Promise<boolean> {
    try {
      const result = await Transito.destroy({ where: { id } });
      return result > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nella cancellazione del transito con id ${id}`
      );
    }
  }
}

export default new TransitoDao();
