import { Router } from 'express';
import TariffaController from '../controllers/tariffaController';
import { authenticationMiddleware } from '../middleware/authenticationMiddleware';
import { errorHandler } from '../middleware/errorHandler';

const router = Router();

// Middleware di autenticazione per tutte le rotte
router.use(authenticationMiddleware);

// CRUD per la gestione delle tariffe
router.post('/tariffa', TariffaController.createTariffa); // Creazione di una tariffa
router.get('/tariffe', TariffaController.getAllTariffe); // Acquisizione di tutte le tariffe
router.get('/tariffa/:id', TariffaController.getTariffaById); // Acquisizone di una tariffa per ID
router.put('/tariffa/:id', TariffaController.updateTariffa); // Aggiornamento di una tariffa
router.delete('/tariffa/:id', TariffaController.deleteTariffa); // Eliminazione di una tariffa

// Gestione degli errori
router.use(errorHandler);

export default router;
