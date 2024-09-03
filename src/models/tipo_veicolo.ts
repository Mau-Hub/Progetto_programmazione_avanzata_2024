import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../config/database';

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Tipo_Veicolo
interface TipoVeicoloAttributes {
  id: number;
  nome: string;
}

// Definizione dei campi opzionali per la creazione
interface TipoVeicoloCreationAttributes
  extends Optional<TipoVeicoloAttributes, 'id'> {}

// Definizione del modello Tipo_Veicolo
class TipoVeicolo
  extends Model<TipoVeicoloAttributes, TipoVeicoloCreationAttributes>
  implements TipoVeicoloAttributes
{
  public id!: number;

  public nome!: string;

  // I campi timestamp (createdAt, updatedAt) vengono aggiunti automaticamente da Sequelize
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
      unique: true, // Ogni tipo di veicolo deve avere un nome unico
    },
  },
  {
    tableName: 'Tipo_Veicolo',
    sequelize,
    timestamps: true,
  }
);

export default TipoVeicolo;
