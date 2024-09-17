import Utente from '../models/utente';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { DaoI } from './DaoI';
import { Transaction } from 'sequelize';

/**
 * Interfaccia UtenteAttributes che definisce gli attributi di un utente.
 */
interface UtenteAttributes {
  id?: number;
  nome: string;
  ruolo: 'operatore' | 'automobilista' | 'varco';
  username: string;
}

/**
 * Classe UtenteDao che implementa l'interfaccia DaoI per Utente.
 *
 * Fornisce metodi per gestire le operazioni CRUD relative agli utenti nel database.
 */
class UtenteDao implements DaoI<UtenteAttributes, number> {
  /**
   * Recupera tutti gli utenti.
   *
   * @returns {Promise<Utente[]>} Promise che restituisce un array di utenti.
   */
  public async findAll(): Promise<Utente[]> {
    try {
      return await Utente.findAll();
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Si è verificato un errore nel recupero degli utenti'
      );
    }
  }

  /**
   * Recupera un utente per ID.
   *
   * @param {number} id ID dell'utente.
   * @returns {Promise<Utente | null>} Promise che restituisce un utente o null se non esistente.
   */
  public async findById(id: number): Promise<Utente | null> {
    try {
      const utente = await Utente.findByPk(id);
      if (!utente) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `L'utente con id ${id} è inesistente`
        );
      }
      return utente;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nel recupero dell'utente con id ${id}`
      );
    }
  }

  /**
   * Crea un nuovo utente.
   *
   * @param {UtenteAttributes} item Dati per creare il nuovo utente.
   * @param {Transaction} [transaction] Transazione Sequelize opzionale per garantire l'atomicità.
   * @returns {Promise<Utente>} Promise che restituisce l'utente appena creato.
   */
  public async create(
    item: UtenteAttributes,
    transaction?: Transaction
  ): Promise<Utente> {
    try {
      return await Utente.create(item, { transaction });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        "Si è verificato un errore nella creazione dell'utente"
      );
    }
  }

  /**
   * Aggiorna un utente esistente.
   *
   * @param {number} id ID dell'utente da aggiornare.
   * @param {UtenteAttributes} item Dati aggiornati dell'utente.
   * @returns {Promise<boolean>} Promise che restituisce true se l'aggiornamento è avvenuto con successo, false in caso contrario.
   */
  public async update(id: number, item: UtenteAttributes): Promise<boolean> {
    try {
      const [affectedCount] = await Utente.update(item, {
        where: { id },
        returning: true,
      });
      return affectedCount > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nell'aggiornamento dell'utente con id ${id}`
      );
    }
  }

  /**
   * Cancella un utente per ID.
   *
   * @param {number} id ID dell'utente da cancellare.
   * @returns {Promise<boolean>} Promise che restituisce true se la cancellazione è avvenuta con successo, false in caso contrario.
   */
  public async delete(id: number): Promise<boolean> {
    try {
      const result = await Utente.destroy({ where: { id } });
      return result > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nella cancellazione dell'utente con id ${id}`
      );
    }
  }

  /**
   * Recupera un utente per nome.
   *
   * @param {string} nome Nome dell'utente.
   * @returns {Promise<Utente | null>} Promise che restituisce un utente o null se non trovato.
   */
  public async findByNome(nome: string): Promise<Utente | null> {
    try {
      return await Utente.findOne({ where: { nome } });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nel recupero dell'utente con nome ${nome}`
      );
    }
  }

  /**
   * Recupera tutti gli utenti per ruolo.
   *
   * @param {('operatore' | 'automobilista' | 'varco')} ruolo Ruolo degli utenti da recuperare.
   * @returns {Promise<Utente[]>} Promise che restituisce un array di utenti con il ruolo specificato.
   */
  public async findByRuolo(
    ruolo: 'operatore' | 'automobilista' | 'varco'
  ): Promise<Utente[]> {
    try {
      return await Utente.findAll({ where: { ruolo } });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Si è verificato un errore nel recupero degli utenti con ruolo ${ruolo}`
      );
    }
  }

  /**
   * Recupera un utente per username.
   *
   * @param {string} username Username dell'utente.
   * @returns {Promise<Utente | null>} Promise che restituisce un utente o null se non trovato.
   */
  public async findByUsername(username: string): Promise<Utente | null> {
    try {
      return await Utente.findOne({ where: { username } });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        "Si è verificato un errore nel recupero dell'utente tramite username"
      );
    }
  }
}

export default new UtenteDao();
