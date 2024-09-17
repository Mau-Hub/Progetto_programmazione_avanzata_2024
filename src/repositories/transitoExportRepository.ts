import transitoDao from '../dao/transitoDao';
import veicoloDao from '../dao/veicoloDao';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { Op } from 'sequelize';

interface TransitoData {
  targa: string;
  ingresso: Date;
  uscita: Date;
  tipoVeicolo: string;
  costo: number | null;
}

class TransitoExportRepository {
  public async findTransitiByTargheAndPeriodo(
    targhe: string[],
    from: Date,
    to: Date,
    userId: number | null,
    userRole: string
  ): Promise<TransitoData[]> {
    try {
      let targheFiltrate = targhe;

      // Se l'utente è un automobilista, deve vedere solo i veicoli a lui associati
      if (userRole === 'automobilista') {
        // Trova tutti i veicoli associati all'utente autenticato
        const veicoliAssociati = await veicoloDao.findAll({
          where: { id_utente: userId },
        });

        // Ottieni le targhe dei veicoli associati all'utente
        const targheUtente = veicoliAssociati.map((veicolo) => veicolo.targa);

        // Filtra le targhe richieste in base ai veicoli associati all'utente
        targheFiltrate = targhe.filter((targa) => targheUtente.includes(targa));

        // Se l'automobilista non ha accesso ad alcuna delle targhe specificate, genera un errore
        if (targheFiltrate.length === 0) {
          throw ErrorGenerator.generateError(
            ApplicationErrorTypes.ACCESS_DENIED,
            'Non puoi visualizzare i transiti per le targhe specificate.'
          );
        }
      }

      // Recupera i transiti filtrati per targa e periodo
      const transiti = await transitoDao.findAll({
        where: {
          '$veicolo.targa$': {
            [Op.in]: targheFiltrate,
          },
          ingresso: {
            [Op.gte]: from,
            [Op.lte]: to,
          },
          [Op.or]: [{ uscita: { [Op.lte]: to } }, { uscita: null }],
        },
        include: ['veicolo', 'varcoIngresso', 'varcoUscita', 'tariffa'],
      });

      // Mappa i dati per l'export e include il tipoVeicolo
      return await Promise.all(
        transiti.map(async (transito: any) => {
          const veicolo = await veicoloDao.findByIdWithTipoVeicolo(
            transito.id_veicolo
          );
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
        })
      );
    } catch (error) {
      console.error('Errore nel recupero dei transiti:', error);
      throw ErrorGenerator.generateError(
        ApplicationErrorTypes.SERVER_ERROR,
        'Errore nel recupero dei transiti'
      );
    }
  }
}

export default new TransitoExportRepository();
