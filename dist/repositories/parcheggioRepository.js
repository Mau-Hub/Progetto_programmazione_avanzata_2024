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
const parcheggio_1 = __importDefault(require("../models/parcheggio"));
const varco_1 = __importDefault(require("../models/varco"));
class ParcheggioRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nome, capacita, varchi } = data;
            // Crea il nuovo parcheggio
            const nuovoParcheggio = yield parcheggio_1.default.create({ nome, capacita });
            // Se ci sono varchi, creali e associarli al parcheggio
            if (varchi && varchi.length > 0) {
                yield Promise.all(varchi.map((varco) => varco_1.default.create({
                    tipo: varco.tipo,
                    bidirezionale: varco.bidirezionale,
                    id_parcheggio: nuovoParcheggio.id,
                })));
            }
            // Aggiunge al parcheggio i varchi e  lo restituisce
            const parcheggioConVarchi = yield parcheggio_1.default.findByPk(nuovoParcheggio.id, {
                include: [{ model: varco_1.default, as: 'varchi' }],
            });
            // Gestione nel caso in cui il parcheggio non venga trovato
            if (!parcheggioConVarchi) {
                throw new Error('Parcheggio non trovato');
            }
            return parcheggioConVarchi;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield parcheggio_1.default.findByPk(id, {
                include: [{ model: varco_1.default, as: 'varchi' }],
            });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield parcheggio_1.default.findAll({
                include: [{ model: varco_1.default, as: 'varchi' }],
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const parcheggio = yield parcheggio_1.default.findByPk(id);
            if (!parcheggio) {
                throw new Error('Parcheggio non trovato');
            }
            const { nome, capacita, varchi } = data;
            yield parcheggio.update({ nome, capacita });
            if (varchi && varchi.length > 0) {
                yield varco_1.default.destroy({ where: { id_parcheggio: id } });
                yield Promise.all(varchi.map((varco) => varco_1.default.create({
                    tipo: varco.tipo,
                    bidirezionale: varco.bidirezionale,
                    id_parcheggio: id,
                })));
            }
            return true;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const parcheggio = yield parcheggio_1.default.findByPk(id);
            if (!parcheggio) {
                throw new Error('Parcheggio non trovato');
            }
            yield varco_1.default.destroy({ where: { id_parcheggio: id } });
            yield parcheggio.destroy();
            return true;
        });
    }
}
exports.default = new ParcheggioRepository();
