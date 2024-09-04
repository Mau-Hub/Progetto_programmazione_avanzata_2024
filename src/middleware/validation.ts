import { Request, Response, NextFunction } from 'express';

const validateParcheggio = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { nome, capacita, varchi } = req.body;

  if (!nome || typeof capacita !== 'number' || capacita <= 0) {
    return res.status(400).json({ error: 'Nome e capacità sono obbligatori' });
  }

  if (varchi && !Array.isArray(varchi)) {
    return res.status(400).json({ error: 'I varchi devono essere un array' });
  }

  if (varchi) {
    for (const varco of varchi) {
      if (
        !['INGRESSO', 'USCITA'].includes(varco.tipo) ||
        typeof varco.bidirezionale !== 'boolean'
      ) {
        return res.status(400).json({
          error:
            'Ogni varco deve avere un tipo valido e un valore bidirezionale booleano',
        });
      }
    }
  }

  next();
};

export default validateParcheggio;
