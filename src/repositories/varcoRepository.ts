import Varco from '../models/varco'; 
import { VarcoAttributes, VarcoCreationAttributes } from '../models/varco';

class VarcoRepository {
  // Creazione di un nuovo varco
  async create(varcoData: VarcoCreationAttributes): Promise<Varco> {
    try {
      const nuovoVarco = await Varco.create(varcoData);
      return nuovoVarco;
    } catch (error) {
      throw new Error('Errore nella creazione del varco');
    }
  }

  // Ottenere tutti i varchi
  async findAll(): Promise<Varco[]> {
    try {
      const varchi = await Varco.findAll();
      return varchi;
    } catch (error) {
      throw new Error('Errore nel recupero dei varchi');
    }
  }

  // Ottenere un varco specifico per ID
  async findById(id: number): Promise<Varco | null> {
    try {
      const varco = await Varco.findByPk(id);
      return varco;
    } catch (error) {
      throw new Error('Errore nel recupero del varco');
    }
  }

  // Aggiornare un varco
  async update(id: number, varcoData: Partial<VarcoAttributes>): Promise<boolean> {
    try {
      const [numUpdated] = await Varco.update(varcoData, {
        where: { id },
      });
      return numUpdated === 1; // True se è stato aggiornato
    } catch (error) {
      throw new Error('Errore nell\'aggiornamento del varco');
    }
  }

  // Eliminare un varco
  async delete(id: number): Promise<boolean> {
    try {
      const numDeleted = await Varco.destroy({
        where: { id },
      });
      return numDeleted === 1; // True se è stato eliminato
    } catch (error) {
      throw new Error('Errore nell\'eliminazione del varco');
    }
  }
}

export default new VarcoRepository();
