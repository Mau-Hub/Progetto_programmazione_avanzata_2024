import Transito, { TransitoAttributes, TransitoCreationAttributes } from '../models/transito';

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
}

export default new TransitoRepository();
