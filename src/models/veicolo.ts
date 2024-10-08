import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../db/database';
import Utente from './utente';
import TipoVeicolo from './tipoVeicolo';

const sequelize = Database.getInstance();

// Esporta gli attributi del modello Veicolo
export interface VeicoloAttributes {
  id: number;
  targa: string;
  id_tipo_veicolo: number;
  id_utente: number;
  tipoVeicolo?: TipoVeicolo;
}

// Esporta i campi opzionali per la creazione
export interface VeicoloCreationAttributes
  extends Optional<VeicoloAttributes, 'id'> {}

// Definizione del modello Veicolo
class Veicolo
  extends Model<VeicoloAttributes, VeicoloCreationAttributes>
  implements VeicoloAttributes
{
  public id!: number;

  public targa!: string;

  public id_tipo_veicolo!: number;

  public id_utente!: number;

  public tipoVeicolo?: TipoVeicolo;
}

// Inizializzazione del model Veicolo
Veicolo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    targa: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    id_tipo_veicolo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TipoVeicolo,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_utente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Utente,
        key: 'id',
      },
      onDelete: 'CASCADE',
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
