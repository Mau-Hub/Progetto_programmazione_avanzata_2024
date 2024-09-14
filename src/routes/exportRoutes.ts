import { Router } from 'express';
import { authenticationMiddleware } from '../middleware/authenticationMiddleware'; 
import transitiExportController from '../controllers/transitiExportController';
import { errorHandler } from '../middleware/errorHandler';

const router = Router();

// Rotta autenticata per ottenere i transiti in formato CSV
router.get('/transiti/export', authenticationMiddleware, transitiExportController.exportTransiti);

router.use(errorHandler);

export default router;
