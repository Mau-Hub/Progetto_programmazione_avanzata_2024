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
const posto_1 = __importDefault(require("../models/posto"));
const parcheggio_1 = __importDefault(require("../models/parcheggio"));
class PostoDao {
    // Crea un nuovo posto
    createPosto(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPosto = yield posto_1.default.create(data);
                return newPosto;
            }
            catch (error) {
                throw new Error(`Errore durante la creazione del posto: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Ottieni tutti i posti o filtra per stato/parcheggio
    getAllPosti(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posti = yield posto_1.default.findAll({
                    where: filters
                        ? Object.assign(Object.assign({}, (filters.stato && { stato: filters.stato })), (filters.id_parcheggio && {
                            id_parcheggio: filters.id_parcheggio,
                        })) : {},
                    include: [
                        {
                            model: parcheggio_1.default,
                            as: 'parcheggio',
                        },
                    ],
                });
                return posti;
            }
            catch (error) {
                throw new Error(`Errore durante il recupero dei posti: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Ottieni un posto per ID
    getPostoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posto = yield posto_1.default.findByPk(id, {
                    include: [
                        {
                            model: parcheggio_1.default,
                            as: 'parcheggio',
                        },
                    ],
                });
                return posto;
            }
            catch (error) {
                throw new Error(`Errore durante il recupero del posto con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Aggiorna un posto per ID
    updatePosto(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [affectedRows, updatedPosto] = yield posto_1.default.update(data, {
                    where: { id },
                    returning: true,
                });
                return [affectedRows, updatedPosto];
            }
            catch (error) {
                throw new Error(`Errore durante l'aggiornamento del posto con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
    // Elimina un posto per ID
    deletePosto(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedRows = yield posto_1.default.destroy({
                    where: { id },
                });
                return deletedRows;
            }
            catch (error) {
                throw new Error(`Errore durante l'eliminazione del posto con ID ${id}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
            }
        });
    }
}
exports.default = new PostoDao();
