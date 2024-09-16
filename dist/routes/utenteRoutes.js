"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utenteController_1 = __importDefault(require("../controllers/utenteController"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// Rotta per ottenere tutti gli utenti
router.get('/utenti', utenteController_1.default.getAllUtenti);
// Gestione degli errori
router.use(errorHandler_1.errorHandler);
exports.default = router;
