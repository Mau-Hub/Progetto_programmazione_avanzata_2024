import { Router } from 'express';
import VarcoController from '../controllers/varcoController'; 
import validationMiddleware from '../middleware/validationMiddleware';
import { authenticationMiddleware, authorizeRoles } from '../middleware/authenticationMiddleware';
import { errorHandler } from '../middleware/errorHandler';


const router = Router();

// Middleware di autenticazione applicato a tutte le rotte
router.use(authenticationMiddleware);

// Solo gli utenti con ruolo "operatore" possono gestire i varchi
router.post('/varco', authorizeRoles(['operatore']), validationMiddleware.validateVarco, VarcoController.createVarco); // Creazione di un varco
router.get('/varchi', authorizeRoles(['operatore']), VarcoController.getAllVarchi); // Ottenere tutti i varchi
router.get('/varco/:id', authorizeRoles(['operatore']), VarcoController.getVarcoById); // Ottenere un varco per ID
router.put('/varco/:id', authorizeRoles(['operatore']), validationMiddleware.validateVarco, VarcoController.updateVarco); // Aggiornamento di un varco
router.delete('/varco/:id', authorizeRoles(['operatore']), VarcoController.deleteVarco); // Eliminazione di un varco

// Gestione degli errori
router.use(errorHandler);

export default router;
