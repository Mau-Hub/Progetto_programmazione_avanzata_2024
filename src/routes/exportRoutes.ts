import { Router } from 'express';
import { authenticationMiddleware } from '../middleware/authenticationMiddleware';
import transitiExportController from '../controllers/transitiExportController';
import { errorHandler } from '../middleware/errorHandler';

const router = Router();

// Rotta autenticata per ottenere i transiti in formato CSV
router.get(
  '/transiti/export',
  authenticationMiddleware,
  transitiExportController.exportTransiti
);
// Rotta autenticata per ottenere le statistiche in formato JSON, CSV o PDF
router.get(
  '/statistiche',
  authenticationMiddleware,
  transitiExportController.getStatistiche
);

// Rotta autenticata per ottenere le statistiche di un parcheggio specifico
router.get(
  '/statistiche/parcheggio',
  authenticationMiddleware,
  transitiExportController.getStatistichePerParcheggio
);

router.use(errorHandler);

export default router;
