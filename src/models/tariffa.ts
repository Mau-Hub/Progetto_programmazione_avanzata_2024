import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../db/database';
import TipoVeicolo from './tipoVeicolo';
import Parcheggio from './parcheggio';

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Tariffa
export interface TariffaAttributes {
  id: number;
  id_tipo_veicolo: number;
  importo: number;
  fascia_oraria: 'DIURNA' | 'NOTTURNA';
  feriale_festivo: 'FERIALE' | 'FESTIVO';
  id_parcheggio: number;
}

// Definizione dei campi opzionali per la creazione
export interface TariffaCreationAttributes
  extends Optional<TariffaAttributes, 'id'> {}

// Definizione del modello Tariffa
class Tariffa
  extends Model<TariffaAttributes, TariffaCreationAttributes>
  implements TariffaAttributes
{
  public id!: number;
  public id_tipo_veicolo!: number;
  public importo!: number;
  public fascia_oraria!: 'DIURNA' | 'NOTTURNA';
  public feriale_festivo!: 'FERIALE' | 'FESTIVO';
  public id_parcheggio!: number;
}

// Inizializzazione del model Tariffa
Tariffa.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    importo: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fascia_oraria: {
      type: DataTypes.ENUM('DIURNA', 'NOTTURNA'),
      allowNull: false,
    },
    feriale_festivo: {
      type: DataTypes.ENUM('FERIALE', 'FESTIVO'),
      allowNull: false,
    },
    id_parcheggio: {
      type: DataTypes.INTEGER,
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
    tableName: 'Tariffe',
    sequelize,
    timestamps: true,
  }
);

// Definisci le relazioni tra Tariffa, TipoVeicolo, e Parcheggio
TipoVeicolo.hasMany(Tariffa, { foreignKey: 'id_tipo_veicolo', as: 'tariffe' });
Tariffa.belongsTo(TipoVeicolo, {
  foreignKey: 'id_tipo_veicolo',
  as: 'tipoVeicolo',
});

Parcheggio.hasMany(Tariffa, { foreignKey: 'id_parcheggio', as: 'tariffe' });
Tariffa.belongsTo(Parcheggio, {
  foreignKey: 'id_parcheggio',
  as: 'parcheggio',
});

export default Tariffa;
