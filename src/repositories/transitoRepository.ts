import Transito, { TransitoAttributes, TransitoCreationAttributes } from '../models/transito';
import Tariffa from '../models/tariffa';
import Parcheggio from '../models/parcheggio';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import TransitoService from '../ext/TransitoService'; 

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
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore nella creazione del transito: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }

  // Aggiorna il transito con l'uscita e l'importo calcolato
  async aggiornaTransitoConImporto(transitoId: number, dataOraUscita: Date): Promise<Transito | null> {
    try {
      const transito = await Transito.findByPk(transitoId);

      if (!transito) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Transito non trovato'
        );
      }

      const tariffa = await Tariffa.findByPk(transito.id_tariffa);

      if (!tariffa) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Tariffa non trovata'
        );
      }

      // Calcolo dell'importo tramite TransitoService
      const importo = await TransitoService.calcolaImporto(transito, tariffa, dataOraUscita);

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

      return transitoAggiornato[0]; 
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore nell'aggiornamento del transito con importo: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }

}

export default new TransitoRepository();
