import Tariffa, { TariffaAttributes } from '../models/tariffa';
import TipoVeicolo from '../models/tipoVeicolo';
import Parcheggio from '../models/parcheggio';
import Utente from '../models/utente';

class TariffaDao {
  // Metodo per creare una nuova tariffa
  public async createTariffa(data: {
    id_tipo_veicolo: number;
    importo: number;
    fascia_oraria: 'DIURNA' | 'NOTTURNA';
    giorno_settimana: TariffaAttributes['giorno_settimana'];
    feriale_festivo: 'FERIALE' | 'FESTIVO';
    id_parcheggio: number;
    id_utente: number;
  }): Promise<Tariffa> {
    try {
      const tariffa = await Tariffa.create(data);
      return tariffa;
    } catch (error) {
      throw new Error(
        `Errore durante la creazione della tariffa: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }

  // Metodo per trovare una tariffa per ID
  public async getTariffaById(id: number): Promise<Tariffa | null> {
    try {
      const tariffa = await Tariffa.findByPk(id, {
        include: [
          { model: TipoVeicolo, as: 'tipoVeicolo' },
          { model: Parcheggio, as: 'parcheggio' },
          { model: Utente, as: 'utente' },
        ],
      });
      return tariffa;
    } catch (error) {
      throw new Error(
        `Errore durante il recupero della tariffa con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }

  // Metodo per ottenere tutte le tariffe
  public async getAllTariffe(): Promise<Tariffa[]> {
    try {
      const tariffe = await Tariffa.findAll({
        include: [
          { model: TipoVeicolo, as: 'tipoVeicolo' },
          { model: Parcheggio, as: 'parcheggio' },
          { model: Utente, as: 'utente' },
        ],
      });
      return tariffe;
    } catch (error) {
      throw new Error(
        `Errore durante il recupero di tutte le tariffe: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }

  // Metodo per aggiornare una tariffa
  public async updateTariffa(
    id: number,
    data: Partial<{
      id_tipo_veicolo: number;
      importo: number;
      fascia_oraria: 'DIURNA' | 'NOTTURNA';
      giorno_settimana: TariffaAttributes['giorno_settimana'];
      feriale_festivo: 'FERIALE' | 'FESTIVO';
      id_parcheggio: number;
      id_utente: number;
    }>
  ): Promise<[number, Tariffa[]]> {
    try {
      const result = await Tariffa.update(data, {
        where: { id },
        returning: true,
      });
      return result;
    } catch (error) {
      throw new Error(
        `Errore durante l'aggiornamento della tariffa con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }

  // Metodo per eliminare una tariffa
  public async deleteTariffa(id: number): Promise<number> {
    try {
      const result = await Tariffa.destroy({
        where: { id },
      });
      return result;
    } catch (error) {
      throw new Error(
        `Errore durante l'eliminazione della tariffa con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      );
    }
  }
}

export default new TariffaDao();
