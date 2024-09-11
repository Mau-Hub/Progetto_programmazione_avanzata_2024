"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transitoController_1 = __importDefault(require("../controllers/transitoController"));
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Middleware di autenticazione per tutte le rotte
router.use(authenticationMiddleware_1.authenticationMiddleware);
// Creazione di un transito (accessibile a operatore o varco)
router.post('/transito', (0, authenticationMiddleware_1.authorizeRoles)(['operatore', 'varco']), transitoController_1.default.createTransito);
// Ottenere un transito specifico (solo operatore)
router.get('/transito/:id', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), transitoController_1.default.getTransitoById);
// Aggiornare un transito (solo operatore)
router.put('/transito/:id', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), transitoController_1.default.updateTransito);
// Eliminare un transito (solo operatore)
router.delete('/transito/:id', (0, authenticationMiddleware_1.authorizeRoles)(['operatore']), transitoController_1.default.deleteTransito);
// Gestione degli errori
router.use(errorHandler_1.errorHandler);
exports.default = router;
