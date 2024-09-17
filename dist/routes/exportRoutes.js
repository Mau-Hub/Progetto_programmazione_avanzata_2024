"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const transitiExportController_1 = __importDefault(require("../controllers/transitiExportController"));
const errorHandler_1 = require("../middleware/errorHandler");
const authenticationMiddleware_2 = require("../middleware/authenticationMiddleware");
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
const router = (0, express_1.Router)();
// Rotta autenticata per ottenere i transiti in formato CSV
router.get('/transiti/export', authenticationMiddleware_1.authenticationMiddleware, (0, authenticationMiddleware_2.authorizeRoles)(['operatore', 'automobilista']), validationMiddleware_1.default.validateExportTransiti, transitiExportController_1.default.exportTransiti);
// Rotta autenticata per ottenere le statistiche in formato JSON, CSV o PDF
router.get('/statistiche', authenticationMiddleware_1.authenticationMiddleware, (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateStatistiche, transitiExportController_1.default.getStatistiche);
// Rotta autenticata per ottenere le statistiche di un parcheggio specifico
router.get('/statistiche/parcheggio', authenticationMiddleware_1.authenticationMiddleware, (0, authenticationMiddleware_2.authorizeRoles)(['operatore']), validationMiddleware_1.default.validateStatisticheParcheggio, transitiExportController_1.default.getStatistichePerParcheggio);
router.use(errorHandler_1.errorHandler);
exports.default = router;
