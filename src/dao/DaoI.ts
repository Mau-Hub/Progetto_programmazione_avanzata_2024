export interface DaoI<T, K> {
  create(item: T): Promise<T>;
  findById(id: K): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: K, item: T): Promise<boolean>;
  delete(id: K): Promise<boolean>;
}
