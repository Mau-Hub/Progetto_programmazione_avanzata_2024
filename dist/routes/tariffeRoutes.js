"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tariffaController_1 = __importDefault(require("../controllers/tariffaController"));
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const errorHandler_1 = require("../middleware/errorHandler");
const authenticationMiddleware_2 = require("../middleware/authenticationMiddleware");
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
const router = (0, express_1.Router)();
// Middleware di autenticazione per tutte le rotte
router.use(authenticationMiddleware_1.authenticationMiddleware);
// CRUD per la gestione delle tariffe
router.post('/tariffa', (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateTariffa, tariffaController_1.default.createTariffa);
router.get('/tariffe', (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), tariffaController_1.default.getAllTariffe);
router.get('/tariffa/:id', (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateIdParam, tariffaController_1.default.getTariffaById);
router.put('/tariffa/:id', (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateIdParam, validationMiddleware_1.default.validateTariffa, tariffaController_1.default.updateTariffa);
router.delete('/tariffa/:id', (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateIdParam, tariffaController_1.default.deleteTariffa);
// Gestione degli errori
router.use(errorHandler_1.errorHandler);
exports.default = router;
