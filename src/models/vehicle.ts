import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../config/database';
import Utente from './utente'; // Importa il modello Utente per la relazione
import TipoVeicolo from './tipoVeicolo'; // Importa il modello Tipo_Veicolo per la relazione

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Veicolo
interface VeicoloAttributes {
  id: number;
  targa: string;
  id_tipo_veicolo: number; // Chiave esterna che fa riferimento a Tipo_Veicolo
  id_utente: number; // Chiave esterna che fa riferimento a Utente
}

// Definizione dei campi opzionali per la creazione
interface VeicoloCreationAttributes extends Optional<VeicoloAttributes, 'id'> {}

// Definizione del modello Veicolo
class Veicolo
  extends Model<VeicoloAttributes, VeicoloCreationAttributes>
  implements VeicoloAttributes
{
  public id!: number;

  public targa!: string;

  public id_tipo_veicolo!: number;

  public id_utente!: number;

  // I campi timestamp (createdAt, updatedAt) vengono aggiunti automaticamente da Sequelize
}

// Inizializzazione del model Veicolo
Veicolo.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    targa: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, // La targa deve essere unica
    },
    id_tipo_veicolo: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: TipoVeicolo,
        key: 'id',
      },
      onDelete: 'CASCADE', // Cancella i veicoli associati se il tipo di veicolo viene eliminato
      onUpdate: 'CASCADE',
    },
    id_utente: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Utente,
        key: 'id',
      },
      onDelete: 'CASCADE', // Cancella i veicoli associati se l'utente viene eliminato
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'Veicoli',
    sequelize,
    timestamps: true,
  }
);

// Definizione delle relazioni tra Veicolo, Utente e Tipo_Veicolo
Utente.hasMany(Veicolo, { foreignKey: 'id_utente', as: 'veicoli' });
Veicolo.belongsTo(Utente, { foreignKey: 'id_utente', as: 'utente' });

TipoVeicolo.hasMany(Veicolo, { foreignKey: 'id_tipo_veicolo', as: 'veicoli' });
Veicolo.belongsTo(TipoVeicolo, {
  foreignKey: 'id_tipo_veicolo',
  as: 'tipoVeicolo',
});

export default Veicolo;
