import { DataTypes, Model, Optional } from 'sequelize';
import Database from '../db/database';
import Veicolo from './veicolo'; // Importa il modello Veicolo per la relazione
import Varco from './varco'; // Importa il modello Varco per la relazione
import Tariffa from './tariffa'; // Importa il modello Tariffa per la relazione
import Posto from './posto'; // Importa il modello Posto per la relazione

const sequelize = Database.getInstance();

// Definizione degli attributi del model Transito
export interface TransitoAttributes {
  id: number;
  ingresso: Date;
  uscita: Date | null;
  id_veicolo: number;
  id_varco_ingresso: number;
  id_varco_uscita: number | null;
  id_tariffa: number;
  id_posto: number;
  importo: number | null;
}

// Definizione dei campi opzionali per la creazione
export interface TransitoCreationAttributes
  extends Optional<
    TransitoAttributes,
    'id' | 'uscita' | 'id_varco_uscita' | 'importo'
  > {}

// Definizione del model Transito
class Transito
  extends Model<TransitoAttributes, TransitoCreationAttributes>
  implements TransitoAttributes
{
  public id!: number;

  public ingresso!: Date;

  public uscita!: Date | null;

  public id_veicolo!: number;

  public id_varco_ingresso!: number;

  public id_varco_uscita!: number | null;

  public id_tariffa!: number;

  public id_posto!: number;

  public importo!: number | null;
}

// Inizializzazione del model Transito
Transito.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ingresso: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    uscita: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    id_veicolo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Veicolo,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_varco_ingresso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Varco,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_varco_uscita: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Varco,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_tariffa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tariffa,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_posto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Posto,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    importo: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: 'Transiti',
    sequelize,
    timestamps: true,
  }
);

// Definisci le relazioni tra Transito e gli altri modelli
Veicolo.hasMany(Transito, { foreignKey: 'id_veicolo', as: 'transiti' });
Transito.belongsTo(Veicolo, { foreignKey: 'id_veicolo', as: 'veicolo' });

Varco.hasMany(Transito, { foreignKey: 'id_varco_ingresso', as: 'transitiIn' });
Transito.belongsTo(Varco, {
  foreignKey: 'id_varco_ingresso',
  as: 'varcoIngresso',
});

Varco.hasMany(Transito, { foreignKey: 'id_varco_uscita', as: 'transitiOut' });
Transito.belongsTo(Varco, { foreignKey: 'id_varco_uscita', as: 'varcoUscita' });

Tariffa.hasMany(Transito, { foreignKey: 'id_tariffa', as: 'transiti' });
Transito.belongsTo(Tariffa, { foreignKey: 'id_tariffa', as: 'tariffa' });

Posto.hasMany(Transito, { foreignKey: 'id_posto', as: 'transiti' });
Transito.belongsTo(Posto, { foreignKey: 'id_posto', as: 'posto' });

export default Transito;
