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
const transito_1 = __importDefault(require("../models/transito"));
class TransitoRepository {
    // Creazione di un nuovo transito
    create(transitoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nuovoTransito = yield transito_1.default.create(transitoData);
                return nuovoTransito;
            }
            catch (error) {
                throw new Error('Errore nella creazione del transito');
            }
        });
    }
    // Ottenere tutti i transiti
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transiti = yield transito_1.default.findAll();
                return transiti;
            }
            catch (error) {
                throw new Error('Errore nel recupero dei transiti');
            }
        });
    }
    // Ottenere un transito specifico per ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transito = yield transito_1.default.findByPk(id);
                return transito;
            }
            catch (error) {
                throw new Error('Errore nel recupero del transito');
            }
        });
    }
    // Aggiornare un transito
    update(id, transitoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [numUpdated] = yield transito_1.default.update(transitoData, {
                    where: { id },
                });
                return numUpdated === 1; // True se è stato aggiornato
            }
            catch (error) {
                throw new Error('Errore nell\'aggiornamento del transito');
            }
        });
    }
    // Eliminare un transito
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const numDeleted = yield transito_1.default.destroy({
                    where: { id },
                });
                return numDeleted === 1; // True se è stato eliminato
            }
            catch (error) {
                throw new Error('Errore nell\'eliminazione del transito');
            }
        });
    }
}
exports.default = new TransitoRepository();
