import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../db/database';
import Parcheggio from './parcheggio'; // Importa il modello Parcheggio per la relazione

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Varco
interface VarcoAttributes {
  id: number;
  tipo: 'INGRESSO' | 'USCITA';
  bidirezionale: boolean;
  id_parcheggio: number;
}

// Definizione dei campi opzionali per la creazione
interface VarcoCreationAttributes extends Optional<VarcoAttributes, 'id'> {}

// Definizione del modello Varco
class Varco
  extends Model<VarcoAttributes, VarcoCreationAttributes>
  implements VarcoAttributes
{
  public id!: number;

  public tipo!: 'INGRESSO' | 'USCITA';

  public bidirezionale!: boolean;

  public id_parcheggio!: number;
}

// Inizializzazione del model Varco
Varco.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo: {
      type: DataTypes.ENUM('INGRESSO', 'USCITA'),
      allowNull: false,
    },
    bidirezionale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'Varco',
    sequelize,
    timestamps: true,
  }
);

// Definisci la relazione tra Varco e Parcheggio
Parcheggio.hasMany(Varco, {
  foreignKey: 'id_parcheggio',
  as: 'varchi',
});
Varco.belongsTo(Parcheggio, {
  foreignKey: 'id_parcheggio',
  as: 'parcheggio',
});

export default Varco;
