import { Router } from 'express';
import TariffaController from '../controllers/tariffaController';
import { authenticationMiddleware } from '../middleware/authenticationMiddleware';
import { errorHandler } from '../middleware/errorHandler';
import { authorizeRoles } from '../middleware/authenticationMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';

const router = Router();

// Middleware di autenticazione per tutte le rotte
router.use(authenticationMiddleware);

// CRUD per la gestione delle tariffe
router.post(
  '/tariffa',
  authorizeRoles(['operatore']),
  validationMiddleware.validateTariffa,
  TariffaController.createTariffa
);
router.get(
  '/tariffe',
  authorizeRoles(['operatore']),
  TariffaController.getAllTariffe
);
router.get(
  '/tariffa/:id',
  authorizeRoles(['operatore']),
  validationMiddleware.validateIdParam,
  TariffaController.getTariffaById
);
router.put(
  '/tariffa/:id',
  authorizeRoles(['operatore']),
  validationMiddleware.validateIdParam,
  validationMiddleware.validateTariffa,
  TariffaController.updateTariffa
);
router.delete(
  '/tariffa/:id',
  authorizeRoles(['operatore']),
  validationMiddleware.validateIdParam,
  TariffaController.deleteTariffa
);

// Gestione degli errori
router.use(errorHandler);

export default router;
