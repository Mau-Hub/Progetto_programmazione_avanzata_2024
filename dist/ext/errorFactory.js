"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorGenerator = exports.ApplicationErrorTypes = exports.CustomHttpError = void 0;
const http_status_codes_1 = require("http-status-codes");
/**
 * Classe per rappresentare un errore HTTP personalizzato.
 */
class CustomHttpError extends Error {
    constructor(httpStatusCode, errorMessage, errorCode) {
        super(errorMessage);
        this.statusCode = httpStatusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomHttpError = CustomHttpError;
/**
 * Enumerazione dei diversi tipi di errori applicativi.
 */
var ApplicationErrorTypes;
(function (ApplicationErrorTypes) {
    ApplicationErrorTypes["RESOURCE_NOT_FOUND"] = "RESOURCE_NOT_FOUND";
    ApplicationErrorTypes["INVALID_INPUT"] = "INVALID_INPUT";
    ApplicationErrorTypes["MALFORMED_ID"] = "MALFORMED_ID";
    ApplicationErrorTypes["SERVER_ERROR"] = "SERVER_ERROR";
    ApplicationErrorTypes["AUTH_FAILED"] = "AUTH_FAILED";
    ApplicationErrorTypes["INVALID_AUTH_TOKEN"] = "INVALID_AUTH_TOKEN";
    ApplicationErrorTypes["ACCESS_DENIED"] = "ACCESS_DENIED";
    ApplicationErrorTypes["EXPIRED_TOKEN"] = "EXPIRED_TOKEN";
    ApplicationErrorTypes["JWT_ERROR"] = "JWT_ERROR";
})(ApplicationErrorTypes || (exports.ApplicationErrorTypes = ApplicationErrorTypes = {}));
/**
 * Factory per creare errori HTTP personalizzati basati sui tipi definiti.
 */
class ErrorGenerator {
    static generateError(errorType, message) {
        switch (errorType) {
            case ApplicationErrorTypes.RESOURCE_NOT_FOUND:
                return new CustomHttpError(http_status_codes_1.StatusCodes.NOT_FOUND, message, 'RESOURCE_NOT_FOUND');
            case ApplicationErrorTypes.INVALID_INPUT:
                return new CustomHttpError(http_status_codes_1.StatusCodes.BAD_REQUEST, message, 'INVALID_INPUT');
            case ApplicationErrorTypes.MALFORMED_ID:
                return new CustomHttpError(http_status_codes_1.StatusCodes.BAD_REQUEST, message, 'MALFORMED_ID');
            case ApplicationErrorTypes.AUTH_FAILED:
                return new CustomHttpError(http_status_codes_1.StatusCodes.UNAUTHORIZED, message, 'AUTH_FAILED');
            case ApplicationErrorTypes.INVALID_AUTH_TOKEN:
                return new CustomHttpError(http_status_codes_1.StatusCodes.UNAUTHORIZED, message, 'INVALID_AUTH_TOKEN');
            case ApplicationErrorTypes.ACCESS_DENIED:
                return new CustomHttpError(http_status_codes_1.StatusCodes.FORBIDDEN, message, 'ACCESS_DENIED');
            case ApplicationErrorTypes.EXPIRED_TOKEN:
                return new CustomHttpError(http_status_codes_1.StatusCodes.UNAUTHORIZED, message, 'EXPIRED_TOKEN');
            case ApplicationErrorTypes.JWT_ERROR:
                return new CustomHttpError(http_status_codes_1.StatusCodes.UNAUTHORIZED, message, 'JWT_ERROR');
            case ApplicationErrorTypes.SERVER_ERROR:
            default:
                return new CustomHttpError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message, 'SERVER_ERROR');
        }
    }
}
exports.ErrorGenerator = ErrorGenerator;
