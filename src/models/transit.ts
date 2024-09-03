import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../config/database';
import Gate from './gate'; // Importa il modello Gate per la relazione
import VehicleType from './vehicleType'; // Importa il modello VehicleType per la relazione
import Invoice from './invoice'; // Importa il modello Invoice se previsto nel progetto

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Transit
interface TransitAttributes {
  id: number;
  vehicle_license_plate: string;
  vehicle_type_id: number;
  gate_id: number;
  transit_time: Date;
  direction: 'INGRESSO' | 'USCITA';
  invoice_id?: number; // Opzionale se associato a una fattura
}

// Definizione dei campi opzionali per la creazione
interface TransitCreationAttributes
  extends Optional<TransitAttributes, 'id' | 'invoice_id'> {}

// Definizione del modello Transit
class Transit
  extends Model<TransitAttributes, TransitCreationAttributes>
  implements TransitAttributes
{
  public id!: number;

  public vehicle_license_plate!: string;

  public vehicle_type_id!: number;

  public gate_id!: number;

  public transit_time!: Date;

  public direction!: 'INGRESSO' | 'USCITA';

  public invoice_id?: number;

  // Timestamp fields (createdAt, updatedAt) are added automatically by Sequelize
}

// Inizializzazione del modello Transit
Transit.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    vehicle_license_plate: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    vehicle_type_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: VehicleType,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    gate_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Gate,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    transit_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM('INGRESSO', 'USCITA'),
      allowNull: false,
    },
    invoice_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Invoice, // Se c'è una relazione con il modello Invoice
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'Transits',
    sequelize, // Usa l'istanza singleton di Sequelize
    timestamps: true, // Abilita i timestamp (createdAt, updatedAt)
  }
);

// Definisci le relazioni tra Transit, VehicleType, Gate, e Invoice (se applicabile)
VehicleType.hasMany(Transit, {
  foreignKey: 'vehicle_type_id',
  as: 'transits',
});
Transit.belongsTo(VehicleType, {
  foreignKey: 'vehicle_type_id',
  as: 'vehicleType',
});

Gate.hasMany(Transit, {
  foreignKey: 'gate_id',
  as: 'transits',
});
Transit.belongsTo(Gate, {
  foreignKey: 'gate_id',
  as: 'gate',
});

// Se esiste una relazione con Invoice
Invoice.hasMany(Transit, {
  foreignKey: 'invoice_id',
  as: 'transits',
});
Transit.belongsTo(Invoice, {
  foreignKey: 'invoice_id',
  as: 'invoice',
});

export default Transit;
