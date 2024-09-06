import { Router } from 'express';
import ParcheggioController from '../controllers/parcheggioController';
import { authenticationMiddleware } from '../middleware/authenticationMiddleware';
import { validateUsername } from '../middleware/validationMiddleware';
import { ErrorGenerator, ApplicationErrorTypes } from '../ext/errorFactory';
import { errorHandler } from '../middleware/errorHandler';

const router = Router();

// Serve per applicare il middleware di autenticazione a tutte le rotte
router.use(authenticationMiddleware);

router.post('/parcheggio', ParcheggioController.createParcheggio); // POST http://localhost:3000/parcheggio {"id" : 1 , "nome" : "ciao"....}
router.get('/parcheggi', ParcheggioController.getAllParcheggi);
router.get('/parcheggio/:id', ParcheggioController.getParcheggioById);
router.put('/parcheggio/:id', ParcheggioController.updateParcheggio);
router.delete('/parcheggio/:id', ParcheggioController.deleteParcheggio);

// Gestione degli errori
router.use(errorHandler);

export default router;

/*
router.post('/parcheggio',authenticationMiddleware,validateParcheggio, ParcheggioController.createParcheggio); // POST http://localhost:8080/parcheggio {"id" : 1 , "nome" : "ciao"}
router.get('/parcheggi', authenticationMiddleware, ParcheggioController.getAllParcheggi); // GET http://localhost:8080/parcheggi
router.get('/parcheggio/:id', authenticationMiddleware, ParcheggioController.getParcheggioById); // GET http://localhost:8080/parcheggio/1
router.put('/parcheggio/:id',authenticationMiddleware,validateParcheggio, ParcheggioController.updateParcheggio); // PUT http://localhost:8080/parcheggio/1
router.delete('/parcheggio/:id', authenticationMiddleware, ParcheggioController.deleteParcheggio); // DELETE http://localhost:8080/parcheggio/1
*/