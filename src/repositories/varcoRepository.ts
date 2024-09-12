import VarcoDao from '../dao/varcoDao';
import { VarcoAttributes, VarcoCreationAttributes } from '../models/varco';
import Varco from '../models/varco';

class VarcoRepository {
  /**
   * Creazione di un nuovo varco
   *
   * @param {VarcoCreationAttributes} varcoData
   * @returns {Promise<Varco>}
   */
  async create(varcoData: VarcoCreationAttributes): Promise<Varco> {
    // Chiama il metodo del DAO per creare un nuovo varco
    return VarcoDao.create(varcoData);
  }

  /**
   * Ottenere tutti i varchi
   *
   * @returns {Promise<Varco[]>}
   */
  async findAll(): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi
    return VarcoDao.findAll();
  }

  /**
   * Ottenere un varco specifico per ID
   *
   * @param {number} id
   * @returns {Promise<Varco | null>}
   */
  async findById(id: number): Promise<Varco | null> {
    // Chiama il metodo del DAO per ottenere il varco con un ID specifico
    return VarcoDao.findById(id);
  }

  /**
   * Aggiornare un varco
   *
   * @param {number} id
   * @param {Partial<VarcoAttributes>} varcoData
   * @returns {Promise<boolean>}
   */
  async update(id: number, varcoData: Partial<VarcoAttributes>): Promise<boolean> {
    // Chiama il metodo del DAO per aggiornare un varco
    return VarcoDao.update(id, varcoData);
  }

  /**
   * Eliminare un varco
   *
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id: number): Promise<boolean> {
    // Chiama il metodo del DAO per eliminare un varco
    return VarcoDao.delete(id);
  }

  /**
   * Ottenere tutti i varchi di un parcheggio specifico
   *
   * @param {number} idParcheggio
   * @returns {Promise<Varco[]>}
   */
  async findByParcheggio(idParcheggio: number): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi di un parcheggio specifico
    return VarcoDao.findByParcheggio(idParcheggio);
  }

  /**
   * Ottenere tutti i varchi bidirezionali
   *
   * @returns {Promise<Varco[]>}
   */
  async findBidirezionali(): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi bidirezionali
    return VarcoDao.findBidirezionali();
  }

  /**
   * Ottenere tutti i varchi di un tipo specifico
   *
   * @param {('INGRESSO' | 'USCITA')} tipo
   * @returns {Promise<Varco[]>}
   */
  async findByTipo(tipo: 'INGRESSO' | 'USCITA'): Promise<Varco[]> {
    // Chiama il metodo del DAO per ottenere tutti i varchi di un tipo specifico
    return VarcoDao.findByTipo(tipo);
  }
}

export default new VarcoRepository();
