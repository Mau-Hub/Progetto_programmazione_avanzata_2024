import { Model, DataTypes, Optional } from 'sequelize';
import Database from '../db/database';
import Parcheggio from './parcheggio';

const sequelize = Database.getInstance();

// Interfaccia per gli attributi di Posto
interface PostoAttributes {
  id: number;
  numero: string;
  stato: 'libero' | 'occupato';
  id_parcheggio: number;
}

// Interfaccia per la creazione di Posto, con 'id' opzionale
interface PostoCreationAttributes extends Optional<PostoAttributes, 'id'> {}

// Classe Posto che estende Model
class Posto
  extends Model<PostoAttributes, PostoCreationAttributes>
  implements PostoAttributes
{
  public id!: number;

  public numero!: string;

  public stato!: 'libero' | 'occupato';

  public id_parcheggio!: number;
}

// Inizializzazione del model Posto
Posto.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stato: {
      type: DataTypes.ENUM('libero', 'occupato'),
      allowNull: false,
    },
    id_parcheggio: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Parcheggio,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'Posti',
    timestamps: true,
  }
);

export default Posto;
