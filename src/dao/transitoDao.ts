import Transito from '../models/transito';
import Veicolo from '../models/veicolo';
import Varco from '../models/varco';
import Tariffa from '../models/tariffa';
import Posto from '../models/posto';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { DaoI } from './DaoI';
import {
  TransitoAttributes,
  TransitoCreationAttributes,
} from '../models/transito';

class TransitoDao implements DaoI<TransitoAttributes, number> {
  public async findAll(options?: any): Promise<Transito[]> {
    try {
      return await Transito.findAll({
        ...options,
        include: [
          { model: Veicolo, as: 'veicolo' },
          { model: Varco, as: 'varcoIngresso' },
          { model: Varco, as: 'varcoUscita' },
          { model: Tariffa, as: 'tariffa' },
          { model: Posto, as: 'posto' },
        ],
      });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei transiti'
      );
    }
  }

  public async findById(id: number): Promise<Transito | null> {
    try {
      const transito = await Transito.findByPk(id, {
        include: [
          { model: Veicolo, as: 'veicolo' },
          { model: Varco, as: 'varcoIngresso' },
          { model: Varco, as: 'varcoUscita' },
          { model: Tariffa, as: 'tariffa' },
          { model: Posto, as: 'posto' },
        ],
      });
      if (!transito) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il transito con id ${id} è inesistente`
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

  public async create(item: TransitoCreationAttributes): Promise<Transito> {
    try {
      return await Transito.create(item);
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nella creazione del transito'
      );
    }
  }

  public async update(
    id: number,
    item: Partial<TransitoAttributes>
  ): Promise<boolean> {
    try {
      const [affectedCount] = await Transito.update(item, {
        where: { id },
        returning: true,
      });

      if (affectedCount === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il transito con id ${id} non è stato trovato`
        );
      }

      return affectedCount > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore nell'aggiornamento del transito con id ${id}`
      );
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const result = await Transito.destroy({ where: { id } });

      if (result === 0) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          `Il transito con id ${id} non è stato trovato`
        );
      }

      return result > 0;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        `Errore nella cancellazione del transito con id ${id}`
      );
    }
  }
}

export default new TransitoDao();
