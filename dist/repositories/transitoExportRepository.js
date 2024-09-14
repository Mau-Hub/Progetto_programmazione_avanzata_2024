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
const transitoDao_1 = __importDefault(require("../dao/transitoDao"));
const sequelize_1 = require("sequelize");
class TransitoExportRepository {
    findTransitiByTargheAndPeriodo(targhe, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Recupera i transiti filtrati per targa e periodo
                const transiti = yield transitoDao_1.default.findAll({
                    where: {
                        targa: {
                            [sequelize_1.Op.in]: targhe,
                        },
                        ingresso: {
                            [sequelize_1.Op.gte]: from,
                        },
                        uscita: {
                            [sequelize_1.Op.lte]: to,
                        },
                    },
                    include: ['veicolo', 'varcoIngresso', 'varcoUscita'],
                });
                // Mappa i dati per l'export
                return transiti.map((transito) => ({
                    targa: transito.veicolo.targa,
                    ingresso: transito.ingresso,
                    uscita: transito.uscita,
                    tipoVeicolo: transito.veicolo.tipoVeicolo.nome,
                    costo: transito.importo || null,
                }));
            }
            catch (error) {
                console.error('Errore nel recupero dei transiti:', error);
                throw new Error('Errore nel recupero dei transiti');
            }
        });
    }
}
exports.default = new TransitoExportRepository();
