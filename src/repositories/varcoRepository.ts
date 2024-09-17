import VarcoDao from '../dao/varcoDao';
import UtenteDao from '../dao/utenteDao';
import { VarcoAttributes, VarcoCreationAttributes } from '../models/varco';
import Varco from '../models/varco';
import { Sequelize } from 'sequelize';
import Database from '../db/database';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { CustomHttpError } from '../ext/errorFactory';

class VarcoRepository {
  // Inizializza l'istanza di Sequelize per gestire le transazioni
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = Database.getInstance();
  }
  
  /**
   * Crea un nuovo varco e l'utente associato in una transazione.
   *
   * @param {VarcoCreationAttributes} varcoData - Dati per la creazione del varco.
   * @returns {Promise<Varco>} - Promise che restituisce il nuovo varco creato.
   * @throws {Error} - Errore se si verifica un problema durante la creazione.
   */
  async create(varcoData: VarcoCreationAttributes): Promise<Varco> {
    const transaction = await this.sequelize.transaction();
    try {
      // Crea il nuovo varco
      const nuovoVarco = await VarcoDao.create(varcoData, transaction);

      // Crea l'utente "varco" associato
      await UtenteDao.create(
        {
          nome: `UtenteVarco-${nuovoVarco.id}`,
          ruolo: 'varco',
          username: `varco${nuovoVarco.id}`,
        },
        transaction
      );

      await transaction.commit();
      return nuovoVarco;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof CustomHttpError) {
        // Rilancia l'errore originale se è un errore gestito
        throw error;
      } else {
        // Genera un nuovo errore per gli errori non gestiti
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          "Errore nella creazione del varco e dell'utente varco"
        );
      }
    }
  }

  /**
   * Ottiene tutti i varchi.
   *
   * @returns {Promise<Varco[]>} - Promise che restituisce una lista di varchi.
   */
  async findAll(): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi
    return VarcoDao.findAll();
  }

  /**
   * Ottiene un varco specifico per ID.
   *
   * @param {number} id - ID del varco da trovare.
   * @returns {Promise<Varco | null>} - Promise che restituisce il varco trovato o null se non esiste.
   */
  async findById(id: number): Promise<Varco | null> {
    // Chiama il metodo del DAO per ottenere il varco con un ID specifico
    return VarcoDao.findById(id);
  }

  /**
   * Aggiorna un varco esistente.
   *
   * @param {number} id - ID del varco da aggiornare.
   * @param {Partial<VarcoAttributes>} varcoData - Dati da aggiornare.
   * @returns {Promise<boolean>} - Promise che restituisce true se l'aggiornamento è avvenuto con successo.
   */
  async update(
    id: number,
    varcoData: Partial<VarcoAttributes>
  ): Promise<boolean> {
    // Chiama il metodo del DAO per aggiornare un varco
    return VarcoDao.update(id, varcoData);
  }

  /**
   * Elimina un varco per ID.
   *
   * @param {number} id - ID del varco da eliminare.
   * @returns {Promise<boolean>} - Promise che restituisce true se l'eliminazione è avvenuta con successo.
   */
  async delete(id: number): Promise<boolean> {
    // Chiama il metodo del DAO per eliminare un varco
    return VarcoDao.delete(id);
  }

  /**
   * Ottiene tutti i varchi di un parcheggio specifico.
   *
   * @param {number} idParcheggio - ID del parcheggio.
   * @returns {Promise<Varco[]>} - Promise che restituisce una lista di varchi per il parcheggio specificato.
   */
  async findByParcheggio(idParcheggio: number): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi di un parcheggio specifico
    return VarcoDao.findByParcheggio(idParcheggio);
  }

  /**
   * Ottiene tutti i varchi bidirezionali.
   *
   * @returns {Promise<Varco[]>} - Promise che restituisce una lista di varchi bidirezionali.
   */
  async findBidirezionali(): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi bidirezionali
    return VarcoDao.findBidirezionali();
  }

  /**
   * Ottiene tutti i varchi di un tipo specifico.
   *
   * @param {('INGRESSO' | 'USCITA')} tipo - Tipo di varco ('INGRESSO' o 'USCITA').
   * @returns {Promise<Varco[]>} - Promise che restituisce una lista di varchi del tipo specificato.
   */
  async findByTipo(tipo: 'INGRESSO' | 'USCITA'): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi di un tipo specifico
    return VarcoDao.findByTipo(tipo);
  }
}

export default new VarcoRepository();
