import { Fattura } from '../models/fattura';

export interface parcheggioDao<Parcheggio, ParcheggioAttributes.id> {
  create(item: Parcheggio): Promise<Parcheggio>;
    findById(id: ParcheggioAttributes.id): Promise<Parcheggio | null>;
    findAll(): Promise<Parcheggio[]>;
    update(id: ParcheggioAttributes.id, item: Parcheggio): Promise<boolean>;
    delete(id: ParcheggioAttributes.id): Promise<boolean>;
  }