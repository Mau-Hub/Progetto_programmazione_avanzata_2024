"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGiornoSettimanaString = getGiornoSettimanaString;
// Funzione di utilità per mapping dei giorni della settimana
function getGiornoSettimanaString(dayNumber) {
    const giorniSettimana = [
        'DOMENICA', // 0
        'LUNEDI', // 1
        'MARTEDI', // 2
        'MERCOLEDI', // 3
        'GIOVEDI', // 4
        'VENERDI', // 5
        'SABATO' // 6
    ];
    return giorniSettimana[dayNumber];
}
