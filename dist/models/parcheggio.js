"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcheggio = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../db/database"));
const sequelize = database_1.default.getInstance();
// Definizione del modello Parcheggio
class Parcheggio extends sequelize_1.Model {
}
exports.Parcheggio = Parcheggio;
// Inizializzazione del model Parcheggio
Parcheggio.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    capacita: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Parcheggio',
    sequelize,
    timestamps: true,
});
// Esporta il modello e le interfacce
exports.default = Parcheggio;
