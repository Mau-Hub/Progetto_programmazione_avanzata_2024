import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../db/database';
import TipoVeicolo from './tipoVeicolo';
import Parcheggio from './parcheggio';
import Utente from './utente';

const sequelize = Database.getInstance();

// Definizione degli attributi del modello Tariffa
export interface TariffaAttributes {
  id: number;
  id_tipo_veicolo: number;
  importo: number;
  fascia_oraria: 'DIURNA' | 'NOTTURNA';
  giorno_settimana:
    | 'LUNEDI'
    | 'MARTEDI'
    | 'MERCOLEDI'
    | 'GIOVEDI'
    | 'VENERDI'
    | 'SABATO'
    | 'DOMENICA'
    | 'FERIALE'
    | 'FESTIVO';
  id_parcheggio: number;
  id_utente: number;
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

  public giorno_settimana!:
    | 'LUNEDI'
    | 'MARTEDI'
    | 'MERCOLEDI'
    | 'GIOVEDI'
    | 'VENERDI'
    | 'SABATO'
    | 'DOMENICA'
    | 'FERIALE'
    | 'FESTIVO';

  public id_parcheggio!: number;

  public id_utente!: number;
}

// Inizializzazione del model Tariffa
Tariffa.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    id_tipo_veicolo: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    giorno_settimana: {
      type: DataTypes.ENUM(
        'LUNEDI',
        'MARTEDI',
        'MERCOLEDI',
        'GIOVEDI',
        'VENERDI',
        'SABATO',
        'DOMENICA',
        'FERIALE',
        'FESTIVO'
      ),
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
    id_utente: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    tableName: 'Tariffe',
    sequelize,
    timestamps: true,
  }
);

// Definisci le relazioni tra Tariffa, TipoVeicolo, Parcheggio, e Utente
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

Utente.hasMany(Tariffa, { foreignKey: 'id_utente', as: 'tariffe_gestite' });
Tariffa.belongsTo(Utente, { foreignKey: 'id_utente', as: 'utente' });

export default Tariffa;
