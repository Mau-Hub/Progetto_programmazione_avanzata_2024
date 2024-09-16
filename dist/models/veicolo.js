"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../db/database"));
const utente_1 = __importDefault(require("./utente"));
const tipoVeicolo_1 = __importDefault(require("./tipoVeicolo"));
const sequelize = database_1.default.getInstance();
// Definizione del modello Veicolo
class Veicolo extends sequelize_1.Model {
}
// Inizializzazione del model Veicolo
Veicolo.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    targa: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        unique: true,
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
    id_utente: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: utente_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    tableName: 'Veicoli',
    sequelize,
    timestamps: true,
});
// Definizione delle relazioni tra Veicolo, Utente e Tipo_Veicolo
utente_1.default.hasMany(Veicolo, { foreignKey: 'id_utente', as: 'veicoli' });
Veicolo.belongsTo(utente_1.default, { foreignKey: 'id_utente', as: 'utente' });
tipoVeicolo_1.default.hasMany(Veicolo, { foreignKey: 'id_tipo_veicolo', as: 'veicoli' });
Veicolo.belongsTo(tipoVeicolo_1.default, {
    foreignKey: 'id_tipo_veicolo',
    as: 'tipoVeicolo',
});
exports.default = Veicolo;
