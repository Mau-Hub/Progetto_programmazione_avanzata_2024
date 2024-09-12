"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../db/database"));
const veicolo_1 = __importDefault(require("./veicolo")); // Importa il modello Veicolo per la relazione
const varco_1 = __importDefault(require("./varco")); // Importa il modello Varco per la relazione
const tariffa_1 = __importDefault(require("./tariffa")); // Importa il modello Tariffa per la relazione
const posto_1 = __importDefault(require("./posto")); // Importa il modello Posto per la relazione
const sequelize = database_1.default.getInstance();
// Definizione del model Transito
class Transito extends sequelize_1.Model {
}
// Inizializzazione del model Transito
Transito.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ingresso: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        allowNull: false,
    },
    uscita: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    id_veicolo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: veicolo_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    id_varco_ingresso: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: varco_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    id_varco_uscita: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: varco_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    id_tariffa: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: tariffa_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    id_posto: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: posto_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    importo: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    tableName: 'Transiti',
    sequelize,
    timestamps: true,
});
// Definisci le relazioni tra Transito e gli altri modelli
veicolo_1.default.hasMany(Transito, { foreignKey: 'id_veicolo', as: 'transiti' });
Transito.belongsTo(veicolo_1.default, { foreignKey: 'id_veicolo', as: 'veicolo' });
varco_1.default.hasMany(Transito, { foreignKey: 'id_varco_ingresso', as: 'transitiIn' });
Transito.belongsTo(varco_1.default, {
    foreignKey: 'id_varco_ingresso',
    as: 'varcoIngresso',
});
varco_1.default.hasMany(Transito, { foreignKey: 'id_varco_uscita', as: 'transitiOut' });
Transito.belongsTo(varco_1.default, { foreignKey: 'id_varco_uscita', as: 'varcoUscita' });
tariffa_1.default.hasMany(Transito, { foreignKey: 'id_tariffa', as: 'transiti' });
Transito.belongsTo(tariffa_1.default, { foreignKey: 'id_tariffa', as: 'tariffa' });
posto_1.default.hasMany(Transito, { foreignKey: 'id_posto', as: 'transiti' });
Transito.belongsTo(posto_1.default, { foreignKey: 'id_posto', as: 'posto' });
exports.default = Transito;
