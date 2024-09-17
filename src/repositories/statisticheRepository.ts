import { Op } from 'sequelize';
import transitoDao from '../dao/transitoDao';
import parcheggioDao from '../dao/parcheggioDao';
import veicoloDao from '../dao/veicoloDao';
import transitoService from '../ext/transitoService';
import { ApplicationErrorTypes, ErrorGenerator } from '../ext/errorFactory';
import { CustomHttpError } from '../ext/errorFactory';

export interface StatisticheData {
  parcheggio: string;
  fatturato: number;
  mediaPostiLiberi: number;
}

class StatisticheRepository {
  public async calcolaStatistiche(
    from: Date,
    to: Date
  ): Promise<StatisticheData[]> {
    try {
      // Recupera tutti i parcheggi
      const parcheggi = await parcheggioDao.findAll();

      const statistiche = await Promise.all(
        parcheggi.map(async (parcheggio) => {
          // Calcola il fatturato per ciascun parcheggio
          const transiti = await transitoDao.findAll({
            where: {
              ingresso: {
                [Op.gte]: from,
              },
              uscita: {
                [Op.lte]: to,
              },
              '$varcoIngresso.id_parcheggio$': parcheggio.id,
            },
            include: ['varcoIngresso'],
          });

          const fatturato = transiti.reduce((totale, transito) => {
            return totale + (transito.importo || 0);
          }, 0);

          const mediaPostiLiberi = await this.calcolaMediaPostiLiberi(
            parcheggio.id,
            from,
            to
          );

          return {
            parcheggio: parcheggio.nome,
            fatturato,
            mediaPostiLiberi,
          };
        })
      );

      return statistiche;
    } catch (error) {
      console.error('Errore nel calcolo delle statistiche:', error);
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel calcolo delle statistiche'
      );
    }
  }

  private async calcolaMediaPostiLiberi(
    idParcheggio: number,
    from: Date,
    to: Date
  ): Promise<number> {
    try {
      const parcheggio = await parcheggioDao.findById(idParcheggio);
      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Parcheggio non trovato'
        );
      }

      const capacitaTotale = parcheggio.capacita;

      const transiti = await transitoDao.findAll({
        where: {
          ingresso: {
            [Op.gte]: from,
          },
          uscita: {
            [Op.lte]: to,
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
    } catch (error) {
      console.error('Errore nel calcolo della media dei posti liberi:', error);
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel calcolo della media dei posti liberi'
      );
    }
  }

  public async calcolaStatistichePerParcheggio(
    idParcheggio: number,
    from: Date,
    to: Date
  ): Promise<any> {
    try {
      // Controlla se il parcheggio esiste nel database
      const parcheggio = await parcheggioDao.findById(idParcheggio);
      if (!parcheggio) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Parcheggio non trovato nel database'
        );
      }
      const transiti = await transitoDao.findAll({
        where: {
          ingresso: {
            [Op.gte]: from,
          },
          uscita: {
            [Op.lte]: to,
          },
          '$varcoIngresso.id_parcheggio$': idParcheggio,
        },
        include: ['varcoIngresso'],
      });

      const numeroTotaleTransiti = transiti.length;

      const transitiPerTipoVeicolo: Record<string, number> = {};

      for (const transito of transiti) {
        const veicolo = await veicoloDao.findById(transito.id_veicolo);
        if (!veicolo) {
          throw ErrorGenerator.generateError(
            ApplicationErrorTypes.RESOURCE_NOT_FOUND,
            'Veicolo non trovato per il transito (statistiche)'
          );
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
        const fasciaOraria = transitoService.determinaFasciaOraria(
          transito.ingresso
        );
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
    } catch (error) {
      console.error('Errore nel calcolo delle statistiche:', error);

      // Se l'errore è un CustomHttpError, rilancialo
      if (error instanceof CustomHttpError) {
        throw error;
      }

      // Altrimenti, lancia un errore generico
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel calcolo delle statistiche'
      );
    }
  }
}
export default new StatisticheRepository();
