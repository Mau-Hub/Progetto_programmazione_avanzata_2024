// src/utils/errorFactory.ts
class AppError extends Error {
  public readonly statusCode: number;

  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

const errorFactory = {
  // Errore per risorsa non trovata
  notFound: (message: string) => new AppError(message, 404),

  // Errore per input non valido
  badRequest: (message: string) => new AppError(message, 400),

  // Errore di autenticazione
  unauthorized: (message: string) => new AppError(message, 401),

  // Errore di permessi
  forbidden: (message: string) => new AppError(message, 403),

  // Errore generico del server
  internal: (message: string) => new AppError(message, 500),
};

export { AppError, errorFactory };
