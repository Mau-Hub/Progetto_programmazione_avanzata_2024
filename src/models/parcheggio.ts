import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../config/database';

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Parcheggio
interface ParcheggioAttributes {
  id: number;
  nome: string;
  capacita: number;
}

// Definizione dei campi opzionali per la creazione
interface ParcheggioCreationAttributes
  extends Optional<ParcheggioAttributes, 'id'> {}

// Definizione del modello Parcheggio
class Parcheggio
  extends Model<ParcheggioAttributes, ParcheggioCreationAttributes>
  implements ParcheggioAttributes
{
  public id!: number;

  public nome!: string;

  public capacita!: number;

  // I campi timestamp (createdAt, updatedAt) vengono aggiunti automaticamente da Sequelize
}

// Inizializzazione del model Parcheggio
Parcheggio.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    capacita: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'Parcheggio',
    sequelize, // Usa l'istanza singleton di Sequelize
    timestamps: true, // Abilita i campi timestamp (createdAt, updatedAt)
  }
);

export default Parcheggio;
