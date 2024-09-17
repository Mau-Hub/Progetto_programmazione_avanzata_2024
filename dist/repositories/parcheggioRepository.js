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
const varcoDao_1 = __importDefault(require("../dao/varcoDao"));
const errorFactory_1 = require("../ext/errorFactory");
class ParcheggioRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, capacita, varchi } = data;
                const nuovoParcheggio = yield parcheggioDao_1.default.create({
                    nome,
                    capacita,
                    posti_disponibili: capacita,
                });
                if (varchi && varchi.length > 0) {
                    yield Promise.all(varchi.map((varco) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield varcoDao_1.default.create({
                                tipo: varco.tipo,
                                bidirezionale: varco.bidirezionale,
                                id_parcheggio: nuovoParcheggio.id,
                            });
                        }
                        catch (varcoError) {
                            console.error('Errore durante la creazione del varco:', varcoError);
                            if (varcoError instanceof errorFactory_1.CustomHttpError) {
                                throw varcoError;
                            }
                            else {
                                throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante la creazione del varco');
                            }
                        }
                    })));
                }
                const parcheggioConVarchi = yield parcheggioDao_1.default.findById(nuovoParcheggio.id);
                if (!parcheggioConVarchi) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Parcheggio non trovato');
                }
                return parcheggioConVarchi;
            }
            catch (error) {
                console.error('Errore durante la creazione del parcheggio:', error);
                if (error instanceof errorFactory_1.CustomHttpError) {
                    throw error;
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante la creazione del parcheggio');
                }
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield parcheggioDao_1.default.findById(id);
            }
            catch (error) {
                console.error('Errore durante il recupero del parcheggio per ID:', error);
                if (error instanceof errorFactory_1.CustomHttpError) {
                    throw error;
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante il recupero del parcheggio per ID');
                }
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield parcheggioDao_1.default.findAll();
            }
            catch (error) {
                console.error('Errore durante il recupero di tutti i parcheggi:', error);
                if (error instanceof errorFactory_1.CustomHttpError) {
                    throw error;
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante il recupero di tutti i parcheggi');
                }
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parcheggio = yield parcheggioDao_1.default.findById(id);
                if (!parcheggio) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Parcheggio non trovato');
                }
                const { nome, capacita, varchi } = data;
                // Calcola la differenza di capacità
                const differenzaCapacita = capacita - parcheggio.capacita;
                // Aggiorna il parcheggio
                yield parcheggioDao_1.default.update(id, { nome, capacita });
                // Aggiorna posti_disponibili in base alla differenza di capacità
                parcheggio.posti_disponibili += differenzaCapacita;
                // Assicurati che posti_disponibili non superi la nuova capacità
                if (parcheggio.posti_disponibili > capacita) {
                    parcheggio.posti_disponibili = capacita;
                }
                // Salva le modifiche
                yield parcheggio.save();
                // Aggiorna i varchi se necessario
                if (varchi && varchi.length > 0) {
                    try {
                        // Elimina i varchi esistenti usando il VarcoDao
                        yield varcoDao_1.default.deleteByParcheggioId(id);
                        // Crea i nuovi varchi usando il VarcoDao
                        yield Promise.all(varchi.map((varco) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                yield varcoDao_1.default.create({
                                    tipo: varco.tipo,
                                    bidirezionale: varco.bidirezionale,
                                    id_parcheggio: id,
                                });
                            }
                            catch (varcoError) {
                                console.error('Errore durante la creazione del varco:', varcoError);
                                if (varcoError instanceof errorFactory_1.CustomHttpError) {
                                    throw varcoError;
                                }
                                else {
                                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante la creazione del varco');
                                }
                            }
                        })));
                    }
                    catch (varcoError) {
                        console.error("Errore durante l'aggiornamento dei varchi:", varcoError);
                        if (varcoError instanceof errorFactory_1.CustomHttpError) {
                            throw varcoError;
                        }
                        else {
                            throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Errore durante l'aggiornamento dei varchi");
                        }
                    }
                }
                return true;
            }
            catch (error) {
                console.error("Errore durante l'aggiornamento del parcheggio:", error);
                if (error instanceof errorFactory_1.CustomHttpError) {
                    throw error;
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Errore durante l'aggiornamento del parcheggio");
                }
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parcheggio = yield parcheggioDao_1.default.findById(id);
                if (!parcheggio) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Parcheggio non trovato');
                }
                // Elimina prima tutti i varchi associati al parcheggio usando VarcoDao
                yield varcoDao_1.default.deleteByParcheggioId(id);
                // Elimina il parcheggio
                return yield parcheggioDao_1.default.delete(id);
            }
            catch (error) {
                console.error("Errore durante l'eliminazione del parcheggio:", error);
                if (error instanceof errorFactory_1.CustomHttpError) {
                    throw error;
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, "Errore durante l'eliminazione del parcheggio");
                }
            }
        });
    }
    checkPostiDisponibili(parcheggioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parcheggio = yield parcheggioDao_1.default.findById(parcheggioId);
                if (!parcheggio) {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.RESOURCE_NOT_FOUND, 'Parcheggio non trovato');
                }
                return parcheggio.posti_disponibili > 0;
            }
            catch (error) {
                console.error('Errore durante il controllo dei posti disponibili:', error);
                if (error instanceof errorFactory_1.CustomHttpError) {
                    throw error;
                }
                else {
                    throw errorFactory_1.ErrorGenerator.generateError(errorFactory_1.ApplicationErrorTypes.SERVER_ERROR, 'Errore durante il controllo dei posti disponibili');
                }
            }
        });
    }
}
exports.default = new ParcheggioRepository();
