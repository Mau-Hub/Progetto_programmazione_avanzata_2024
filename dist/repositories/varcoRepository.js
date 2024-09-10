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
const varco_1 = __importDefault(require("../models/varco"));
class VarcoRepository {
    // Creazione di un nuovo varco
    create(varcoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nuovoVarco = yield varco_1.default.create(varcoData);
                return nuovoVarco;
            }
            catch (error) {
                throw new Error('Errore nella creazione del varco');
            }
        });
    }
    // Ottenere tutti i varchi
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const varchi = yield varco_1.default.findAll();
                return varchi;
            }
            catch (error) {
                throw new Error('Errore nel recupero dei varchi');
            }
        });
    }
    // Ottenere un varco specifico per ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const varco = yield varco_1.default.findByPk(id);
                return varco;
            }
            catch (error) {
                throw new Error('Errore nel recupero del varco');
            }
        });
    }
    // Aggiornare un varco
    update(id, varcoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [numUpdated] = yield varco_1.default.update(varcoData, {
                    where: { id },
                });
                return numUpdated === 1; // True se è stato aggiornato
            }
            catch (error) {
                throw new Error('Errore nell\'aggiornamento del varco');
            }
        });
    }
    // Eliminare un varco
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const numDeleted = yield varco_1.default.destroy({
                    where: { id },
                });
                return numDeleted === 1; // True se è stato eliminato
            }
            catch (error) {
                throw new Error('Errore nell\'eliminazione del varco');
            }
        });
    }
}
exports.default = new VarcoRepository();
