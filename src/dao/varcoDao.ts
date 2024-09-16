import Varco from '../models/varco';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { VarcoAttributes, VarcoCreationAttributes } from '../models/varco';
import { DaoI } from './DaoI';
import { Transaction } from 'sequelize';

class VarcoDao implements DaoI<VarcoAttributes, number> {
  /**
   * Creazione di un nuovo varco.
   *
   * @param {VarcoCreationAttributes} varcoData Dati per la creazione del nuovo varco.
   * @returns {Promise<Varco>} Promise che restituisce il varco appena creato.
   */
  async create(
    varcoData: VarcoCreationAttributes,
    transaction?: Transaction
  ): Promise<Varco> {
    try {
      const nuovoVarco = await Varco.create(varcoData, { transaction });
      return nuovoVarco;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nella creazione del varco'
      );
    }
  }

  /**
   * Ottenere tutti i varchi.
   *
   * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi.
   */
  async findAll(): Promise<Varco[]> {
    try {
      const varchi = await Varco.findAll();
      return varchi;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei varchi'
      );
    }
  }

  /**
   * Ottenere un varco specifico per ID.
   *
   * @param {number} id ID del varco.
   * @returns {Promise<Varco | null>} Promise che restituisce un varco o null se non esistente.
   */
  async findById(id: number): Promise<Varco | null> {
    try {
      const varco = await Varco.findByPk(id);
      if (!varco) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Varco con ID ${id} non trovato`
        );
      }
      return varco;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero del varco'
      );
    }
  }

  /**
   * Aggiornare un varco.
   *
   * @param {number} id ID del varco da aggiornare.
   * @param {Partial<VarcoAttributes>} varcoData Dati parziali per aggiornare il varco.
   * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto con successo, false altrimenti.
   */
  async update(
    id: number,
    varcoData: Partial<VarcoAttributes>
  ): Promise<boolean> {
    try {
      const [numUpdated] = await Varco.update(varcoData, { where: { id } });
      if (numUpdated === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Varco con ID ${id} non trovato`
        );
      }
      return numUpdated === 1;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        "Errore nell'aggiornamento del varco"
      );
    }
  }

  /**
   * Eliminare un varco.
   *
   * @param {number} id ID del varco da eliminare.
   * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta con successo, false altrimenti.
   */
  async delete(id: number): Promise<boolean> {
    try {
      const numDeleted = await Varco.destroy({ where: { id } });
      if (numDeleted === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Varco con ID ${id} non trovato`
        );
      }
      return numDeleted === 1;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        "Errore nell'eliminazione del varco"
      );
    }
  }

  /**
   * Ottenere tutti i varchi di un parcheggio specifico.
   *
   * @param {number} idParcheggio ID del parcheggio.
   * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi per il parcheggio specificato.
   */
  async findByParcheggio(idParcheggio: number): Promise<Varco[]> {
    try {
      const varchi = await Varco.findAll({
        where: { id_parcheggio: idParcheggio },
      });
      return varchi;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei varchi per il parcheggio specificato'
      );
    }
  }

  /**
   * Ottenere tutti i varchi bidirezionali.
   *
   * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi bidirezionali.
   */
  async findBidirezionali(): Promise<Varco[]> {
    try {
      const varchi = await Varco.findAll({ where: { bidirezionale: true } });
      return varchi;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei varchi bidirezionali'
      );
    }
  }

  /**
   * Ottenere tutti i varchi di un tipo specifico.
   *
   * @param {('INGRESSO' | 'USCITA')} tipo Tipo del varco da cercare.
   * @returns {Promise<Varco[]>} Promise che restituisce un array di varchi del tipo specificato.
   */
  async findByTipo(tipo: 'INGRESSO' | 'USCITA'): Promise<Varco[]> {
    try {
      const varchi = await Varco.findAll({ where: { tipo } });
      return varchi;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei varchi per il tipo specificato'
      );
    }
  }
}

export default new VarcoDao();
