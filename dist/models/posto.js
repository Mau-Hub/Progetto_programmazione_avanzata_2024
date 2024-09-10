"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../db/database"));
const parcheggio_1 = __importDefault(require("./parcheggio"));
const sequelize = database_1.default.getInstance();
// Classe Posto che estende Model
class Posto extends sequelize_1.Model {
}
// Inizializzazione del model Posto
Posto.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    numero: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    stato: {
        type: sequelize_1.DataTypes.ENUM('libero', 'occupato'),
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
    sequelize,
    tableName: 'Posti',
    timestamps: true,
});
exports.default = Posto;
