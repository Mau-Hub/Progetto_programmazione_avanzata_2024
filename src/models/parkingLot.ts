import { DataTypes, Model } from 'sequelize';

import DatabaseConnection from '../config/database'; // Importa la configurazione del database

const sequelize = DatabaseConnection.getInstance(); // Ottieni l'istanza del database

class ParkingLot extends Model {
  public id!: number;

  public name!: string;

  public location!: string;

  public capacity!: number;
}

ParkingLot.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(100),
      allowNull: false,
    },
    location: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'ParkingLots',
    sequelize,
  }
);

export default ParkingLot;
