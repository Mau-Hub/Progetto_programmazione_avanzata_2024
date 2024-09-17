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
const sequelize_1 = require("sequelize");
const transitoDao_1 = __importDefault(require("../dao/transitoDao"));
const parcheggioDao_1 = __importDefault(require("../dao/parcheggioDao"));
const veicoloDao_1 = __importDefault(require("../dao/veicoloDao"));
const transitoService_1 = __importDefault(require("../ext/transitoService"));
const errorFactory_1 = require("../ext/errorFactory");
const errorFactory_2 = require("../ext/errorFactory");
class StatisticheRepository {
    calcolaStatistiche(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Recupera tutti i parcheggi
                const parcheggi = yield parcheggioDao_1.default.findAll();
                const statistiche = yield Promise.all(parcheggi.map((parcheggio) => __awaiter(this, void 0, void 0, function* () {
                    // Calcola il fatturato per ciascun parcheggio
                    const transiti = yield transitoDao_1.default.findAll({
                        where: {
                            ingresso: {
                                [sequelize_1.Op.gte]: from,
                            },
                            uscita: {
                                [sequelize_1.Op.lte]: to,
                            },
                            '$varcoIngresso.id_parcheggio$': parcheggio.id,
                        },
                        include: ['varcoIngresso'],
                    });
                    const fatturato = transiti.reduce((totale, transito) => {
                        return totale + (transito.importo || 0);
                    }, 0);
                    const mediaPostiLiberi = yield this.calcolaMediaPostiLiberi(parcheggio.id, from, to);
                    return {
                        parcheggio: parcheggio.nome,
                        fatturato,
                        mediaPostiLiberi,
                    };
                })));
                return statistiche;
            }
            catch (error) {
                console.error('Errore nel calcolo delle statistiche:', error);
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel calcolo delle statistiche');
            }
        });
    }
    calcolaMediaPostiLiberi(idParcheggio, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parcheggio = yield parcheggioDao_1.default.findById(idParcheggio);
                if (!parcheggio) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Parcheggio non trovato');
                }
                const capacitaTotale = parcheggio.capacita;
                const transiti = yield transitoDao_1.default.findAll({
                    where: {
                        ingresso: {
                            [sequelize_1.Op.gte]: from,
                        },
                        uscita: {
                            [sequelize_1.Op.lte]: to,
                        },
                        '$varcoIngresso.id_parcheggio$': idParcheggio,
                    },
                    include: ['varcoIngresso', 'varcoUscita'],
                });
                let postiOccupatiNelTempo = 0;
                let sommaPostiLiberi = 0;
                let conteggioFasi = 0;
                transiti.forEach((transito) => {
                    const ingresso = transito.ingresso.getTime();
                    const uscita = transito.uscita ? transito.uscita.getTime() : Date.now();
                    for (let t = ingresso; t < uscita; t += 3600000) {
                        postiOccupatiNelTempo++;
                        sommaPostiLiberi += capacitaTotale - postiOccupatiNelTempo;
                        conteggioFasi++;
                    }
                });
                return conteggioFasi > 0
                    ? sommaPostiLiberi / conteggioFasi
                    : capacitaTotale;
            }
            catch (error) {
                console.error('Errore nel calcolo della media dei posti liberi:', error);
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel calcolo della media dei posti liberi');
            }
        });
    }
    calcolaStatistichePerParcheggio(idParcheggio, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Controlla se il parcheggio esiste nel database
                const parcheggio = yield parcheggioDao_1.default.findById(idParcheggio);
                if (!parcheggio) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Parcheggio non trovato nel database');
                }
                const transiti = yield transitoDao_1.default.findAll({
                    where: {
                        ingresso: {
                            [sequelize_1.Op.gte]: from,
                        },
                        uscita: {
                            [sequelize_1.Op.lte]: to,
                        },
                        '$varcoIngresso.id_parcheggio$': idParcheggio,
                    },
                    include: ['varcoIngresso'],
                });
                const numeroTotaleTransiti = transiti.length;
                const transitiPerTipoVeicolo = {};
                for (const transito of transiti) {
                    const veicolo = yield veicoloDao_1.default.findById(transito.id_veicolo);
                    if (!veicolo) {
                        throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Veicolo non trovato per il transito (statistiche)');
                    }
                    const tipoVeicolo = veicolo.id_tipo_veicolo;
                    if (!transitiPerTipoVeicolo[tipoVeicolo]) {
                        transitiPerTipoVeicolo[tipoVeicolo] = 0;
                    }
                    transitiPerTipoVeicolo[tipoVeicolo]++;
                }
                const transitiPerFasciaOraria = {
                    DIURNA: 0,
                    NOTTURNA: 0,
                };
                transiti.forEach((transito) => {
                    const fasciaOraria = transitoService_1.default.determinaFasciaOraria(transito.ingresso);
                    transitiPerFasciaOraria[fasciaOraria]++;
                });
                const fatturatoTotale = transiti.reduce((totale, transito) => {
                    return totale + (transito.importo || 0);
                }, 0);
                return {
                    numeroTotaleTransiti,
                    transitiPerTipoVeicolo,
                    transitiPerFasciaOraria,
                    fatturatoTotale,
                };
            }
            catch (error) {
                console.error('Errore nel calcolo delle statistiche:', error);
                // Se l'errore è un CustomHttpError, rilancialo
                if (error instanceof errorFactory_2.CustomHttpError) {
                    throw error;
                }
                // Altrimenti, lancia un errore generico
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel calcolo delle statistiche');
            }
        });
    }
}
exports.default = new StatisticheRepository();
