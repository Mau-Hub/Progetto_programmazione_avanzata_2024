// src/routes/parcheggioRoutes.ts
import { Router } from 'express';
import ParcheggioController from '../controllers/parcheggioController';
import { authenticationMiddleware } from '../middleware/authenticationMiddleware';
import { validateUsername } from '../middleware/validationMiddleware';
import {ErrorGenerator, ApplicationErrorTypes} from '../ext/errorFactory';
import {errorHandler} from '../middleware/errorHandler'


const router = Router();



router.post('/parcheggio',authenticationMiddleware,ParcheggioController.createParcheggio); // POST http://localhost:8080/parcheggio {"id" : 1 , "nome" : "ciao"}
router.get('/parcheggi', authenticationMiddleware, ParcheggioController.getAllParcheggi); // GET http://localhost:8080/parcheggi
router.get('/parcheggio/:id', authenticationMiddleware, ParcheggioController.getParcheggioById); // GET http://localhost:8080/parcheggio/1
router.put('/parcheggio/:id',authenticationMiddleware,ParcheggioController.updateParcheggio); // PUT http://localhost:8080/parcheggio/1
router.delete('/parcheggio/:id', authenticationMiddleware, ParcheggioController.deleteParcheggio); // DELETE http://localhost:8080/parcheggio/1

// Gestione degli errori
router.use(authenticationMiddleware);

export default router;
