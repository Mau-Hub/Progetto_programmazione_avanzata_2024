import Transito from '../models/transito';
import Veicolo from '../models/veicolo';
import Varco from '../models/varco';
import Tariffa from '../models/tariffa';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { DaoI } from './DaoI';
import {
  TransitoAttributes,
  TransitoCreationAttributes,
} from '../models/transito';
import { Transaction } from 'sequelize';
import { IncludeOptions } from 'sequelize';

class TransitoDao implements DaoI<Transito, number> {
  public async findAll(options?: any): Promise<Transito[]> {
    try {
      return await Transito.findAll({
        ...options,
        include: [
          { model: Veicolo, as: 'veicolo' },
          { model: Varco, as: 'varcoIngresso' },
          { model: Varco, as: 'varcoUscita' },
          { model: Tariffa, as: 'tariffa' },
        ],
      });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei transiti'
      );
    }
  }

  public async findById(
    id: number,
    options?: { include?: IncludeOptions[] }
  ): Promise<Transito | null> {
    try {
      const transito = await Transito.findByPk(id, {
        ...options,
        include: [
          { model: Veicolo, as: 'veicolo' },
          { model: Varco, as: 'varcoIngresso' },
          { model: Varco, as: 'varcoUscita' },
          { model: Tariffa, as: 'tariffa' },
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

  public async create(
    item: TransitoCreationAttributes,
    transaction?: Transaction
  ): Promise<Transito> {
    try {
      return await Transito.create(item, { transaction });
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nella creazione del transito'
      );
    }
  }

  public async update(
    id: number,
    item: Partial<TransitoAttributes>,
    transaction?: Transaction
  ): Promise<boolean> {
    try {
      const [affectedCount] = await Transito.update(item, {
        where: { id },
        returning: true,
        transaction,
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
  public async findOne(options?: {
    where?: any;
    include?: IncludeOptions[];
  }): Promise<Transito | null> {
    try {
      const transito = await Transito.findOne({
        ...options,
        include: [
          { model: Veicolo, as: 'veicolo' },
          { model: Varco, as: 'varcoIngresso' },
          { model: Varco, as: 'varcoUscita' },
          { model: Tariffa, as: 'tariffa' },
        ],
      });

      if (!transito) {
        return null; // Nessun errore se non trovato, ritorna semplicemente null
      }

      return transito;
    } catch (error) {
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore durante la ricerca del transito'
      );
    }
  }
}

export default new TransitoDao();
