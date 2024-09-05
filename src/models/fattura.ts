import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../db/database';
import Utente from './utente'; // Importa il modello Utente per la relazione
import Transito from './transito'; // Importa il modello Transito per la relazione

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Fattura
export interface FatturaAttributes {
  id: number;
  data: Date;
  importo_totale: number;
  id_utente: number; // Può essere un operatore o un automobilista
  id_transito: number;
}

// Definizione dei campi opzionali per la creazione
export interface FatturaCreationAttributes
  extends Optional<FatturaAttributes, 'id'> {}

// Definizione del model Fattura
export class Fattura
  extends Model<FatturaAttributes, FatturaCreationAttributes>
  implements FatturaAttributes
{
  public id!: number;

  public data!: Date;

  public importo_totale!: number;

  public id_utente!: number;

  public id_transito!: number;

  // I campi timestamp (createdAt, updatedAt) vengono aggiunti automaticamente da Sequelize
}

// Inizializzazione del model Fattura
Fattura.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    importo_totale: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    id_utente: {
      // Utilizziamo id_utente invece di id_operatore e id_automobilista
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Utente,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_transito: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Transito,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'Fatture',
    sequelize,
    timestamps: true,
  }
);

// Definisci le relazioni tra Fattura, Utente e Transito
Utente.hasMany(Fattura, { foreignKey: 'id_utente', as: 'fatture' });
Fattura.belongsTo(Utente, { foreignKey: 'id_utente', as: 'utente' });

Transito.hasOne(Fattura, { foreignKey: 'id_transito', as: 'fattura' });
Fattura.belongsTo(Transito, { foreignKey: 'id_transito', as: 'transito' });

export default Fattura;
