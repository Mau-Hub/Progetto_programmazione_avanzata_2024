import TariffaDao from '../dao/tariffaDao';
import Tariffa, {
  TariffaAttributes,
  TariffaCreationAttributes,
} from '../models/tariffa';

class TariffaRepository {
  /**
   * Crea una nuova tariffa.
   *
   * @param {TariffaCreationAttributes} tariffaData - Dati della nuova tariffa da creare.
   * @returns {Promise<Tariffa>} - Promise che restituisce la tariffa creata.
   */
  async create(tariffaData: TariffaCreationAttributes): Promise<Tariffa> {
    return await TariffaDao.create(tariffaData);
  }

  /**
   * Recupera tutte le tariffe.
   *
   * @returns {Promise<Tariffa[]>} - Promise che restituisce un array di tutte le tariffe.
   */
  async findAll(): Promise<Tariffa[]> {
    return await TariffaDao.findAll();
  }

  /**
   * Recupera una tariffa specifica per ID.
   *
   * @param {number} id - ID della tariffa da recuperare.
   * @returns {Promise<Tariffa | null>} - Promise che restituisce la tariffa trovata o null se non trovata.
   */
  async findById(id: number): Promise<Tariffa | null> {
    return await TariffaDao.findById(id);
  }

  /**
   * Aggiorna una tariffa esistente.
   *
   * @param {number} id - ID della tariffa da aggiornare.
   * @param {Partial<TariffaAttributes>} tariffaData - Dati da aggiornare nella tariffa.
   * @returns {Promise<boolean>} - Promise che restituisce true se l'aggiornamento è riuscito, false altrimenti.
   */
  async update(
    id: number,
    tariffaData: Partial<TariffaAttributes>
  ): Promise<boolean> {
    return await TariffaDao.update(id, tariffaData);
  }

  /**
   * Elimina una tariffa specifica per ID.
   *
   * @param {number} id - ID della tariffa da eliminare.
   * @returns {Promise<boolean>} - Promise che restituisce true se l'eliminazione è riuscita, false altrimenti.
   */
  async delete(id: number): Promise<boolean> {
    return await TariffaDao.delete(id);
  }
}

export default new TariffaRepository();
