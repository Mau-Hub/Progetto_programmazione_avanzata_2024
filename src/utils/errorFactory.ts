// /src/utils/errorFactory.ts

// eslint-disable-next-line max-classes-per-file
import { StatusCodes } from 'http-status-codes';

/**
 * Classe per rappresentare un errore HTTP personalizzato.
 */
export class CustomHttpError extends Error {
  public statusCode: number;

  public errorCode: string;

  constructor(httpStatusCode: number, errorMessage: string, errorCode: string) {
    super(errorMessage);
    this.statusCode = httpStatusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Enumerazione dei diversi tipi di errori applicativi.
 */
export enum ApplicationErrorTypes {
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  INVALID_INPUT = 'INVALID_INPUT',
  MALFORMED_ID = 'MALFORMED_ID',
  SERVER_ERROR = 'SERVER_ERROR',
  AUTH_FAILED = 'AUTH_FAILED',
  INVALID_AUTH_TOKEN = 'INVALID_AUTH_TOKEN',
  ACCESS_DENIED = 'ACCESS_DENIED',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  JWT_ERROR = 'JWT_ERROR',
}

/**
 * Factory per creare errori HTTP personalizzati basati sui tipi definiti.
 */
export class ErrorGenerator {
  public static generateError(
    errorType: ApplicationErrorTypes,
    message: string
  ): CustomHttpError {
    switch (errorType) {
      case ApplicationErrorTypes.RESOURCE_NOT_FOUND:
        return new CustomHttpError(
          StatusCodes.NOT_FOUND,
          message,
          'RESOURCE_NOT_FOUND'
        );
      case ApplicationErrorTypes.INVALID_INPUT:
        return new CustomHttpError(
          StatusCodes.BAD_REQUEST,
          message,
          'INVALID_INPUT'
        );
      case ApplicationErrorTypes.MALFORMED_ID:
        return new CustomHttpError(
          StatusCodes.BAD_REQUEST,
          message,
          'MALFORMED_ID'
        );
      case ApplicationErrorTypes.AUTH_FAILED:
        return new CustomHttpError(
          StatusCodes.UNAUTHORIZED,
          message,
          'AUTH_FAILED'
        );
      case ApplicationErrorTypes.INVALID_AUTH_TOKEN:
        return new CustomHttpError(
          StatusCodes.UNAUTHORIZED,
          message,
          'INVALID_AUTH_TOKEN'
        );
      case ApplicationErrorTypes.ACCESS_DENIED:
        return new CustomHttpError(
          StatusCodes.FORBIDDEN,
          message,
          'ACCESS_DENIED'
        );
      case ApplicationErrorTypes.EXPIRED_TOKEN:
        return new CustomHttpError(
          StatusCodes.UNAUTHORIZED,
          message,
          'EXPIRED_TOKEN'
        );
      case ApplicationErrorTypes.JWT_ERROR:
        return new CustomHttpError(
          StatusCodes.UNAUTHORIZED,
          message,
          'JWT_ERROR'
        );
      case ApplicationErrorTypes.SERVER_ERROR:
      default:
        return new CustomHttpError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          message,
          'SERVER_ERROR'
        );
    }
  }
}
