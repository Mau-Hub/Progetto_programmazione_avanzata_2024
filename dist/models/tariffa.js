"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../db/database"));
const tipoVeicolo_1 = __importDefault(require("./tipoVeicolo"));
const parcheggio_1 = __importDefault(require("./parcheggio"));
const sequelize = database_1.default.getInstance();
// Definizione del modello Tariffa
class Tariffa extends sequelize_1.Model {
}
// Inizializzazione del model Tariffa
Tariffa.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_tipo_veicolo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: tipoVeicolo_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    importo: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    fascia_oraria: {
        type: sequelize_1.DataTypes.ENUM('DIURNA', 'NOTTURNA'),
        allowNull: false,
    },
    feriale_festivo: {
        type: sequelize_1.DataTypes.ENUM('FERIALE', 'FESTIVO'),
        allowNull: false,
    },
    id_parcheggio: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: parcheggio_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    tableName: 'Tariffe',
    sequelize,
    timestamps: true,
});
// Definisci le relazioni tra Tariffa, TipoVeicolo, e Parcheggio
tipoVeicolo_1.default.hasMany(Tariffa, { foreignKey: 'id_tipo_veicolo', as: 'tariffe' });
Tariffa.belongsTo(tipoVeicolo_1.default, {
    foreignKey: 'id_tipo_veicolo',
    as: 'tipoVeicolo',
});
parcheggio_1.default.hasMany(Tariffa, { foreignKey: 'id_parcheggio', as: 'tariffe' });
Tariffa.belongsTo(parcheggio_1.default, {
    foreignKey: 'id_parcheggio',
    as: 'parcheggio',
});
exports.default = Tariffa;
