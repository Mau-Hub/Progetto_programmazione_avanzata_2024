import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../config/database';

const sequelize = Database.getInstance();

// Definizione degli attributi del modello VehicleType
interface VehicleTypeAttributes {
  id: number;
  type_name: string;
}

// Definizione dei campi opzionali per la creazione
interface VehicleTypeCreationAttributes
  extends Optional<VehicleTypeAttributes, 'id'> {}

// Definizione del modello VehicleType
class VehicleType
  extends Model<VehicleTypeAttributes, VehicleTypeCreationAttributes>
  implements VehicleTypeAttributes
{
  public id!: number;

  public type_name!: string;

  // Timestamp fields (createdAt, updatedAt) are added automatically by Sequelize
}

// Inizializzazione del modello VehicleType
VehicleType.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    type_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true, // Ogni tipo di veicolo deve essere unico
    },
  },
  {
    tableName: 'VehicleTypes',
    sequelize, // Usa l'istanza singleton di Sequelize
    timestamps: true, // Abilita i timestamp (createdAt, updatedAt)
  }
);

export default VehicleType;
