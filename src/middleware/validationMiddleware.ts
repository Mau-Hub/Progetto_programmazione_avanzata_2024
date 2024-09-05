import { body, query } from 'express-validator';
import validationRequest from './validationRequestMiddleware';

export const validateUsername = [
  // Controlla che l'username sia presente nel corpo della richiesta e rispetti le regole
  body('username')
    .optional()
    .isAlphanumeric()
    .withMessage('Il nome utente deve contenere solo caratteri alfanumerici')
    .isLength({ min: 3, max: 20 })
    .withMessage('Il nome utente deve avere una lunghezza compresa tra 3 e 20 caratteri'),
  
  // Controlla che l'username sia presente nei parametri di query e rispetti le regole
  query('username')
    .optional()
    .isAlphanumeric()
    .withMessage('Il nome utente deve contenere solo caratteri alfanumerici')
    .isLength({ min: 3, max: 20 })
    .withMessage('Il nome utente deve avere una lunghezza compresa tra 3 e 20 caratteri'),

  validationRequest
];
