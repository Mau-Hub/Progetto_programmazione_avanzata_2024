import { Router } from 'express';
import VarcoController from '../controllers/varcoController';
import validationMiddleware from '../middleware/validationMiddleware';
import {
  authenticationMiddleware,
  authorizeRoles,
} from '../middleware/authenticationMiddleware';
import { errorHandler } from '../middleware/errorHandler';

const router = Router();

// Middleware di autenticazione applicato a tutte le rotte
router.use(authenticationMiddleware);

router.post(
  '/varco',
  authorizeRoles(['operatore']),
  validationMiddleware.validateVarco,
  VarcoController.createVarco
);
router.get(
  '/varchi',
  authorizeRoles(['operatore']),
  VarcoController.getAllVarchi
);
router.get(
  '/varco/:id',
  authorizeRoles(['operatore']),
  VarcoController.getVarcoById
);
router.put(
  '/varco/:id',
  authorizeRoles(['operatore']),
  validationMiddleware.validateVarco,
  VarcoController.updateVarco
);
router.delete(
  '/varco/:id',
  authorizeRoles(['operatore']),
  VarcoController.deleteVarco
);

// Gestione degli errori
router.use(errorHandler);

export default router;
