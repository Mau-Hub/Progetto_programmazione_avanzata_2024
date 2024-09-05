import TipoVeicolo, { TipoVeicoloAttributes } from '../models/tipoVeicolo';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { DaoI } from './DaoI';

// Classe TipoVeicoloDao che implementa l'interfaccia DaoI per TipoVeicolo
class TipoVeicoloDao implements DaoI<TipoVeicoloAttributes, number> {
  /**
   * Recupera tutti i tipi di veicoli.
   *
   * @returns {Promise<TipoVeicolo[]>} Promise che restituisce un array di tipi di veicolo.
   */
  public async findAll(): Promise<TipoVeicolo[]> {
    try {
      return await TipoVeicolo.findAll();
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Si è verificato un problema nel recupero dei tipi di veicolo'
      );
    }
  }

  /**
   * Recupero del tipo di veicolo per ID.
   *
   * @param {number} id del tipo di veicolo.
   * @returns {Promise<TipoVeicolo | null>} Promise che restituisce un tipo di veicolo o null se non esistente.
   */
  public async findById(id: number): Promise<TipoVeicolo | null> {
    try {
      const tipoVeicolo = await TipoVeicolo.findByPk(id);
      if (!tipoVeicolo) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il tipo di veicolo con id ${id} è inesistente`
        );
      }
      return tipoVeicolo;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nel recupero del tipo di veicolo con id ${id}`
      );
    }
  }

  /**
   * Crea un nuovo tipo di veicolo.
   *
   * @param {TipoVeicoloAttributes} item Dati per creare il nuovo tipo di veicolo.
   * @returns {Promise<TipoVeicolo>} Promise che restituisce il tipo di veicolo appena creato.
   */
  public async create(item: TipoVeicoloAttributes): Promise<TipoVeicolo> {
    try {
      return await TipoVeicolo.create(item);
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Si è verificato un errore nella creazione del tipo di veicolo'
      );
    }
  }

  /**
   * Aggiorna un tipo di veicolo esistente.
   *
   * @param {number} id ID del tipo di veicolo da aggiornare.
   * @param {TipoVeicoloAttributes} item Dati aggiornati del tipo di veicolo.
   * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto con successo, false in caso contrario.
   */
  public async update(
    id: number,
    item: TipoVeicoloAttributes
  ): Promise<boolean> {
    try {
      const [affectedCount] = await TipoVeicolo.update(item, {
        where: { id },
        returning: true,
      });
      return affectedCount > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nell'aggiornamento del tipo di veicolo con id ${id}`
      );
    }
  }

  /**
   * Cancella un tipo di veicolo per ID.
   *
   * @param {number} id ID del tipo di veicolo da cancellare.
   * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta, false in caso contrario.
   */
  public async delete(id: number): Promise<boolean> {
    try {
      const result = await TipoVeicolo.destroy({ where: { id } });
      return result > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nella cancellazione del tipo di veicolo con id ${id}`
      );
    }
  }
}

export default new TipoVeicoloDao();
