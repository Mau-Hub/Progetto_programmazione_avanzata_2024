/**
 * Interfaccia DaoI.
 *
 * Questa interfaccia definisce un set di metodi standard per l'accesso ai dati,
 * includendo le operazioni CRUD comuni per un'entità generica.
 *
 * @template T Tipo dell'entità.
 * @template K Tipo della chiave primaria dell'entità.
 */
export interface DaoI<T, K> {
  create(item: T): Promise<T>;
  findById(id: K): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: K, item: T): Promise<boolean>;
  delete(id: K): Promise<boolean>;
}
