// src/routes/parcheggioRoutes.ts
import { Router } from 'express';
import ParcheggioController from '../controllers/ParcheggioController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateParcheggio } from '../middleware/validateMiddleware';
import ErrorHandler from '../middleware/errorHandler';

const router = Router();

router.post(
  '/',
  authMiddleware,
  validateParcheggio,
  ParcheggioController.createParcheggio
);
router.get('/', authMiddleware, ParcheggioController.getAllParcheggi);
router.get('/:id', authMiddleware, ParcheggioController.getParcheggioById);
router.put(
  '/:id',
  authMiddleware,
  validateParcheggio,
  ParcheggioController.updateParcheggio
);
router.delete('/:id', authMiddleware, ParcheggioController.deleteParcheggio);

// Gestione degli errori
router.use(ErrorHandler.handleError);

export default router;
