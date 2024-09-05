import { Router } from 'express';
import { login } from '../controllers/authenticationController';
import { validateUsername } from '../middleware/validationMiddleware';

const router = Router();

/**
 * Login
 */
router.post('/login', validateUsername , login); // POST http://localhost:8080/login {"id": 1, "nome": "Federica", "ruolo": "ADMIN"}

export default router;