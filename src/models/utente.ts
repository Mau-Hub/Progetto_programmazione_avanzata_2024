import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../db/database';

const sequelize = Database.getInstance();

// Definizione degli attributi del model Utente
interface UtenteAttributes {
  id: number;
  nome: string;
  ruolo: 'operatore' | 'automobilista' | 'varco';
  username: string;
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

  public username!: string;
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
      type: DataTypes.ENUM('operatore', 'automobilista', 'varco'), 
      allowNull: false,
    },
    username: {  
      type: DataTypes.STRING(100), 
      allowNull: false,
      unique: true, 
    },
  },
  {
    tableName: 'Utenti', 
    sequelize, 
    timestamps: true, 
  }
);

export default Utente;
