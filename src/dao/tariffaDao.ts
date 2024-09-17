import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import Tariffa, {
  TariffaAttributes,
  TariffaCreationAttributes,
} from '../models/tariffa';
import TipoVeicolo from '../models/tipoVeicolo';
import Parcheggio from '../models/parcheggio';
import { DaoI } from './DaoI';
import { FindOptions } from 'sequelize';

/**
 * Classe TariffaDao che implementa l'interfaccia DaoI per Tariffa.
 *
 * Fornisce metodi per gestire le operazioni CRUD relative alle tariffe nel database.
 */
class TariffaDao implements DaoI<TariffaAttributes, number> {
  /**
   * Crea una nuova tariffa.
   *
   * @param {TariffaCreationAttributes} item Dati per creare la nuova tariffa.
   * @returns {Promise<Tariffa>} Promise che restituisce la tariffa appena creata.
   */
  public async create(item: TariffaCreationAttributes): Promise<Tariffa> {
    try {
      const tariffa = await Tariffa.create(item);
      return tariffa;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante la creazione della tariffa: ${
          error instanceof Error ? error.message : 'Errore sconosciuto'
        }`
      );
    }
  }

  /**
   * Recupera una tariffa per ID.
   *
   * @param {number} id ID della tariffa da recuperare.
   * @returns {Promise<Tariffa | null>} Promise che restituisce la tariffa trovata o null se non esiste.
   */
  public async findById(id: number): Promise<Tariffa | null> {
    try {
      const tariffa = await Tariffa.findByPk(id, {
        include: [
          { model: TipoVeicolo, as: 'tipoVeicolo' },
          { model: Parcheggio, as: 'parcheggio' },
        ],
      });

      if (!tariffa) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `La tariffa con ID ${id} non è stata trovata`
        );
      }

      return tariffa;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante il recupero della tariffa con ID ${id}: ${
          error instanceof Error ? error.message : 'Errore sconosciuto'
        }`
      );
    }
  }

  /**
   * Trova una tariffa con criteri personalizzati.
   *
   * @param {FindOptions} options Opzioni di ricerca per personalizzare i criteri di ricerca.
   * @returns {Promise<Tariffa | null>} Promise che restituisce la tariffa trovata o null se non esiste.
   */
  public async findOne(options: FindOptions): Promise<Tariffa | null> {
    try {
      const tariffa = await Tariffa.findOne(options);

      if (!tariffa) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Tariffa non trovata per i criteri specificati'
        );
      }

      return tariffa;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante la ricerca della tariffa: ${
          error instanceof Error ? error.message : 'Errore sconosciuto'
        }`
      );
    }
  }

  /**
   * Recupera tutte le tariffe.
   *
   * @returns {Promise<Tariffa[]>} Promise che restituisce un array di tutte le tariffe.
   */
  public async findAll(): Promise<Tariffa[]> {
    try {
      const tariffe = await Tariffa.findAll({
        include: [
          { model: TipoVeicolo, as: 'tipoVeicolo' },
          { model: Parcheggio, as: 'parcheggio' },
        ],
      });
      return tariffe;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante il recupero di tutte le tariffe: ${
          error instanceof Error ? error.message : 'Errore sconosciuto'
        }`
      );
    }
  }

  /**
   * Aggiorna una tariffa esistente.
   *
   * @param {number} id ID della tariffa da aggiornare.
   * @param {Partial<TariffaAttributes>} item Dati aggiornati della tariffa.
   * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto con successo, false in caso contrario.
   */
  public async update(
    id: number,
    item: Partial<TariffaAttributes>
  ): Promise<boolean> {
    try {
      const result = await Tariffa.update(item, {
        where: { id },
      });

      if (result[0] === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `La tariffa con ID ${id} non esiste`
        );
      }

      return result[0] > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante l'aggiornamento della tariffa con ID ${id}: ${
          error instanceof Error ? error.message : 'Errore sconosciuto'
        }`
      );
    }
  }

  /**
   * Elimina una tariffa per ID.
   *
   * @param {number} id ID della tariffa da eliminare.
   * @returns {Promise<boolean>} Promise che restituisce true se l'eliminazione è avvenuta, false in caso contrario.
   */
  public async delete(id: number): Promise<boolean> {
    try {
      const result = await Tariffa.destroy({
        where: { id },
      });

      if (result === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `La tariffa con ID ${id} non è stata trovata`
        );
      }

      return result > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante l'eliminazione della tariffa con ID ${id}: ${
          error instanceof Error ? error.message : 'Errore sconosciuto'
        }`
      );
    }
  }
}

export default new TariffaDao();
