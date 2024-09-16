import PDFDocument from 'pdfkit';
import { StatisticheData } from '../repositories/statisticheRepository';

class PdfStatisticheService {
  public generaPdf(statistiche: StatisticheData[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Uint8Array[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Aggiunta titolo
      doc.fontSize(20).text('Report Statistiche', { align: 'center' });

      // Aggiungere ogni statistica
      statistiche.forEach((statistica) => {
        doc
          .fontSize(12)
          .text(`Parcheggio: ${statistica.parcheggio}`)
          .text(`Fatturato: ${statistica.fatturato}`)
          .text(`Media Posti Liberi: ${statistica.mediaPostiLiberi}`)
          .moveDown();
      });

      // Chiusura del documento
      doc.end();
    });
  }
}

export default new PdfStatisticheService();
