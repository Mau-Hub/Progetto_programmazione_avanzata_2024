// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorFactory';

class ErrorHandler {
  static handleError(
    error: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof AppError) {
      // Gestione degli errori definiti dall'applicazione (AppError)
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    // Gestione degli errori generici
    res.status(500).json({
      status: 'error',
      message: 'Errore interno del server',
      statusCode: 500,
    });
  }
}

export default ErrorHandler;
