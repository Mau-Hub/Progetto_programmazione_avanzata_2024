import transitoDao from '../dao/transitoDao';
import veicoloDao from '../dao/veicoloDao';
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
    to: Date
  ): Promise<TransitoData[]> {
    try {
      // Recupera i transiti filtrati per targa e periodo
      const transiti = await transitoDao.findAll({
        where: {
          '$veicolo.targa$': {
            [Op.in]: targhe,
          },
          ingresso: {
            [Op.gte]: from,
          },
          uscita: {
            [Op.lte]: to,
          },
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
      throw new Error('Errore nel recupero dei transiti');
    }
  }
}

export default new TransitoExportRepository();
