import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../db/database';

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Parcheggio
export interface ParcheggioAttributes {
  id: number;
  nome: string;
  capacita: number;
}

// Definizione dei campi opzionali per la creazione
export interface ParcheggioCreationAttributes
  extends Optional<ParcheggioAttributes, 'id'> {}

// Definizione del modello Parcheggio
export class Parcheggio
  extends Model<ParcheggioAttributes, ParcheggioCreationAttributes>
  implements ParcheggioAttributes
{
  public id!: number;

  public nome!: string;

  public capacita!: number;
}

// Inizializzazione del model Parcheggio
Parcheggio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    capacita: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'Parcheggio',
    sequelize,
    timestamps: true,
  }
);

// Esporta il modello e le interfacce
export default Parcheggio;
