import { Router } from 'express';
import TransitoController from '../controllers/transitoController';
import {
  authenticationMiddleware,
  authorizeRoles,
} from '../middleware/authenticationMiddleware';
import { errorHandler } from '../middleware/errorHandler';
import validationMiddleware from '../middleware/validationMiddleware';

const router = Router();

// Middleware di autenticazione per tutte le rotte
router.use(authenticationMiddleware);

// Creazione di un nuovo transito (ingresso)
router.post(
  '/transito',
  authorizeRoles(['operatore', 'varco']),
  TransitoController.createTransito
);

// Recupero di un transito per ID
router.get(
  '/transito/:id',
  authorizeRoles(['operatore']),
  TransitoController.getTransitoById
);

// Aggiornamento di un transito (uscita) e calcolo della tariffa
router.put(
  '/transito/:id/uscita',
  authorizeRoles(['operatore']),
  TransitoController.exitTransito
);

// Eliminazione di un transito per ID
router.delete(
  '/transito/:id',
  authorizeRoles(['operatore']),
  TransitoController.deleteTransito
);

// Gestione degli errori
router.use(errorHandler);

export default router;
