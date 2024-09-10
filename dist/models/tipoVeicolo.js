"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../db/database"));
const sequelize = database_1.default.getInstance();
// Definizione del modello Tipo_Veicolo
class TipoVeicolo extends sequelize_1.Model {
}
// Inizializzazione del model Tipo_Veicolo
TipoVeicolo.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'Tipo_Veicolo',
    sequelize,
    timestamps: true,
});
exports.default = TipoVeicolo;
