import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../db/database';

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Tipo_Veicolo
export interface TipoVeicoloAttributes {
  id: number;
  nome: string;
}

// Definizione dei campi opzionali per la creazione
export interface TipoVeicoloCreationAttributes
  extends Optional<TipoVeicoloAttributes, 'id'> {}

// Definizione del modello Tipo_Veicolo
class TipoVeicolo
  extends Model<TipoVeicoloAttributes, TipoVeicoloCreationAttributes>
  implements TipoVeicoloAttributes
{
  public id!: number;

  public nome!: string;
}

// Inizializzazione del model Tipo_Veicolo
TipoVeicolo.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'Tipo_Veicolo',
    sequelize,
    timestamps: true,
  }
);

export default TipoVeicolo;
