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
const parcheggioDao_1 = __importDefault(require("../dao/parcheggioDao"));
const posto_1 = __importDefault(require("../models/posto"));
const varco_1 = __importDefault(require("../models/varco"));
class ParcheggioRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nome, capacita, varchi } = data;
            // Crea il nuovo parcheggio tramite DAO, id sarà generato automaticamente
            const nuovoParcheggio = yield parcheggioDao_1.default.create({ nome, capacita });
            // Se ci sono varchi, li crea e li associa al parcheggio
            if (varchi && varchi.length > 0) {
                yield Promise.all(varchi.map((varco) => varco_1.default.create({
                    tipo: varco.tipo,
                    bidirezionale: varco.bidirezionale,
                    id_parcheggio: nuovoParcheggio.id, // Associa i varchi al parcheggio appena creato
                })));
            }
            // Ritorna il parcheggio con i varchi associati
            const parcheggioConVarchi = yield parcheggioDao_1.default.findById(nuovoParcheggio.id);
            if (!parcheggioConVarchi) {
                throw new Error('Parcheggio non trovato');
            }
            return parcheggioConVarchi;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield parcheggioDao_1.default.findById(id);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield parcheggioDao_1.default.findAll();
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const parcheggio = yield parcheggioDao_1.default.findById(id);
            if (!parcheggio) {
                throw new Error('Parcheggio non trovato');
            }
            const { nome, capacita, varchi } = data;
            yield parcheggioDao_1.default.update(id, { nome, capacita });
            // Aggiorna anche i varchi
            if (varchi && varchi.length > 0) {
                // Prima elimina tutti i varchi associati a questo parcheggio
                yield varco_1.default.destroy({ where: { id_parcheggio: id } });
                // Poi ricrea i varchi con i nuovi dati
                yield Promise.all(varchi.map((varco) => varco_1.default.create({
                    tipo: varco.tipo,
                    bidirezionale: varco.bidirezionale,
                    id_parcheggio: id, // Associa i nuovi varchi al parcheggio esistente
                })));
            }
            return true;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parcheggio = yield parcheggioDao_1.default.findById(id);
            if (!parcheggio) {
                throw new Error('Parcheggio non trovato');
            }
            // Elimina prima tutti i varchi associati al parcheggio
            yield varco_1.default.destroy({ where: { id_parcheggio: id } });
            // Elimina il parcheggio
            return yield parcheggioDao_1.default.delete(id);
        });
    }
    checkPostiDisponibili(parcheggioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postiLiberi = yield posto_1.default.count({
                where: {
                    id_parcheggio: parcheggioId,
                    stato: 'libero'
                }
            });
            return postiLiberi > 0;
        });
    }
}
exports.default = new ParcheggioRepository();
