import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../config/database';
import ParkingLot from './parkingLot'; // Importa il modello ParkingLot per la relazione

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Invoice
interface InvoiceAttributes {
  id: number;
  vehicle_license_plate: string;
  parking_lot_id: number;
  total_amount: number;
  issued_at: Date;
}

// Definizione dei campi opzionali per la creazione
interface InvoiceCreationAttributes
  extends Optional<InvoiceAttributes, 'id' | 'issued_at'> {}

// Definizione del modello Invoice
class Invoice
  extends Model<InvoiceAttributes, InvoiceCreationAttributes>
  implements InvoiceAttributes
{
  public id!: number;

  public vehicle_license_plate!: string;

  public parking_lot_id!: number;

  public total_amount!: number;

  public issued_at!: Date;

  // Timestamp fields (createdAt, updatedAt) are added automatically by Sequelize
}

// Inizializzazione del modello Invoice
Invoice.init(
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
    parking_lot_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: ParkingLot,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    issued_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Imposta la data di emissione alla data corrente di default
    },
  },
  {
    tableName: 'Invoices',
    sequelize, // Usa l'istanza singleton di Sequelize
    timestamps: true, // Abilita i timestamp (createdAt, updatedAt)
  }
);

// Definisci la relazione tra Invoice e ParkingLot
ParkingLot.hasMany(Invoice, {
  foreignKey: 'parking_lot_id',
  as: 'invoices',
});
Invoice.belongsTo(ParkingLot, {
  foreignKey: 'parking_lot_id',
  as: 'parkingLot',
});

export default Invoice;
