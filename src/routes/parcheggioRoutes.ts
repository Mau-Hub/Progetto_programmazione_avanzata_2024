import { Router } from 'express';
import ParcheggioController from '../controllers/parcheggioController';
import { authenticationMiddleware } from '../middleware/authenticationMiddleware';
import { errorHandler } from '../middleware/errorHandler';
import { authorizeRoles } from '../middleware/authenticationMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';

const router = Router();

// Serve per applicare il middleware di autenticazione a tutte le rotte
router.use(authenticationMiddleware);

router.post(
  '/parcheggio',
  authorizeRoles(['operatore']),
  validationMiddleware.validateParcheggio,
  ParcheggioController.createParcheggio
);
router.get(
  '/parcheggi',
  authorizeRoles(['operatore']),
  ParcheggioController.getAllParcheggi
);
router.get(
  '/parcheggio/:id',
  authorizeRoles(['operatore']),
  validationMiddleware.validateIdParam,
  ParcheggioController.getParcheggioById
);
router.put(
  '/parcheggio/:id',
  authorizeRoles(['operatore']),
  validationMiddleware.validateIdParam,
  validationMiddleware.validateParcheggio,
  ParcheggioController.updateParcheggio
);
router.delete(
  '/parcheggio/:id',
  authorizeRoles(['operatore']),
  validationMiddleware.validateIdParam,
  ParcheggioController.deleteParcheggio
);

// Gestione degli errori
router.use(errorHandler);

export default router;
