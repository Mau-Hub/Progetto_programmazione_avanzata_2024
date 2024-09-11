import Transito, { TransitoAttributes, TransitoCreationAttributes } from '../models/transito';
import Tariffa from '../models/tariffa';
import Parcheggio from '../models/parcheggio';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';

class TransitoRepository {
  // Creazione di un nuovo transito con controllo sulla capacità del parcheggio
  async create(transitoData: TransitoCreationAttributes): Promise<Transito> {
    try {
      const parcheggio = await Parcheggio.findByPk(transitoData.id_posto);

      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Parcheggio non trovato'
        );
      }

      // Controllo sulla capacità del parcheggio
      const postiOccupati = await Transito.count({ where: { id_posto: parcheggio.id, uscita: null } });
      if (postiOccupati >= parcheggio.capacita) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.INVALID_INPUT,
          'Parcheggio pieno'
        );
      }

      const nuovoTransito = await Transito.create(transitoData);
      return nuovoTransito;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nella creazione del transito: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore sconosciuto nella creazione del transito'
        );
      }
    }
  }

  // Ottenere tutti i transiti
  async findAll(): Promise<Transito[]> {
    try {
      const transiti = await Transito.findAll();
      return transiti;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei transiti'
      );
    }
  }

  // Ottenere un transito specifico per ID
  async findById(id: number): Promise<Transito | null> {
    try {
      const transito = await Transito.findByPk(id);
      if (!transito) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Transito non trovato'
        );
      }
      return transito;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nel recupero del transito: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore sconosciuto nel recupero del transito'
        );
      }
    }
  }

  // Aggiornare un transito
  async update(id: number, transitoData: Partial<TransitoAttributes>): Promise<boolean> {
    try {
      const [numUpdated] = await Transito.update(transitoData, {
        where: { id },
      });
      if (numUpdated === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Transito non trovato per l\'aggiornamento'
        );
      }
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nell'aggiornamento del transito: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore sconosciuto nell\'aggiornamento del transito'
        );
      }
    }
  }

  // Eliminare un transito
  async delete(id: number): Promise<boolean> {
    try {
      const numDeleted = await Transito.destroy({
        where: { id },
      });
      if (numDeleted === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Transito non trovato per l\'eliminazione'
        );
      }
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nell'eliminazione del transito: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore sconosciuto nell\'eliminazione del transito'
        );
      }
    }
  }

  // Calcolo della tariffa basato su durata e fascia oraria e giorni feriali/festivi
  async calcolaImporto(transitoId: number, dataOraUscita: Date): Promise<number> {
    try {
      const transito = await Transito.findByPk(transitoId);

      if (!transito) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Transito non trovato'
        );
      }

      // Recupera la tariffa dal TariffaRepository
      const tariffa = await Tariffa.findByPk(transito.id_tariffa);

      if (!tariffa) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Tariffa non trovata'
        );
      }

      // Calcolo della durata in ore
      const durataInMs = dataOraUscita.getTime() - transito.ingresso.getTime();
      const durataInOre = durataInMs / (1000 * 60 * 60);

      // Determina se è feriale o festivo
      const giornoSettimana = transito.ingresso.getDay();
      const giornoFestivo = giornoSettimana === 0 || giornoSettimana === 6; // Considera domenica (0) e sabato (6) come festivi

      // Determina se la durata è diurna o notturna
      const oraIngresso = transito.ingresso.getHours();
      const fasciaOraria = oraIngresso >= 8 && oraIngresso < 20 ? 'DIURNA' : 'NOTTURNA';

      // Recupera l'importo dalla tariffa basata sulla fascia oraria e giorno festivo/feriale
      const importoOrario = (tariffa.fascia_oraria === fasciaOraria && tariffa.giorno_settimana.getDay() === giornoFestivo)
        ? tariffa.importo
        : 0;

      // Calcolo dell'importo totale
      const importo = durataInOre * importoOrario;
      return importo;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nel calcolo dell'importo: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore sconosciuto nel calcolo dell\'importo'
        );
      }
    }
  }

  // Aggiorna il transito con l'uscita e l'importo calcolato
  async aggiornaTransitoConImporto(transitoId: number, dataOraUscita: Date): Promise<Transito | null> {
    try {
      const importo = await this.calcolaImporto(transitoId, dataOraUscita);

      // Aggiorna il record con l'uscita e l'importo calcolato
      const [numUpdated, transitoAggiornato] = await Transito.update(
        { uscita: dataOraUscita, importo: importo },
        { where: { id: transitoId }, returning: true }
      );

      if (numUpdated === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Transito non trovato per l\'aggiornamento'
        );
      }

      return transitoAggiornato[0]; // Restituisce il transito aggiornato
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nell'aggiornamento del transito con importo: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore sconosciuto nell\'aggiornamento del transito con importo'
        );
      }
    }
  }
}

export default new TransitoRepository();