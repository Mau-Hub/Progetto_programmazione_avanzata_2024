"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const varcoController_1 = __importDefault(require("../controllers/varcoController"));
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Middleware di autenticazione applicato a tutte le rotte
router.use(authenticationMiddleware_1.authenticationMiddleware);
router.post('/varco', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateVarco, varcoController_1.default.createVarco);
router.get('/varchi', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), varcoController_1.default.getAllVarchi);
router.get('/varco/:id', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateIdParam, varcoController_1.default.getVarcoById);
router.put('/varco/:id', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateIdParam, validationMiddleware_1.default.validateVarco, varcoController_1.default.updateVarco);
router.delete('/varco/:id', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateIdParam, varcoController_1.default.deleteVarco);
// Gestione degli errori
router.use(errorHandler_1.errorHandler);
exports.default = router;
