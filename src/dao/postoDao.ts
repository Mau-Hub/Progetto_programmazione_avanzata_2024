import { Op } from 'sequelize';
import Posto from '../models/posto';
import Parcheggio from '../models/parcheggio';

class PostoDao {
  // Crea un nuovo posto
  async createPosto(data: {
    numero: string;
    stato: 'libero' | 'occupato';
    id_parcheggio: number;
  }): Promise<Posto> {
    try {
      const newPosto = await Posto.create(data);
      return newPosto;
    } catch (error) {
      throw new Error(
        `Errore durante la creazione del posto: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }

  // Ottieni tutti i posti o filtra per stato/parcheggio
  async getAllPosti(filters?: {
    stato?: 'libero' | 'occupato';
    id_parcheggio?: number;
  }): Promise<Posto[]> {
    try {
      const posti = await Posto.findAll({
        where: filters
          ? {
              ...(filters.stato && { stato: filters.stato }),
              ...(filters.id_parcheggio && {
                id_parcheggio: filters.id_parcheggio,
              }),
            }
          : {},
        include: [
          {
            model: Parcheggio,
            as: 'parcheggio',
          },
        ],
      });
      return posti;
    } catch (error) {
      throw new Error(
        `Errore durante il recupero dei posti: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }

  // Ottieni un posto per ID
  async getPostoById(id: number): Promise<Posto | null> {
    try {
      const posto = await Posto.findByPk(id, {
        include: [
          {
            model: Parcheggio,
            as: 'parcheggio',
          },
        ],
      });
      return posto;
    } catch (error) {
      throw new Error(
        `Errore durante il recupero del posto con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }

  // Aggiorna un posto per ID
  async updatePosto(
    id: number,
    data: Partial<{
      numero: string;
      stato: 'libero' | 'occupato';
      id_parcheggio: number;
    }>
  ): Promise<[number, Posto[]]> {
    try {
      const [affectedRows, updatedPosto] = await Posto.update(data, {
        where: { id },
        returning: true,
      });
      return [affectedRows, updatedPosto];
    } catch (error) {
      throw new Error(
        `Errore durante l'aggiornamento del posto con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }

  // Elimina un posto per ID
  async deletePosto(id: number): Promise<number> {
    try {
      const deletedRows = await Posto.destroy({
        where: { id },
      });
      return deletedRows;
    } catch (error) {
      throw new Error(
        `Errore durante l'eliminazione del posto con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }
}

export default new PostoDao();
