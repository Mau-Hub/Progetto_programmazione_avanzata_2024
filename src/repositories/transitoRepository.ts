import transitoDao from '../dao/transitoDao';
import veicoloDao from '../dao/veicoloDao';
import parcheggioDao from '../dao/parcheggioDao';
import varcoDao from '../dao/varcoDao';
import tariffaDao from '../dao/tariffaDao';
import Transito, {
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
    this.sequelize = Database.getInstance();
  }

  public async create(
    transitoData: Omit<TransitoCreationAttributes, 'id_posto'>,
    targa: string,
    id_tipo_veicolo: number,
    id_utente: number
  ): Promise<TransitoAttributes> {
    const transaction = await this.sequelize.transaction();

    try {
      let veicolo = await veicoloDao.findByTarga(targa);

      if (!veicolo) {
        veicolo = await veicoloDao.create({
          targa: targa,
          id_tipo_veicolo: id_tipo_veicolo,
          id_utente: id_utente,
        });
      }

      const varcoIngresso = await varcoDao.findById(
        transitoData.id_varco_ingresso
      );

      if (!varcoIngresso) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Varco di ingresso non trovato'
        );
      }

      const parcheggio = await parcheggioDao.findById(
        varcoIngresso.id_parcheggio
      );

      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Parcheggio non trovato'
        );
      }

      if (parcheggio.posti_disponibili <= 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.INVALID_INPUT,
          'Nessun posto disponibile nel parcheggio'
        );
      }

      parcheggio.posti_disponibili -= 1;
      await parcheggio.save({ transaction });

      const nuovoTransito = await transitoDao.create(
        {
          ...transitoData,
          ingresso: new Date(),
          id_veicolo: veicolo.id,
        },
        transaction
      );

      await transaction.commit();
      return nuovoTransito;
    } catch (error) {
      await transaction.rollback();
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore durante la creazione del transito'
      );
    }
  }

  public async updateUscita(
    transitoId: number,
    varcoUscitaId: number,
    dataOraUscita: Date
  ): Promise<TransitoAttributes> {
    const transaction = await this.sequelize.transaction();

    try {
      // Recupera il transito
      const transito = (await this.findById(transitoId)) as Transito;

      if (!transito) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il transito con id ${transitoId} non è stato trovato`
        );
      }

      // **Controllo per verificare se il transito è già stato chiuso**
      if (transito.uscita) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.INVALID_INPUT,
          `Il transito con id ${transitoId} è già stato chiuso`
        );
      }

      const varcoUscita = await varcoDao.findById(varcoUscitaId);

      if (!varcoUscita) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Varco di uscita non trovato'
        );
      }

      const parcheggio = await parcheggioDao.findById(
        varcoUscita.id_parcheggio
      );

      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Parcheggio non trovato'
        );
      }

      // Incrementa i posti disponibili e salva il parcheggio
      parcheggio.posti_disponibili += 1;
      await parcheggio.save({ transaction });

      // Recupera il veicolo associato al transito
      const veicolo = await veicoloDao.findById(transito.id_veicolo);
      if (!veicolo) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Veicolo non trovato per il transito'
        );
      }
      const idTipoVeicolo = veicolo.id_tipo_veicolo;

      // Trova la tariffa appropriata
      const tariffa = await tariffaDao.findOne({
        where: {
          id_tipo_veicolo: idTipoVeicolo,
          fascia_oraria: TransitoService.determinaFasciaOraria(dataOraUscita),
          feriale_festivo:
            TransitoService.determinaFerialeFestivo(dataOraUscita),
          id_parcheggio: varcoUscita.id_parcheggio,
        },
      });

      if (!tariffa) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Tariffa non disponibile per questo transito'
        );
      }

      // Calcolo dell'importo
      const importo = await TransitoService.calcolaImporto(
        transitoId,
        dataOraUscita
      );

      // Aggiorna il transito con tutte le informazioni
      await transitoDao.update(
        transitoId,
        {
          id_tariffa: tariffa.id,
          id_varco_uscita: varcoUscitaId,
          uscita: dataOraUscita,
          importo,
        },
        transaction
      );

      await transaction.commit();

      return {
        id: transito.id,
        ingresso: transito.ingresso,
        uscita: dataOraUscita,
        id_veicolo: transito.id_veicolo,
        id_varco_ingresso: transito.id_varco_ingresso,
        id_varco_uscita: varcoUscitaId,
        id_tariffa: tariffa.id,
        importo: importo,
      };
    } catch (error) {
      console.error("Errore durante l'uscita del veicolo:", error);
      await transaction.rollback();
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante l'aggiornamento del transito con uscita per id ${transitoId}`
      );
    }
  }

  public async findById(id: number): Promise<Transito> {
    try {
      const transito = (await transitoDao.findById(id)) as Transito;

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
