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
const tariffa_1 = __importDefault(require("../models/tariffa"));
const dateUtils_1 = require("../ext/dateUtils");
const errorFactory_1 = require("../ext/errorFactory");
class TransitoService {
    /**
     * Calcola la durata del transito in ore.
     *
     * @param ingresso - Data e ora di ingresso
     * @param uscita - Data e ora di uscita
     * @returns La durata in ore
     */
    calcolaDurataInOre(ingresso, uscita) {
        const durataInMs = uscita.getTime() - ingresso.getTime();
        return durataInMs / (1000 * 60 * 60); // Durata in ore
    }
    /**
     * Determina se un giorno è festivo o feriale.
     *
     * @param giornoSettimana - Stringa rappresentante il giorno della settimana
     * @returns 'FERIALE' o 'FESTIVO'
     */
    determinaFerialeFestivo(giornoSettimana) {
        return giornoSettimana === 'SABATO' || giornoSettimana === 'DOMENICA'
            ? 'FESTIVO'
            : 'FERIALE';
    }
    /**
     * Calcola l'importo basato sulla tariffa e la durata del transito.
     *
     * @param transitoId - L'ID del transito da cui calcolare
     * @param dataOraUscita - Data e ora di uscita
     * @returns L'importo calcolato
     */
    calcolaImporto(transitoId, dataOraUscita) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transito = yield transito_1.default.findByPk(transitoId);
                if (!transito) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Transito non trovato');
                }
                // Recupera la tariffa dal TariffaRepository
                const tariffa = yield tariffa_1.default.findByPk(transito.id_tariffa);
                if (!tariffa) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Tariffa non trovata');
                }
                // Calcolo della durata in ore
                const durataInMs = dataOraUscita.getTime() - transito.ingresso.getTime();
                const durataInOre = durataInMs / (1000 * 60 * 60);
                // Funzione per determinare la fascia oraria in base all'orario
                const determinaFasciaOraria = (data) => {
                    const ora = data.getHours();
                    return ora >= 8 && ora < 20 ? 'DIURNA' : 'NOTTURNA';
                };
                // Calcolo della tariffa per l'intervallo di ingresso e uscita
                const fasciaIngresso = determinaFasciaOraria(transito.ingresso);
                const fasciaUscita = determinaFasciaOraria(dataOraUscita);
                const importoOrarioIngresso = tariffa.fascia_oraria === fasciaIngresso &&
                    tariffa.feriale_festivo ===
                        (0, dateUtils_1.getGiornoSettimanaString)(transito.ingresso.getDay())
                    ? tariffa.importo
                    : 0;
                const importoOrarioUscita = tariffa.fascia_oraria === fasciaUscita &&
                    tariffa.feriale_festivo ===
                        (0, dateUtils_1.getGiornoSettimanaString)(dataOraUscita.getDay())
                    ? tariffa.importo
                    : 0;
                // Calcolo dell'importo totale
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
