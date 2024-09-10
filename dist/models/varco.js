"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../db/database"));
const parcheggio_1 = __importDefault(require("./parcheggio"));
const sequelize = database_1.default.getInstance();
// Definizione del modello Varco
class Varco extends sequelize_1.Model {
}
// Inizializzazione del model Varco
Varco.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tipo: {
        type: sequelize_1.DataTypes.ENUM('INGRESSO', 'USCITA'),
        allowNull: false,
    },
    bidirezionale: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    tableName: 'Varco',
    sequelize,
    timestamps: true,
});
// Definisci la relazione tra Varco e Parcheggio
parcheggio_1.default.hasMany(Varco, {
    foreignKey: 'id_parcheggio',
    as: 'varchi',
});
Varco.belongsTo(parcheggio_1.default, {
    foreignKey: 'id_parcheggio',
    as: 'parcheggio',
});
exports.default = Varco;
