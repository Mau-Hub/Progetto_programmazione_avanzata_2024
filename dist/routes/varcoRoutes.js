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
// Solo gli utenti con ruolo "operatore" possono gestire i varchi
router.post('/varco', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateVarco, varcoController_1.default.createVarco); // Creazione di un varco
router.get('/varchi', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), varcoController_1.default.getAllVarchi); // Ottenere tutti i varchi
router.get('/varco/:id', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), varcoController_1.default.getVarcoById); // Ottenere un varco per ID
router.put('/varco/:id', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateVarco, varcoController_1.default.updateVarco); // Aggiornamento di un varco
router.delete('/varco/:id', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), varcoController_1.default.deleteVarco); // Eliminazione di un varco
// Gestione degli errori
router.use(errorHandler_1.errorHandler);
exports.default = router;
