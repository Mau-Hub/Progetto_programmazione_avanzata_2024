"use strict";
/**
 * @file database.ts
 * @description File per la configurazione del DB con Sequelize
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// TODO
const dbName = process.env.DB_NAME || 'PA24';
const dbUser = process.env.DB_USER || 'username';
const dbPassword = process.env.DB_PASSWORD || 'password';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT) || 5432;
/**
 * @class DatabaseConnection
 * @description TODO
 */
class DatabaseConnection {
    /**
     * @constructor
     * @description TODO
     */
    constructor() {
        this.connection = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
            host: dbHost,
            port: dbPort,
            dialect: 'postgres',
            logging: (msg) => console.log(msg),
        });
    }
    /**
     * @function getInstance
     * @description TODO
     * @returns {Sequelize} TODO
     */
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance.connection;
    }
}
DatabaseConnection.instance = null;
exports.default = DatabaseConnection;
