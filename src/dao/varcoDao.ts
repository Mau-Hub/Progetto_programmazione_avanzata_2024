import Varco from '../models/varco';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { DaoI } from './DaoI';

// Definizione dell'interfaccia VarcoAttributes
interface VarcoAttributes {
  id?: number;
  tipo: 'INGRESSO' | 'USCITA';
  bidirezionale: boolean;
  id_parcheggio: number;
}

class VarcoDao implements DaoI<VarcoAttributes, number> {
  /**
   * Recupera tutti i varchi.
   *
   * @returns {Promise<Varco[]>} Promise che restituice un array di varchi.
   */
  public async findAll(): Promise<Varco[]> {
    try {
      return await Varco.findAll();
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Si è verificato un errore nel recupero dei varchi'
      );
    }
  }

  /**
   * Recupero del varco per ID.
   *
   * @param {number} id del varco.
   * @returns {Promise<Varco | null>} Promise che restituisce un varco o restituisce null se non esistente.
   */
  public async findById(id: number): Promise<Varco | null> {
    try {
      const varco = await Varco.findByPk(id);
      if (!varco) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il varco con l'id ${id} inesistente`
        );
      }
      return varco;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nel recupero del varco con id ${id}`
      );
    }
  }

  /**
   * Crea un nuovo varco.
   *
   * @param {VarcoAttributes} item dati per generare il varco.
   * @returns {Promise<Varco>} Promise che restituisce il varco appena creato.
   */
  public async create(item: VarcoAttributes): Promise<Varco> {
    try {
      return await Varco.create(item);
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Si è verificato un errore nella creazione del varco'
      );
    }
  }

  /**
   * Aggiorna un varco esistente.
   *
   * @param {number} id id attribuito al varco.
   * @param {VarcoAttributes} item dati necessari per l'aggiornamento del varco
   * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto, false in caso contrario.
   */
  public async update(id: number, item: VarcoAttributes): Promise<boolean> {
    try {
      const [affectedCount] = await Varco.update(item, {
        where: { id },
        returning: true,
      });
      return affectedCount > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nell'aggiornamento del varco con id ${id}`
      );
    }
  }

  /**
   * Cancella un varco per ID.
   *
   * @param {number} id id del varco.
   * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta, false in caso contrario.
   */
  public async delete(id: number): Promise<boolean> {
    try {
      const result = await Varco.destroy({ where: { id } });
      return result > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nella cancellazione del varco con id ${id}`
      );
    }
  }

  /**
   * Recupera tutti i varchi di un parcheggio specifico.
   *
   * @param {number} idParcheggio ID del parcheggio.
   * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi del parcheggio specificato.
   */
  public async findByParcheggio(idParcheggio: number): Promise<Varco[]> {
    try {
      return await Varco.findAll({
        where: { id_parcheggio: idParcheggio },
      });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nel recupero dei varchi per il parcheggio con id ${idParcheggio}`
      );
    }
  }

  /**
   * Recupera tutti i varchi bidirezionali.
   *
   * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi bidirezionali.
   */
  public async findBidirezionali(): Promise<Varco[]> {
    try {
      return await Varco.findAll({
        where: { bidirezionale: true },
      });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Si è verificato un errore nel recupero dei varchi bidirezionali'
      );
    }
  }

  /**
   * Recupera tutti i varchi di un tipo specifico (INGRESSO o USCITA).
   *
   * @param {('INGRESSO' | 'USCITA')} tipo Tipo del varco.
   * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi del tipo specificato.
   */
  public async findByTipo(tipo: 'INGRESSO' | 'USCITA'): Promise<Varco[]> {
    try {
      return await Varco.findAll({
        where: { tipo },
      });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nel recupero dei varchi di tipo ${tipo}`
      );
    }
  }
}

export default new VarcoDao();
