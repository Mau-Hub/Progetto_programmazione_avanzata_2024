import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../db/database';

const sequelize = Database.getInstance();

// Definizione degli attributi del model Utente
interface UtenteAttributes {
  id: number;
  nome: string;
  ruolo: 'operatore' | 'automobilista' | 'varco';
  jwt_token: string;
}

// Definizione dei campi opzionali per la creazione
interface UtenteCreationAttributes extends Optional<UtenteAttributes, 'id'> {}

// Definizione del modello Utente
class Utente
  extends Model<UtenteAttributes, UtenteCreationAttributes>
  implements UtenteAttributes
{
  public id!: number;

  public nome!: string;

  public ruolo!: 'operatore' | 'automobilista' | 'varco';

  public jwt_token!: string;

  // I campi timestamp (createdAt, updatedAt) vengono aggiunti automaticamente da Sequelize
}

// Inizializzazione del model Utente
Utente.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ruolo: {
      type: DataTypes.ENUM('operatore', 'automobilista', 'varco'), // Definizione dei ruoli possibili
      allowNull: false,
    },
    jwt_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'Utenti', // Nome della tabella nel database
    sequelize, // Usa l'istanza singleton di Sequelize
    timestamps: true, // Abilita i campi timestamp (createdAt, updatedAt)
  }
);

export default Utente;
