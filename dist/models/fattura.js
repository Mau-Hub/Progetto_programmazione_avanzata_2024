"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fattura = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../db/database"));
const utente_1 = __importDefault(require("./utente")); // Importa il modello Utente per la relazione
const transito_1 = __importDefault(require("./transito")); // Importa il modello Transito per la relazione
const sequelize = database_1.default.getInstance();
// Definizione del model Fattura
class Fattura extends sequelize_1.Model {
}
exports.Fattura = Fattura;
// Inizializzazione del model Fattura
Fattura.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    data: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    importo_totale: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    id_utente: {
        // Utilizziamo id_utente invece di id_operatore e id_automobilista
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: utente_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    id_transito: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: transito_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    tableName: 'Fatture',
    sequelize,
    timestamps: true,
});
// Definisci le relazioni tra Fattura, Utente e Transito
utente_1.default.hasMany(Fattura, { foreignKey: 'id_utente', as: 'fatture' });
Fattura.belongsTo(utente_1.default, { foreignKey: 'id_utente', as: 'utente' });
transito_1.default.hasOne(Fattura, { foreignKey: 'id_transito', as: 'fattura' });
Fattura.belongsTo(transito_1.default, { foreignKey: 'id_transito', as: 'transito' });
exports.default = Fattura;
