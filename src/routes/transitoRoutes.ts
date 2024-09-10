import { Router } from 'express';
import TransitoController from '../controllers/transitoController'; 
import { authenticationMiddleware, authorizeRoles } from '../middleware/authenticationMiddleware'; 
import { errorHandler } from '../middleware/errorHandler'; 

const router = Router();

// Middleware di autenticazione per tutte le rotte
router.use(authenticationMiddleware);

// Creazione di un transito (accessibile a operatore o varco)
router.post('/transito', authorizeRoles(['operatore', 'varco']), TransitoController.createTransito);

// Ottenere un transito specifico (solo operatore)
router.get('/transito/:id', authorizeRoles(['operatore']), TransitoController.getTransitoById);

// Aggiornare un transito (solo operatore)
router.put('/transito/:id', authorizeRoles(['operatore']), TransitoController.updateTransito);

// Eliminare un transito (solo operatore)
router.delete('/transito/:id', authorizeRoles(['operatore']), TransitoController.deleteTransito);

// Gestione degli errori
router.use(errorHandler);

export default router;
