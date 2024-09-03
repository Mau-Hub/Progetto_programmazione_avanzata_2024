import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../config/database';
import VehicleType from './vehicleType'; // Importa il modello VehicleType per la relazione
import ParkingLot from './parkingLot'; // Importa il modello ParkingLot per la relazione

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Rate
interface RateAttributes {
  id: number;
  parking_lot_id: number;
  vehicle_type_id: number;
  rate: number;
  day_of_week:
    | 'LUNEDI'
    | 'MARTEDI'
    | 'MERCOLEDI'
    | 'GIOVEDI'
    | 'VENERDI'
    | 'SABATO'
    | 'DOMENICA'
    | 'FESTIVO';
  start_time: string; // Assume formato 'HH:MM'
  end_time: string; // Assume formato 'HH:MM'
}

// Definizione dei campi opzionali per la creazione
interface RateCreationAttributes extends Optional<RateAttributes, 'id'> {}

// Definizione del modello Rate
class Rate
  extends Model<RateAttributes, RateCreationAttributes>
  implements RateAttributes
{
  public id!: number;

  public parking_lot_id!: number;

  public vehicle_type_id!: number;

  public rate!: number;

  public day_of_week!:
    | 'LUNEDI'
    | 'MARTEDI'
    | 'MERCOLEDI'
    | 'GIOVEDI'
    | 'VENERDI'
    | 'SABATO'
    | 'DOMENICA'
    | 'FESTIVO';

  public start_time!: string;

  public end_time!: string;

  // Timestamp fields (createdAt, updatedAt) are added automatically by Sequelize
}

// Inizializzazione del modello Rate
Rate.init(
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
        model: ParkingLot,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    day_of_week: {
      type: DataTypes.ENUM(
        'LUNEDI',
        'MARTEDI',
        'MERCOLEDI',
        'GIOVEDI',
        'VENERDI',
        'SABATO',
        'DOMENICA',
        'FESTIVO'
      ),
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    tableName: 'Rates',
    sequelize, // Usa l'istanza singleton di Sequelize
    timestamps: true, // Abilita i timestamp (createdAt, updatedAt)
  }
);

// Definisci le relazioni tra Rate, VehicleType e ParkingLot
ParkingLot.hasMany(Rate, {
  foreignKey: 'parking_lot_id',
  as: 'rates',
});
Rate.belongsTo(ParkingLot, {
  foreignKey: 'parking_lot_id',
  as: 'parkingLot',
});

VehicleType.hasMany(Rate, {
  foreignKey: 'vehicle_type_id',
  as: 'rates',
});
Rate.belongsTo(VehicleType, {
  foreignKey: 'vehicle_type_id',
  as: 'vehicleType',
});

export default Rate;
