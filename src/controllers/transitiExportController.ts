import { Request, Response, NextFunction } from 'express';
import CsvService from '../ext/csvService';
import PdfService from '../ext/pdfService';
import TransitoExportRepository from '../repositories/transitoExportRepository';

class TransitiExportController {
  // Rotta per ottenere i transiti in formato CSV o PDF
  public async exportTransiti(req: Request, res: Response, next: NextFunction) {
    try {
      const { targhe, from, to, formato } = req.query;

      if (!targhe || !from || !to) {
        return res.status(400).json({ message: 'Targhe, from e to sono richiesti' });
      }

      // Ottenere i transiti dal repository
      const transiti = await TransitoExportRepository.findTransitiByTargheAndPeriodo(
        targhe as string[],
        new Date(from as string),
        new Date(to as string)
      );

      if (transiti.length === 0) {
        return res.status(404).json({ message: 'Nessun transito trovato per i parametri forniti' });
      }

      // Generazione del file in base al formato specificato
      if (formato === 'csv') {
        const csv = await CsvService.generaCsv(transiti);
        res.header('Content-Type', 'text/csv');
        res.attachment('transiti.csv');
        return res.send(csv);
      } else if (formato === 'pdf') {
        const pdf = await PdfService.generaPdf(transiti);
        res.header('Content-Type', 'application/pdf');
        res.attachment('transiti.pdf');
        return res.send(pdf);
      } else {
        return res.status(400).json({ message: 'Formato non supportato. Usa "csv" o "pdf".' });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new TransitiExportController();
