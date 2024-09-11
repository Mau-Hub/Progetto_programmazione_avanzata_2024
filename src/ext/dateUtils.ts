// Funzione di utilità per mapping dei giorni della settimana
export function getGiornoSettimanaString(dayNumber: number): string {
    const giorniSettimana = [
      'DOMENICA', // 0
      'LUNEDI',   // 1
      'MARTEDI',  // 2
      'MERCOLEDI',// 3
      'GIOVEDI',  // 4
      'VENERDI',  // 5
      'SABATO'    // 6
    ];
    
    return giorniSettimana[dayNumber];
  }
  