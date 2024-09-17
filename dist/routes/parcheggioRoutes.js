"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parcheggioController_1 = __importDefault(require("../controllers/parcheggioController"));
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const errorHandler_1 = require("../middleware/errorHandler");
const authenticationMiddleware_2 = require("../middleware/authenticationMiddleware");
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
const router = (0, express_1.Router)();
// Serve per applicare il middleware di autenticazione a tutte le rotte
router.use(authenticationMiddleware_1.authenticationMiddleware);
router.post('/parcheggio', (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateParcheggio, parcheggioController_1.default.createParcheggio);
router.get('/parcheggi', (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), parcheggioController_1.default.getAllParcheggi);
router.get('/parcheggio/:id', (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateIdParam, parcheggioController_1.default.getParcheggioById);
router.put('/parcheggio/:id', (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateIdParam, validationMiddleware_1.default.validateParcheggio, parcheggioController_1.default.updateParcheggio);
router.delete('/parcheggio/:id', (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateIdParam, parcheggioController_1.default.deleteParcheggio);
// Gestione degli errori
router.use(errorHandler_1.errorHandler);
exports.default = router;
