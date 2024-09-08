import { Request, Response, NextFunction } from 'express';

const validateParcheggio = (req: Request, res: Response, next: NextFunction) => {
  const { nome, capacita, varchi } = req.body;

  // Verifica che 'nome' sia presente e sia una stringa
  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ error: 'Nome è obbligatorio e deve essere una stringa valida' });
  }

  // Verifica che 'capacita' sia un numero intero positivo
  if (typeof capacita !== 'number' || !Number.isInteger(capacita) || capacita <= 0) {
    return res.status(400).json({ error: 'Capacità è obbligatoria e deve essere un numero intero positivo' });
  }

  // Verifica che 'varchi' sia un array (se fornito)
  if (varchi && !Array.isArray(varchi)) {
    return res.status(400).json({ error: 'I varchi devono essere un array' });
  }

  // Verifica la validità di ciascun 'varco'
  if (varchi) {
    for (const varco of varchi) {
      // Controlla che il tipo sia 'INGRESSO' o 'USCITA' e che bidirezionale sia booleano
      if (!['INGRESSO', 'USCITA'].includes(varco.tipo) || typeof varco.bidirezionale !== 'boolean') {
        return res.status(400).json({
          error:
            'Ogni varco deve avere un tipo valido ("INGRESSO" o "USCITA") e un valore bidirezionale booleano',
        });
      }
    }
  }

  // Se tutti i controlli sono passati, passa al prossimo middleware
  next();
};

const validateVarco = (req: Request, res: Response, next: NextFunction) => {
  const { tipo, bidirezionale, id_parcheggio } = req.body;

  // Verifica che 'tipo' sia presente e sia 'INGRESSO' o 'USCITA'
  if (!tipo || !['INGRESSO', 'USCITA'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo è obbligatorio e deve essere "INGRESSO" o "USCITA"' });
  }

  // Verifica che 'bidirezionale' sia booleano
  if (typeof bidirezionale !== 'boolean') {
    return res.status(400).json({ error: 'Bidirezionale è obbligatorio e deve essere un valore booleano (true o false)' });
  }

  // Verifica che 'id_parcheggio' esista e sia un numero intero positivo
  if (!id_parcheggio || typeof id_parcheggio !== 'number' || !Number.isInteger(id_parcheggio) || id_parcheggio <= 0) {
    return res.status(400).json({ error: 'id_parcheggio è obbligatorio e deve essere un numero intero positivo' });
  }


  next();
};

const validateTariffa = (req: Request, res: Response, next: NextFunction) => {
  const {
    id_tipo_veicolo,
    importo,
    fascia_oraria,
    giorno_settimana,
    id_parcheggio,
    id_utente,
    feriale_festivo,  //da controllare
  } = req.body;

  // Verifica che l'id del tipi di veicolo sia un numero intero positivo
  if (
    !id_tipo_veicolo ||
    typeof id_tipo_veicolo !== 'number' ||
    !Number.isInteger(id_tipo_veicolo) ||
    id_tipo_veicolo <= 0
  ) {
    return res
      .status(400)
      .json({ error: "'id_tipo_veicolo' è obbligatorio e deve essere un numero intero positivo" });
  }

  // Verifica che 'importo' sia un numero positivo
  if (typeof importo !== 'number' || importo <= 0) {
    return res.status(400).json({ error: "'importo' è obbligatorio e deve essere un numero positivo" });
  }

  // Verifica che 'fascia_oraria' sia valida (DIURNA o NOTTURNA)
  if (!['DIURNA', 'NOTTURNA'].includes(fascia_oraria)) {
    return res.status(400).json({ error: "'fascia_oraria' deve essere 'DIURNA' o 'NOTTURNA'" });
  }

  // Verifica che 'giorno_settimana' sia valido
  const validiGiorniSettimana = [
    'LUNEDI',
    'MARTEDI',
    'MERCOLEDI',
    'GIOVEDI',
    'VENERDI',
    'SABATO',
    'DOMENICA',
  ];
  
  if (!validiGiorniSettimana.includes(giorno_settimana)) {
    return res
      .status(400)
      .json({ error: `'giorno_settimana' non valido. Valori ammessi: ${validiGiorniSettimana.join(', ')}` });
  }

  // Verifica che 'id_parcheggio' sia un numero intero positivo
  if (
    !id_parcheggio ||
    typeof id_parcheggio !== 'number' ||
    !Number.isInteger(id_parcheggio) ||
    id_parcheggio <= 0
  ) {
    return res
      .status(400)
      .json({ error: "'id_parcheggio' è obbligatorio e deve essere un numero intero positivo" });
  }

  // Verifica che 'id_utente' sia un numero intero positivo
  if (
    !id_utente ||
    typeof id_utente !== 'number' ||
    !Number.isInteger(id_utente) ||
    id_utente <= 0
  ) {
    return res
      .status(400)
      .json({ error: "'id_utente' è obbligatorio e deve essere un numero intero positivo" });
  }

  // Verifica che 'feriale_festivo' sia valido
  if (!['FERIALE', 'FESTIVO'].includes(feriale_festivo)) {
    return res.status(400).json({
      error: "'feriale_festivo' deve essere 'FERIALE' o 'FESTIVO'",
    });
  }

  next();
};

export default {
  validateParcheggio,
  validateVarco,
  validateTariffa
};
