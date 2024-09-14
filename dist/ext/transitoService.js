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
const errorFactory_1 = require("../ext/errorFactory");
const varcoDao_1 = __importDefault(require("../dao/varcoDao"));
const transitoDao_1 = __importDefault(require("../dao/transitoDao"));
const veicolo_1 = __importDefault(require("../models/veicolo"));
class TransitoService {
    calcolaDurataInOre(ingresso, uscita) {
        const durataInMs = uscita.getTime() - ingresso.getTime();
        return durataInMs / (1000 * 60 * 60);
    }
    determinaFerialeFestivo(data) {
        const giornoSettimana = data.getDay();
        return giornoSettimana === 0 || giornoSettimana === 6 // Domenica o Sabato
            ? 'FESTIVO'
            : 'FERIALE';
    }
    determinaFasciaOraria(data) {
        const ora = data.getHours();
        return ora >= 8 && ora < 20 ? 'DIURNA' : 'NOTTURNA';
    }
    calcolaImporto(transitoId, dataOraUscita) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transito = yield transitoDao_1.default.findById(transitoId, {
                    include: [{ model: veicolo_1.default, as: 'veicolo' }],
                });
                if (!transito) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato');
                }
                // Inserisci qui il controllo per transito.veicolo
                if (!transito.veicolo) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Veicolo associato al transito non trovato');
                }
                // Ora puoi accedere a transito.veicolo.id_tipo_veicolo senza errori
                const idTipoVeicolo = transito.veicolo.id_tipo_veicolo;
                const varcoIngresso = yield varcoDao_1.default.findById(transito.id_varco_ingresso);
                if (!varcoIngresso) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Varco di ingresso non trovato');
                }
                // Determina la fascia oraria e il giorno per ingresso e uscita
                const fasciaOrariaIngresso = this.determinaFasciaOraria(transito.ingresso);
                const fasciaOrariaUscita = this.determinaFasciaOraria(dataOraUscita);
                const giornoIngresso = this.determinaFerialeFestivo(transito.ingresso);
                const giornoUscita = this.determinaFerialeFestivo(dataOraUscita);
                const tariffa = yield tariffaDao_1.default.findOne({
                    where: {
                        id_tipo_veicolo: idTipoVeicolo,
                        fascia_oraria: fasciaOrariaUscita, // Usando fascia oraria dell'uscita
                        feriale_festivo: giornoUscita, // Usando giorno dell'uscita
                        id_parcheggio: varcoIngresso.id_parcheggio,
                    },
                });
                if (!tariffa) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Tariffa non disponibile per questo transito');
                }
                // Aggiorna l'id_tariffa solo una volta
                transito.id_tariffa = tariffa.id;
                yield transito.save();
                const durataInOre = this.calcolaDurataInOre(transito.ingresso, dataOraUscita);
                // Usa la stessa tariffa per tutto il periodo se la tariffa è la stessa
                const importoOrarioIngresso = tariffa.fascia_oraria === fasciaOrariaIngresso &&
                    tariffa.feriale_festivo === giornoIngresso
                    ? tariffa.importo
                    : 0;
                const importoOrarioUscita = tariffa.fascia_oraria === fasciaOrariaUscita &&
                    tariffa.feriale_festivo === giornoUscita
                    ? tariffa.importo
                    : 0;
                const importoTotale = (importoOrarioIngresso + importoOrarioUscita) * durataInOre;
                return importoTotale;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, `Errore nel calcolo dell'importo: ${error.message}`);
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Errore sconosciuto nel calcolo dell'importo");
                }
            }
        });
    }
}
exports.default = new TransitoService();
