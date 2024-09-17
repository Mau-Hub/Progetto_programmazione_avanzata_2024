import PDFDocument from 'pdfkit';

interface TransitoData {
  targa: string;
  ingresso: Date;
  uscita: Date;
  tipoVeicolo: string;
  costo: number | null;
}

class PdfService {
  public generaPdf(transiti: TransitoData[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Uint8Array[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Aggiunta titolo
      doc.fontSize(20).text('Report Transiti', { align: 'center' });

      // Aggiungere ogni transito
      transiti.forEach((transito) => {
        doc
          .fontSize(12)
          .text(`Targa: ${transito.targa}`)
          .text(`Ingresso: ${transito.ingresso}`)
          .text(`Uscita: ${transito.uscita}`)
          .text(`Tipo Veicolo: ${transito.tipoVeicolo}`)
          .text(
            `Costo: ${transito.costo !== null ? transito.costo + ' €' : 'N/A'}`
          )
          .moveDown();
      });

      // Chiusura del documento
      doc.end();
    });
  }
}

export default new PdfService();
