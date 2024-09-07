/**
 * @file database.ts
 * @description File per la configurazione del DB con Sequelize
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

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
  private static instance: DatabaseConnection | null = null;

  private connection: Sequelize;

  /**
   * @constructor
   * @description TODO
   */
  private constructor() {
    this.connection = new Sequelize(dbName, dbUser, dbPassword, {
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
  public static getInstance(): Sequelize {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance.connection;
  }
}

export default DatabaseConnection;
