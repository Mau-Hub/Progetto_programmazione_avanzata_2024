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
const tariffa_1 = __importDefault(require("../models/tariffa"));
class TariffaRepository {
    // Creazione di una nuova tariffa
    create(tariffaData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nuovaTariffa = yield tariffa_1.default.create(tariffaData);
                return nuovaTariffa;
            }
            catch (error) {
                throw new Error('Errore nella creazione della tariffa');
            }
        });
    }
    // Acquisizione di tutte le tariffe
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tariffe = yield tariffa_1.default.findAll();
                return tariffe;
            }
            catch (error) {
                throw new Error('Errore nel recupero delle tariffe');
            }
        });
    }
    // Acquisizione di una tariffa specifica per ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tariffa = yield tariffa_1.default.findByPk(id);
                return tariffa;
            }
            catch (error) {
                throw new Error('Errore nel recupero della tariffa');
            }
        });
    }
    // Aggiornamento di una tariffa
    update(id, tariffaData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [numUpdated] = yield tariffa_1.default.update(tariffaData, {
                    where: { id },
                });
                return numUpdated === 1;
            }
            catch (error) {
                throw new Error("Errore nell'aggiornamento della tariffa");
            }
        });
    }
    // Eliminazione di una tariffa
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const numDeleted = yield tariffa_1.default.destroy({
                    where: { id },
                });
                return numDeleted === 1;
            }
            catch (error) {
                throw new Error("Errore nell'eliminazione della tariffa");
            }
        });
    }
}
exports.default = new TariffaRepository();
