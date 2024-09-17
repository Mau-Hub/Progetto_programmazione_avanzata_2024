import ParcheggioDao from '../dao/parcheggioDao';
import Parcheggio from '../models/parcheggio';
import VarcoDao from '../dao/varcoDao';
import {
  ErrorGenerator,
  ApplicationErrorTypes,
  CustomHttpError,
} from '../ext/errorFactory';

interface ParcheggioData {
  nome: string;
  capacita: number;
  varchi?: { tipo: 'INGRESSO' | 'USCITA'; bidirezionale: boolean }[];
}

class ParcheggioRepository {
  async create(data: ParcheggioData): Promise<Parcheggio> {
    try {
      const { nome, capacita, varchi } = data;
      const nuovoParcheggio = await ParcheggioDao.create({
        nome,
        capacita,
        posti_disponibili: capacita,
      });

      if (varchi && varchi.length > 0) {
        await Promise.all(
          varchi.map(async (varco) => {
            try {
              await VarcoDao.create({
                tipo: varco.tipo,
                bidirezionale: varco.bidirezionale,
                id_parcheggio: nuovoParcheggio.id,
              });
            } catch (varcoError) {
              console.error(
                'Errore durante la creazione del varco:',
                varcoError
              );
              if (varcoError instanceof CustomHttpError) {
                throw varcoError;
              } else {
                throw ErrorGenerator.generateError(
                  ApplicationErrorTypes.SERVER_ERROR,
                  'Errore durante la creazione del varco'
                );
              }
            }
          })
        );
      }

      const parcheggioConVarchi = await ParcheggioDao.findById(
        nuovoParcheggio.id
      );
      if (!parcheggioConVarchi) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Parcheggio non trovato'
        );
      }

      return parcheggioConVarchi;
    } catch (error) {
      console.error('Errore durante la creazione del parcheggio:', error);
      if (error instanceof CustomHttpError) {
        throw error;
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore durante la creazione del parcheggio'
        );
      }
    }
  }

  async findById(id: number): Promise<Parcheggio | null> {
    try {
      return await ParcheggioDao.findById(id);
    } catch (error) {
      console.error('Errore durante il recupero del parcheggio per ID:', error);
      if (error instanceof CustomHttpError) {
        throw error;
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore durante il recupero del parcheggio per ID'
        );
      }
    }
  }

  async findAll(): Promise<Parcheggio[]> {
    try {
      return await ParcheggioDao.findAll();
    } catch (error) {
      console.error('Errore durante il recupero di tutti i parcheggi:', error);
      if (error instanceof CustomHttpError) {
        throw error;
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore durante il recupero di tutti i parcheggi'
        );
      }
    }
  }

  async update(id: number, data: ParcheggioData): Promise<boolean> {
    try {
      const parcheggio = await ParcheggioDao.findById(id);
      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Parcheggio non trovato'
        );
      }

      const { nome, capacita, varchi } = data;

      // Calcola la differenza di capacità
      const differenzaCapacita = capacita - parcheggio.capacita;

      // Aggiorna il parcheggio
      await ParcheggioDao.update(id, { nome, capacita });

      // Aggiorna posti_disponibili in base alla differenza di capacità
      parcheggio.posti_disponibili += differenzaCapacita;

      // Assicurati che posti_disponibili non superi la nuova capacità
      if (parcheggio.posti_disponibili > capacita) {
        parcheggio.posti_disponibili = capacita;
      }

      // Salva le modifiche
      await parcheggio.save();

      // Aggiorna i varchi se necessario
      if (varchi && varchi.length > 0) {
        try {
          // Elimina i varchi esistenti usando il VarcoDao
          await VarcoDao.deleteByParcheggioId(id);

          // Crea i nuovi varchi usando il VarcoDao
          await Promise.all(
            varchi.map(async (varco) => {
              try {
                await VarcoDao.create({
                  tipo: varco.tipo,
                  bidirezionale: varco.bidirezionale,
                  id_parcheggio: id,
                });
              } catch (varcoError) {
                console.error(
                  'Errore durante la creazione del varco:',
                  varcoError
                );
                if (varcoError instanceof CustomHttpError) {
                  throw varcoError;
                } else {
                  throw ErrorGenerator.generateError(
                    ApplicationErrorTypes.SERVER_ERROR,
                    'Errore durante la creazione del varco'
                  );
                }
              }
            })
          );
        } catch (varcoError) {
          console.error(
            "Errore durante l'aggiornamento dei varchi:",
            varcoError
          );
          if (varcoError instanceof CustomHttpError) {
            throw varcoError;
          } else {
            throw ErrorGenerator.generateError(
              ApplicationErrorTypes.SERVER_ERROR,
              "Errore durante l'aggiornamento dei varchi"
            );
          }
        }
      }

      return true;
    } catch (error) {
      console.error("Errore durante l'aggiornamento del parcheggio:", error);
      if (error instanceof CustomHttpError) {
        throw error;
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          "Errore durante l'aggiornamento del parcheggio"
        );
      }
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const parcheggio = await ParcheggioDao.findById(id);
      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Parcheggio non trovato'
        );
      }

      // Elimina prima tutti i varchi associati al parcheggio usando VarcoDao
      await VarcoDao.deleteByParcheggioId(id);

      // Elimina il parcheggio
      return await ParcheggioDao.delete(id);
    } catch (error) {
      console.error("Errore durante l'eliminazione del parcheggio:", error);
      if (error instanceof CustomHttpError) {
        throw error;
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          "Errore durante l'eliminazione del parcheggio"
        );
      }
    }
  }

  async checkPostiDisponibili(parcheggioId: number): Promise<boolean> {
    try {
      const parcheggio = await ParcheggioDao.findById(parcheggioId);
      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Parcheggio non trovato'
        );
      }
      return parcheggio.posti_disponibili > 0;
    } catch (error) {
      console.error(
        'Errore durante il controllo dei posti disponibili:',
        error
      );
      if (error instanceof CustomHttpError) {
        throw error;
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          'Errore durante il controllo dei posti disponibili'
        );
      }
    }
  }
}

export default new ParcheggioRepository();
