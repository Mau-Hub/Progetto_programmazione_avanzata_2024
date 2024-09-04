import express from 'express';
import Parcheggio from '../models/parcheggio';
import Varco from '../models/varco';
import authMiddleware from '../middleware/authentication';
import validateParcheggio from '../middleware/validation';

const router = express.Router();

// Creazione Parcheggio e Varchi - POST /parcheggi
router.post('/', authMiddleware, validateParcheggio, async (req, res) => {
  const { nome, capacita, varchi } = req.body;

  try {
    // Creazione del nuovo parcheggio
    const nuovoParcheggio = await Parcheggio.create({ nome, capacita });

    // Se ci sono varchi da associare al parcheggio
    if (varchi && varchi.length > 0) {
      const varchiCreati = await Promise.all(
        varchi.map(
          (varco: { tipo: 'INGRESSO' | 'USCITA'; bidirezionale: boolean }) =>
            Varco.create({
              tipo: varco.tipo,
              bidirezionale: varco.bidirezionale,
              id_parcheggio: nuovoParcheggio.id,
            })
        )
      );
      return res.status(201).json({ nuovoParcheggio, varchi: varchiCreati });
    }

    res.status(201).json(nuovoParcheggio);
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Errore nella creazione del parcheggio e dei varchi' });
  }
});

// Lettura Parcheggi e Varchi - GET /parcheggi
router.get('/', authMiddleware, async (req, res) => {
  try {
    const parcheggi = await Parcheggio.findAll({
      include: [{ model: Varco, as: 'varchi' }],
    });
    res.json(parcheggi);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei parcheggi' });
  }
});

// Aggiornamento Parcheggio e Varchi - PUT /parcheggi/:id
router.put('/:id', authMiddleware, validateParcheggio, async (req, res) => {
  const parcheggioId = req.params.id;
  const { nome, capacita, varchi } = req.body;

  try {
    const parcheggio = await Parcheggio.findByPk(parcheggioId);
    if (!parcheggio) {
      return res.status(404).json({ error: 'Parcheggio non trovato' });
    }

    await parcheggio.update({ nome, capacita });

    if (varchi && varchi.length > 0) {
      // Elimina i vecchi varchi
      await Varco.destroy({ where: { id_parcheggio: parcheggioId } });

      // Crea i nuovi varchi
      const varchiCreati = await Promise.all(
        varchi.map(
          (varco: { tipo: 'INGRESSO' | 'USCITA'; bidirezionale: boolean }) =>
            Varco.create({
              tipo: varco.tipo,
              bidirezionale: varco.bidirezionale,
              id_parcheggio: parcheggioId,
            })
        )
      );
      return res.json({ parcheggio, varchi: varchiCreati });
    }

    res.json(parcheggio);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Errore nell'aggiornamento del parcheggio e dei varchi" });
  }
});

// Eliminazione Parcheggio e Varchi - DELETE /parcheggi/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  const parcheggioId = req.params.id;

  try {
    const parcheggio = await Parcheggio.findByPk(parcheggioId);
    if (!parcheggio) {
      return res.status(404).json({ error: 'Parcheggio non trovato' });
    }

    // Cancella i varchi associati
    await Varco.destroy({ where: { id_parcheggio: parcheggioId } });

    // Cancella il parcheggio
    await parcheggio.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Errore nella cancellazione del parcheggio e dei varchi',
    });
  }
});

export default router;
