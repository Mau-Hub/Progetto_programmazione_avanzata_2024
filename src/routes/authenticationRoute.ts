import { Router } from 'express';
import { login } from '../controllers/authenticationController';

const router = Router();

/**
 * Login
 */
router.post('/login', login); // POST http://localhost:3000/login {"id": 1, "nome": "Federica", "ruolo": "ADMIN"}

export default router;
