import { Router } from 'express';
import TransitoController from '../controllers/transitoController'; 
import { authenticationMiddleware, authorizeRoles } from '../middleware/authenticationMiddleware'; 
import { errorHandler } from '../middleware/errorHandler'; 
import validationMiddleware from '../middleware/validationMiddleware';

const router = Router();

// Middleware di autenticazione per tutte le rotte
router.use(authenticationMiddleware);


router.post('/transito', authorizeRoles(['operatore', 'varco']), validationMiddleware.validateTransito, TransitoController.createTransito);
router.get('/transito/:id', authorizeRoles(['operatore']), TransitoController.getTransitoById);
router.put('/transito/:id', authorizeRoles(['operatore']), validationMiddleware.validateTransito, TransitoController.updateTransito);
router.delete('/transito/:id', authorizeRoles(['operatore']), TransitoController.deleteTransito);

// Gestione degli errori
router.use(errorHandler);

export default router;
