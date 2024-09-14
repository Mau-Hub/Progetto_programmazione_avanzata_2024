import tariffaDao from '../dao/tariffaDao';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import varcoDao from '../dao/varcoDao';
import transitoDao from '../dao/transitoDao';
import Veicolo from '../models/veicolo';

class TransitoService {
  public calcolaDurataInOre(ingresso: Date, uscita: Date): number {
    const durataInMs = uscita.getTime() - ingresso.getTime();
    return durataInMs / (1000 * 60 * 60);
  }

  public determinaFerialeFestivo(data: Date): 'FERIALE' | 'FESTIVO' {
    const giornoSettimana = data.getDay();
    return giornoSettimana === 0 || giornoSettimana === 6 // Domenica o Sabato
      ? 'FESTIVO'
      : 'FERIALE';
  }

  public determinaFasciaOraria(data: Date): 'DIURNA' | 'NOTTURNA' {
    const ora = data.getHours();
    return ora >= 8 && ora < 20 ? 'DIURNA' : 'NOTTURNA';
  }

  async calcolaImporto(
    transitoId: number,
    dataOraUscita: Date
  ): Promise<number> {
    try {
      const transito = await transitoDao.findById(transitoId, {
        include: [{ model: Veicolo, as: 'veicolo' }],
      });

      if (!transito) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Transito non trovato'
        );
      }

      // Inserisci qui il controllo per transito.veicolo
      if (!transito.veicolo) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Veicolo associato al transito non trovato'
        );
      }

      // Ora puoi accedere a transito.veicolo.id_tipo_veicolo senza errori
      const idTipoVeicolo = transito.veicolo.id_tipo_veicolo;

      const varcoIngresso = await varcoDao.findById(transito.id_varco_ingresso);

      if (!varcoIngresso) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Varco di ingresso non trovato'
        );
      }

      // Determina la fascia oraria e il giorno per ingresso e uscita
      const fasciaOrariaIngresso = this.determinaFasciaOraria(
        transito.ingresso
      );
      const fasciaOrariaUscita = this.determinaFasciaOraria(dataOraUscita);
      const giornoIngresso = this.determinaFerialeFestivo(transito.ingresso);
      const giornoUscita = this.determinaFerialeFestivo(dataOraUscita);

      const tariffa = await tariffaDao.findOne({
        where: {
          id_tipo_veicolo: idTipoVeicolo,
          fascia_oraria: fasciaOrariaUscita, // Usando fascia oraria dell'uscita
          feriale_festivo: giornoUscita, // Usando giorno dell'uscita
          id_parcheggio: varcoIngresso.id_parcheggio,
        },
      });

      if (!tariffa) {
        throw ErrorGenerator.generateError(
          ApplicationErrorTypes.RESOURCE_NOT_FOUND,
          'Tariffa non disponibile per questo transito'
        );
      }

      // Aggiorna l'id_tariffa solo una volta
      transito.id_tariffa = tariffa.id;
      await transito.save();

      const durataInOre = this.calcolaDurataInOre(
        transito.ingresso,
        dataOraUscita
      );

      // Usa la stessa tariffa per tutto il periodo se la tariffa è la stessa
      const importoOrarioIngresso =
        tariffa.fascia_oraria === fasciaOrariaIngresso &&
        tariffa.feriale_festivo === giornoIngresso
          ? tariffa.importo
          : 0;

      const importoOrarioUscita =
        tariffa.fascia_oraria === fasciaOrariaUscita &&
        tariffa.feriale_festivo === giornoUscita
          ? tariffa.importo
          : 0;

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
