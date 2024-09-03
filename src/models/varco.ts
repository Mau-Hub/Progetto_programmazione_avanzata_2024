import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../config/database';
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

  // I campi timestamp (createdAt, updatedAt) vengono aggiunti automaticamente da Sequelize
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
      type: DataTypes.ENUM('INGRESSO', 'USCITA'), // Definisce il tipo come ENUM
      allowNull: false,
    },
    bidirezionale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Di default il varco non è bidirezionale
    },
    id_parcheggio: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Parcheggio, // Relazione con il modello Parcheggio
        key: 'id',
      },
      onDelete: 'CASCADE', // Cancella i varchi associati se il parcheggio viene eliminato
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'Varco',
    sequelize, // Usa l'istanza singleton di Sequelize
    timestamps: true, // Abilita i campi timestamp (createdAt, updatedAt)
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
