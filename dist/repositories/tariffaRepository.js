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
const tariffaDao_1 = __importDefault(require("../dao/tariffaDao"));
class TariffaRepository {
    // Creazione di una nuova tariffa
    create(tariffaData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Utilizza il metodo 'create' anziché 'createTariffa'
            return yield tariffaDao_1.default.create(tariffaData);
        });
    }
    // Acquisizione di tutte le tariffe
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // Utilizza il metodo 'findAll' anziché 'getAllTariffe'
            return yield tariffaDao_1.default.findAll();
        });
    }
    // Acquisizione di una tariffa specifica per ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Utilizza il metodo 'findById' anziché 'getTariffaById'
            return yield tariffaDao_1.default.findById(id);
        });
    }
    // Aggiornamento di una tariffa
    update(id, tariffaData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Utilizza il metodo 'update' anziché 'updateTariffa'
            return yield tariffaDao_1.default.update(id, tariffaData);
        });
    }
    // Eliminazione di una tariffa
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Utilizza il metodo 'delete' anziché 'deleteTariffa'
            return yield tariffaDao_1.default.delete(id);
        });
    }
}
exports.default = new TariffaRepository();
