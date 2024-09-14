import transitoDao from '../dao/transitoDao';
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
          targa: {
            [Op.in]: targhe,
          },
          ingresso: {
            [Op.gte]: from,
          },
          uscita: {
            [Op.lte]: to,
          },
        },
        include: ['veicolo', 'varcoIngresso', 'varcoUscita'],
      });

      // Mappa i dati per l'export
      return transiti.map((transito: any) => ({
        targa: transito.veicolo.targa,
        ingresso: transito.ingresso,
        uscita: transito.uscita,
        tipoVeicolo: transito.veicolo.tipoVeicolo.nome,
        costo: transito.importo || null,
      }));
    } catch (error) {
      console.error('Errore nel recupero dei transiti:', error);
      throw new Error('Errore nel recupero dei transiti');
    }
  }
}

export default new TransitoExportRepository();
