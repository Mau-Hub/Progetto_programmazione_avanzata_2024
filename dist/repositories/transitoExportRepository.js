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
const veicoloDao_1 = __importDefault(require("../dao/veicoloDao"));
const errorFactory_1 = require("../ext/errorFactory");
const sequelize_1 = require("sequelize");
class TransitoExportRepository {
    findTransitiByTargheAndPeriodo(targhe, from, to, userId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let targheFiltrate = targhe;
                // Se l'utente è un automobilista, deve vedere solo i veicoli a lui associati
                if (userRole === 'automobilista') {
                    // Trova tutti i veicoli associati all'utente autenticato
                    const veicoliAssociati = yield veicoloDao_1.default.findAll({
                        where: { id_utente: userId },
                    });
                    // Ottieni le targhe dei veicoli associati all'utente
                    const targheUtente = veicoliAssociati.map((veicolo) => veicolo.targa);
                    // Filtra le targhe richieste in base ai veicoli associati all'utente
                    targheFiltrate = targhe.filter((targa) => targheUtente.includes(targa));
                    // Se l'automobilista non ha accesso ad alcuna delle targhe specificate, genera un errore
                    if (targheFiltrate.length === 0) {
                        throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.ACCESS_DENIED, 'Non puoi visualizzare i transiti per le targhe specificate.');
                    }
                }
                // Recupera i transiti filtrati per targa e periodo
                const transiti = yield transitoDao_1.default.findAll({
                    where: {
                        '$veicolo.targa$': {
                            [sequelize_1.Op.in]: targheFiltrate,
                        },
                        ingresso: {
                            [sequelize_1.Op.gte]: from,
                            [sequelize_1.Op.lte]: to,
                        },
                        [sequelize_1.Op.or]: [{ uscita: { [sequelize_1.Op.lte]: to } }, { uscita: null }],
                    },
                    include: ['veicolo', 'varcoIngresso', 'varcoUscita', 'tariffa'],
                });
                // Mappa i dati per l'export e include il tipoVeicolo
                return yield Promise.all(transiti.map((transito) => __awaiter(this, void 0, void 0, function* () {
                    const veicolo = yield veicoloDao_1.default.findByIdWithTipoVeicolo(transito.id_veicolo);
                    let tipoVeicoloNome = 'Tipo sconosciuto';
                    if (veicolo && veicolo.tipoVeicolo) {
                        tipoVeicoloNome = veicolo.tipoVeicolo.nome;
                    }
                    return {
                        targa: transito.veicolo.targa,
                        ingresso: transito.ingresso,
                        uscita: transito.uscita,
                        tipoVeicolo: tipoVeicoloNome,
                        costo: transito.importo || null,
                    };
                })));
            }
            catch (error) {
                console.error('Errore nel recupero dei transiti:', error);
                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore nel recupero dei transiti');
            }
        });
    }
}
exports.default = new TransitoExportRepository();
