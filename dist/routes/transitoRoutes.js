"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transitoController_1 = __importDefault(require("../controllers/transitoController"));
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const errorHandler_1 = require("../middleware/errorHandler");
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
const router = (0, express_1.Router)();
// Middleware di autenticazione per tutte le rotte
router.use(authenticationMiddleware_1.authenticationMiddleware);
// Creazione di un nuovo transito (ingresso)
router.post('/transito', (0, authenticationMiddleware_1.authorizeRoles)(['operatore', 'varco']), validationMiddleware_1.default.validateTransito, transitoController_1.default.createTransito);
// Recupero di un transito per ID
router.get('/transito/:id', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), transitoController_1.default.getTransitoById);
// Aggiornamento di un transito (uscita) e calcolo della tariffa
router.put('/transito/:id/uscita', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateUpdateUscita, transitoController_1.default.exitTransito);
// Eliminazione di un transito per ID
router.delete('/transito/:id', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), transitoController_1.default.deleteTransito);
// Gestione degli errori
router.use(errorHandler_1.errorHandler);
exports.default = router;
