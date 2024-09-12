import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import Tariffa, { TariffaAttributes, TariffaCreationAttributes } from '../models/tariffa';
import TipoVeicolo from '../models/tipoVeicolo';
import Parcheggio from '../models/parcheggio';
import { DaoI } from './DaoI';

// Creazione tariffa
class TariffaDao implements DaoI<TariffaAttributes, number> {

  public async create(item: TariffaCreationAttributes): Promise<Tariffa> {
    try {
      const tariffa = await Tariffa.create(item);
      return tariffa;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante la creazione della tariffa: ${
          error instanceof Error ? error.message : 'Errore sconosciuto'
        }`
      );
    }
  }

  // Trovare una tariffa per ID
  public async findById(id: number): Promise<Tariffa | null> {
    try {
      const tariffa = await Tariffa.findByPk(id, {
        include: [
          { model: TipoVeicolo, as: 'tipoVeicolo' },
          { model: Parcheggio, as: 'parcheggio' },
        ],
      });

      if (!tariffa) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `La tariffa con ID ${id} non è stata trovata`
        );
      }

      return tariffa;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante il recupero della tariffa con ID ${id}: ${
          error instanceof Error ? error.message : 'Errore sconosciuto'
        }`
      );
    }
  }

  // Ottenere tutte le tariffe
  public async findAll(): Promise<Tariffa[]> {
    try {
      const tariffe = await Tariffa.findAll({
        include: [
          { model: TipoVeicolo, as: 'tipoVeicolo' },
          { model: Parcheggio, as: 'parcheggio' },
        ],
      });
      return tariffe;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante il recupero di tutte le tariffe: ${
          error instanceof Error ? error.message : 'Errore sconosciuto'
        }`
      );
    }
  }

  // Aggiornare una tariffa
  public async update(id: number, item: Partial<TariffaAttributes>): Promise<boolean> {
    try {
      const result = await Tariffa.update(item, {
        where: { id },
      });

      if (result[0] === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `La tariffa con ID ${id} non esiste`
        );
      }

      return result[0] > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante l'aggiornamento della tariffa con ID ${id}: ${
          error instanceof Error ? error.message : 'Errore sconosciuto'
        }`
      );
    }
  }

  // Eliminare una tariffa
  public async delete(id: number): Promise<boolean> {
    try {
      const result = await Tariffa.destroy({
        where: { id },
      });

      if (result === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `La tariffa con ID ${id} non è stata trovata`
        );
      }

      return result > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore durante l'eliminazione della tariffa con ID ${id}: ${
          error instanceof Error ? error.message : 'Errore sconosciuto'
        }`
      );
    }
  }
}

export default new TariffaDao();
