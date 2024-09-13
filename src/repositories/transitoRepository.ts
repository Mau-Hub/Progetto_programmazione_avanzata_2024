import transitoDao from '../dao/transitoDao';
import veicoloDao from '../dao/veicoloDao';
import varcoDao from '../dao/varcoDao';
import {
  TransitoAttributes,
  TransitoCreationAttributes,
} from '../models/transito';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import TransitoService from '../ext/transitoService';
import { Sequelize } from 'sequelize';
import Database from '../db/database';

class TransitoRepository {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = Database.getInstance(); // Recupero dell'istanza del database
  }

  /**
   * Creazione di un transito in ingresso.
   * Nel transito in ingresso non viene fornito il varco di uscita né la tariffa, poiché saranno calcolati al momento dell'uscita.
   * Se il veicolo non è presente nel database, viene creato automaticamente.
   *
   * @param transitoData - Dati del nuovo transito (solo ingresso)
   * @param targa - La targa del veicolo che entra
   * @param id_tipo_veicolo - Il tipo del veicolo
   * @param id_utente - L'utente a cui è associato il veicolo
   * @returns Il transito creato
   */
  public async create(
    transitoData: TransitoCreationAttributes,
    targa: string,
    id_tipo_veicolo: number,
    id_utente: number
  ): Promise<TransitoAttributes> {
    const transaction = await this.sequelize.transaction();

    try {
      // Verifica se il veicolo esiste tramite la targa, altrimenti crealo
      let veicolo = await veicoloDao.findByTarga(targa);

      if (!veicolo) {
        // Crea il veicolo se non esiste
        veicolo = await veicoloDao.create({
          targa: targa,
          id_tipo_veicolo: id_tipo_veicolo,
          id_utente: id_utente,
        });
      }

      // Verifica esistenza varco di ingresso
      const varcoIngresso = await varcoDao.findById(
        transitoData.id_varco_ingresso
      );

      if (!varcoIngresso) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Varco di ingresso non trovato'
        );
      }

      // Creazione del nuovo transito con solo ingresso
      const nuovoTransito = await transitoDao.create({
        ...transitoData,
        id_veicolo: veicolo.id, // Associa il veicolo appena creato o trovato
      });

      await transaction.commit(); // Commit della transazione
      return nuovoTransito;
    } catch (error) {
      await transaction.rollback(); // Rollback della transazione in caso di errore
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore durante la creazione del transito'
      );
    }
  }

  /**
   * Aggiornamento di un transito con varco di uscita e calcolo della tariffa dinamica.
   *
   * @param transitoId - L'ID del transito da aggiornare
   * @param varcoUscitaId - L'ID del varco di uscita
   * @param dataOraUscita - La data e ora di uscita
   * @returns Il transito aggiornato con l'importo calcolato
   */
  public async updateUscita(
    transitoId: number,
    varcoUscitaId: number,
    dataOraUscita: Date
  ): Promise<TransitoAttributes> {
    const transaction = await this.sequelize.transaction();

    try {
      const transito = await this.findById(transitoId);

      if (!transito) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il transito con id ${transitoId} non è stato trovato`
        );
      }

      // Verifica esistenza varco di uscita
      const varcoUscita = await varcoDao.findById(varcoUscitaId);

      if (!varcoUscita) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Varco di uscita non trovato'
        );
      }

      // Calcolo dell'importo basato sulla durata e sulla tariffa dinamica
      const importo = await TransitoService.calcolaImporto(
        transitoId,
        dataOraUscita
      );

      // Aggiornamento del transito con il varco di uscita, la data di uscita e l'importo calcolato
      const updateData = {
        id_varco_uscita: varcoUscitaId,
        uscita: dataOraUscita,
        importo, // Importo calcolato dinamicamente
      };

      await transitoDao.update(transitoId, updateData);

      await transaction.commit();
      return { ...transito, ...updateData }; // Restituisce il transito aggiornato
    } catch (error) {
      await transaction.rollback();
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante l'aggiornamento del transito con uscita per id ${transitoId}`
      );
    }
  }

  /**
   * Recupera un transito per ID.
   *
   * @param id - L'ID del transito da recuperare
   * @returns Il transito trovato
   */
  public async findById(id: number): Promise<TransitoAttributes | null> {
    try {
      const transito = await transitoDao.findById(id);

      if (!transito) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il transito con id ${id} non è stato trovato`
        );
      }

      return transito;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore nel recupero del transito con id ${id}`
      );
    }
  }

  /**
   * Cancella un transito per ID.
   *
   * @param id - L'ID del transito da eliminare
   * @returns true se l'eliminazione è avvenuta correttamente, false altrimenti
   */
  public async delete(id: number): Promise<boolean> {
    const transaction = await this.sequelize.transaction();

    try {
      const transito = await this.findById(id);

      if (!transito) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il transito con id ${id} non esiste`
        );
      }

      const deleted = await transitoDao.delete(id);

      await transaction.commit();
      return deleted;
    } catch (error) {
      await transaction.rollback();
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante l'eliminazione del transito con id ${id}`
      );
    }
  }
}

export default new TransitoRepository();
