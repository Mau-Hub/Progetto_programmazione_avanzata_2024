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
const tipoVeicolo_1 = __importDefault(require("../models/tipoVeicolo"));
const parcheggio_1 = __importDefault(require("../models/parcheggio"));
const utente_1 = __importDefault(require("../models/utente"));
class TariffaDao {
    // Metodo per creare una nuova tariffa
    createTariffa(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tariffa = yield tariffa_1.default.create(data);
                return tariffa;
            }
            catch (error) {
                throw new Error(`Errore durante la creazione della tariffa: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Metodo per trovare una tariffa per ID
    getTariffaById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tariffa = yield tariffa_1.default.findByPk(id, {
                    include: [
                        { model: tipoVeicolo_1.default, as: 'tipoVeicolo' },
                        { model: parcheggio_1.default, as: 'parcheggio' },
                        { model: utente_1.default, as: 'utente' },
                    ],
                });
                return tariffa;
            }
            catch (error) {
                throw new Error(`Errore durante il recupero della tariffa con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Metodo per ottenere tutte le tariffe
    getAllTariffe() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tariffe = yield tariffa_1.default.findAll({
                    include: [
                        { model: tipoVeicolo_1.default, as: 'tipoVeicolo' },
                        { model: parcheggio_1.default, as: 'parcheggio' },
                        { model: utente_1.default, as: 'utente' },
                    ],
                });
                return tariffe;
            }
            catch (error) {
                throw new Error(`Errore durante il recupero di tutte le tariffe: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Metodo per aggiornare una tariffa
    updateTariffa(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield tariffa_1.default.update(data, {
                    where: { id },
                    returning: true,
                });
                return result;
            }
            catch (error) {
                throw new Error(`Errore durante l'aggiornamento della tariffa con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Metodo per eliminare una tariffa
    deleteTariffa(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield tariffa_1.default.destroy({
                    where: { id },
                });
                return result;
            }
            catch (error) {
                throw new Error(`Errore durante l'eliminazione della tariffa con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
}
exports.default = new TariffaDao();
