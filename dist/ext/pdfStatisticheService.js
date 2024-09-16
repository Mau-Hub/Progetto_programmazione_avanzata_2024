"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfkit_1 = __importDefault(require("pdfkit"));
class PdfStatisticheService {
    generaPdf(statistiche) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default();
            const buffers = [];
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
exports.default = new PdfStatisticheService();
