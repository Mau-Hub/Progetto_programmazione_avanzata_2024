import { writeToString } from 'fast-csv';
import { StatisticheData } from '../repositories/statisticheRepository';

class CsvStatisticheService {
  public async generaCsv(statistiche: StatisticheData[]): Promise<string> {
    try {
      const csv = await writeToString(statistiche, {
        headers: true,
      });
      return csv;
    } catch (error) {
      console.error(
        'Errore nella generazione del CSV delle statistiche:',
        error
      );
      throw new Error('Errore nella generazione del CSV delle statistiche');
    }
  }
}

export default new CsvStatisticheService();
