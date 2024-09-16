import { Router } from 'express';
import UtenteController from '../controllers/utenteController';
import { errorHandler } from '../middleware/errorHandler';

const router = Router();

// Rotta per ottenere tutti gli utenti
router.get('/utenti', UtenteController.getAllUtenti);

// Gestione degli errori
router.use(errorHandler);

export default router;
