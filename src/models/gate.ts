import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../config/database';
import ParkingLot from './parkingLot'; // Importa il modello ParkingLot per la relazione

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Gate
interface GateAttributes {
  id: number;
  parking_lot_id: number;
  gate_type: 'INGRESSO' | 'USCITA';
  is_bidirectional: boolean;
}

// Definizione dei campi opzionali per la creazione
interface GateCreationAttributes extends Optional<GateAttributes, 'id'> {}

// Definizione del modello Gate
class Gate
  extends Model<GateAttributes, GateCreationAttributes>
  implements GateAttributes
{
  public id!: number;

  public parking_lot_id!: number;

  public gate_type!: 'INGRESSO' | 'USCITA';

  public is_bidirectional!: boolean;

  // Timestamp (createdAt, updatedAt) vengono aggiunti automaticamente da Sequelize
}

// Inizializzazione del modello Gate
Gate.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    parking_lot_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: ParkingLot, // Specifica la relazione con il modello ParkingLot
        key: 'id',
      },
      onDelete: 'CASCADE', // Cancella i varchi associati se il parcheggio viene eliminato
      onUpdate: 'CASCADE',
    },
    gate_type: {
      type: DataTypes.ENUM('INGRESSO', 'USCITA'), // Utilizza ENUM per il tipo di varco
      allowNull: false,
    },
    is_bidirectional: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Il gate è unidirezionale per default
    },
  },
  {
    tableName: 'Gates',
    sequelize, // Usa l'istanza singleton di Sequelize
    timestamps: true, // Abilita i timestamp (createdAt, updatedAt)
  }
);

// Definisci la relazione tra Gate e ParkingLot
ParkingLot.hasMany(Gate, {
  foreignKey: 'parking_lot_id',
  as: 'gates',
});
Gate.belongsTo(ParkingLot, {
  foreignKey: 'parking_lot_id',
  as: 'parkingLot',
});

export default Gate;
