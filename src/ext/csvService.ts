import { writeToString } from 'fast-csv';

interface TransitoData {
  targa: string;
  ingresso: Date;
  uscita: Date;
  tipoVeicolo: string;
  costo: number | null;  // il costo potrebbe essere null se non è ancora disponibile
}

class CsvService {
  public async generaCsv(transiti: TransitoData[]): Promise<string> {
    try {
      const csv = await writeToString(transiti, {
        headers: true,  
      });
      return csv;
    } catch (error) {
      console.error('Errore nella generazione del CSV:', error);
      throw new Error('Errore nella generazione del CSV');
    }
  }
}

export default new CsvService();
