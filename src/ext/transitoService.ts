import Transito from '../models/transito';
import Tariffa from '../models/tariffa';
import { getGiornoSettimanaString } from '../ext/dateUtils';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';

class TransitoService {
  /**
   * Calcola la durata del transito in ore.
   *
   * @param ingresso - Data e ora di ingresso
   * @param uscita - Data e ora di uscita
   * @returns La durata in ore
   */
  public calcolaDurataInOre(ingresso: Date, uscita: Date): number {
    const durataInMs = uscita.getTime() - ingresso.getTime();
    return durataInMs / (1000 * 60 * 60); // Durata in ore
  }

  /**
   * Determina se un giorno è festivo o feriale.
   *
   * @param giornoSettimana - Stringa rappresentante il giorno della settimana
   * @returns 'FERIALE' o 'FESTIVO'
   */
  public determinaFerialeFestivo(
    giornoSettimana: string
  ): 'FERIALE' | 'FESTIVO' {
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
  async calcolaImporto(
    transitoId: number,
    dataOraUscita: Date
  ): Promise<number> {
    try {
      const transito = await Transito.findByPk(transitoId);

      if (!transito) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Transito non trovato'
        );
      }

      // Recupera la tariffa dal TariffaRepository
      const tariffa = await Tariffa.findByPk(transito.id_tariffa);

      if (!tariffa) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Tariffa non trovata'
        );
      }

      // Calcolo della durata in ore
      const durataInMs = dataOraUscita.getTime() - transito.ingresso.getTime();
      const durataInOre = durataInMs / (1000 * 60 * 60);

      // Funzione per determinare la fascia oraria in base all'orario
      const determinaFasciaOraria = (data: Date): 'DIURNA' | 'NOTTURNA' => {
        const ora = data.getHours();
        return ora >= 8 && ora < 20 ? 'DIURNA' : 'NOTTURNA';
      };

      // Calcolo della tariffa per l'intervallo di ingresso e uscita
      const fasciaIngresso = determinaFasciaOraria(transito.ingresso);
      const fasciaUscita = determinaFasciaOraria(dataOraUscita);

      const importoOrarioIngresso =
        tariffa.fascia_oraria === fasciaIngresso &&
        tariffa.feriale_festivo ===
          getGiornoSettimanaString(transito.ingresso.getDay())
          ? tariffa.importo
          : 0;

      const importoOrarioUscita =
        tariffa.fascia_oraria === fasciaUscita &&
        tariffa.feriale_festivo ===
          getGiornoSettimanaString(dataOraUscita.getDay())
          ? tariffa.importo
          : 0;

      // Calcolo dell'importo totale
      const importoTotale =
        (importoOrarioIngresso + importoOrarioUscita) * durataInOre;
      return importoTotale;
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          `Errore nel calcolo dell'importo: ${error.message}`
        );
      } else {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.SERVER_ERROR,
          "Errore sconosciuto nel calcolo dell'importo"
        );
      }
    }
  }
}

export default new TransitoService();
