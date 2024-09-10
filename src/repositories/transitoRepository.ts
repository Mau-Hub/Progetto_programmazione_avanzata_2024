import Transito, { TransitoAttributes, TransitoCreationAttributes } from '../models/transito';
import Tariffa from '../models/tariffa';

class TransitoRepository {
  // Creazione di un nuovo transito
  async create(transitoData: TransitoCreationAttributes): Promise<Transito> {
    try {
      const nuovoTransito = await Transito.create(transitoData);
      return nuovoTransito;
    } catch (error) {
      throw new Error('Errore nella creazione del transito');
    }
  }

  // Ottenere tutti i transiti
  async findAll(): Promise<Transito[]> {
    try {
      const transiti = await Transito.findAll();
      return transiti;
    } catch (error) {
      throw new Error('Errore nel recupero dei transiti');
    }
  }

  // Ottenere un transito specifico per ID
  async findById(id: number): Promise<Transito | null> {
    try {
      const transito = await Transito.findByPk(id);
      return transito;
    } catch (error) {
      throw new Error('Errore nel recupero del transito');
    }
  }

  // Aggiornare un transito
  async update(id: number, transitoData: Partial<TransitoAttributes>): Promise<boolean> {
    try {
      const [numUpdated] = await Transito.update(transitoData, {
        where: { id },
      });
      return numUpdated === 1; // True se è stato aggiornato
    } catch (error) {
      throw new Error('Errore nell\'aggiornamento del transito');
    }
  }

  // Eliminare un transito
  async delete(id: number): Promise<boolean> {
    try {
      const numDeleted = await Transito.destroy({
        where: { id },
      });
      return numDeleted === 1; // True se è stato eliminato
    } catch (error) {
      throw new Error('Errore nell\'eliminazione del transito');
    }
  }

  // Calcolo della tariffa basato su durata e fascia oraria
  async calcolaImporto(transitoId: number, dataOraUscita: Date): Promise<number> {
    const transito = await Transito.findByPk(transitoId);

    if (!transito) {
      throw new Error('Transito non trovato');
    }

    // Recupera la tariffa dal TariffaRepository
    const tariffa = await Tariffa.findByPk(transito.id_tariffa);

    if (!tariffa) {
      throw new Error('Tariffa non trovata');
    }

    // Calcolo della durata in ore
    const durataInMs = dataOraUscita.getTime() - transito.ingresso.getTime();
    const durataInOre = durataInMs / (1000 * 60 * 60);

    // Determina se la durata è diurna o notturna
    const oraIngresso = transito.ingresso.getHours();
    const fasciaOraria = oraIngresso >= 8 && oraIngresso < 20 ? 'DIURNA' : 'NOTTURNA';

    // Recupera l'importo dalla tariffa basata sulla fascia oraria
    const importoOrario = tariffa.fascia_oraria === fasciaOraria ? tariffa.importo : 0;

    // Calcolo dell'importo totale
    const importo = durataInOre * importoOrario;
    return importo;
  }

  // Aggiorna il transito con l'uscita e l'importo calcolato
  async aggiornaTransitoConImporto(transitoId: number, dataOraUscita: Date): Promise<Transito | null> {
    const importo = await this.calcolaImporto(transitoId, dataOraUscita);

    // Aggiorna il record con l'uscita e l'importo calcolato
    const [_, transitoAggiornato] = await Transito.update(
      { uscita: dataOraUscita, importo: importo },
      { where: { id: transitoId }, returning: true }
    );

    return transitoAggiornato[0]; // Restituisce il transito aggiornato
  }
}

export default new TransitoRepository();
