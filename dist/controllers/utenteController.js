"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utenteDao_1 = __importDefault(require("../dao/utenteDao"));
const errorFactory_1 = require("../ext/errorFactory");
class UtenteController {
    // Metodo per ottenere tutti gli utenti
    getAllUtenti(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utenti = yield utenteDao_1.default.findAll();
                res.status(200).json(utenti);
            }
            catch (error) {
                next(errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero degli utenti.'));
            }
        });
    }
}
exports.default = new UtenteController();
