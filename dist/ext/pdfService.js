"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfkit_1 = __importDefault(require("pdfkit"));
class PdfService {
    generaPdf(transiti) {
        const doc = new pdfkit_1.default();
        const buffers = [];
        // Impostiamo un buffer per il flusso del PDF
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            return pdfData;
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
                .text(`Costo: ${transito.costo !== null ? transito.costo + ' €' : 'N/A'}`)
                .moveDown();
        });
        // Chiusura del documento
        doc.end();
        return Buffer.concat(buffers); // Restituisce il buffer del PDF
    }
}
exports.default = new PdfService();
