"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUsername = void 0;
const express_validator_1 = require("express-validator");
const validationRequestMiddleware_1 = __importDefault(require("./validationRequestMiddleware"));
exports.validateUsername = [
    // Controlla che l'username sia presente nel corpo della richiesta e rispetti le regole
    (0, express_validator_1.body)('username')
        .optional()
        .isAlphanumeric()
        .withMessage('Il nome utente deve contenere solo caratteri alfanumerici')
        .isLength({ min: 3, max: 20 })
        .withMessage('Il nome utente deve avere una lunghezza compresa tra 3 e 20 caratteri'),
    // Controlla che l'username sia presente nei parametri di query e rispetti le regole
    (0, express_validator_1.query)('username')
        .optional()
        .isAlphanumeric()
        .withMessage('Il nome utente deve contenere solo caratteri alfanumerici')
        .isLength({ min: 3, max: 20 })
        .withMessage('Il nome utente deve avere una lunghezza compresa tra 3 e 20 caratteri'),
    validationRequestMiddleware_1.default,
];
