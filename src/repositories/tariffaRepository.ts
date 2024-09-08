import Tariffa from '../models/tariffa';
import {
  TariffaAttributes,
  TariffaCreationAttributes,
} from '../models/tariffa';

class TariffaRepository {
  // Creazione di una nuova tariffa
  async create(tariffaData: TariffaCreationAttributes): Promise<Tariffa> {
    try {
      const nuovaTariffa = await Tariffa.create(tariffaData);
      return nuovaTariffa;
    } catch (error) {
      throw new Error('Errore nella creazione della tariffa');
    }
  }

  // Acquisizione di tutte le tariffe
  async findAll(): Promise<Tariffa[]> {
    try {
      const tariffe = await Tariffa.findAll();
      return tariffe;
    } catch (error) {
      throw new Error('Errore nel recupero delle tariffe');
    }
  }

  // Acquisizione di una tariffa specifica per ID
  async findById(id: number): Promise<Tariffa | null> {
    try {
      const tariffa = await Tariffa.findByPk(id);
      return tariffa;
    } catch (error) {
      throw new Error('Errore nel recupero della tariffa');
    }
  }

  // Aggiornamento di una tariffa
  async update(
    id: number,
    tariffaData: Partial<TariffaAttributes>
  ): Promise<boolean> {
    try {
      const [numUpdated] = await Tariffa.update(tariffaData, {
        where: { id },
      });
      return numUpdated === 1;
    } catch (error) {
      throw new Error("Errore nell'aggiornamento della tariffa");
    }
  }

  // Eliminazione di una tariffa
  async delete(id: number): Promise<boolean> {
    try {
      const numDeleted = await Tariffa.destroy({
        where: { id },
      });
      return numDeleted === 1;
    } catch (error) {
      throw new Error("Errore nell'eliminazione della tariffa");
    }
  }
}

export default new TariffaRepository();
