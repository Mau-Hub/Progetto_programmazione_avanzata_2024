"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticationController_1 = require("../controllers/authenticationController");
const validationUsername_1 = require("../middleware/validationUsername");
const router = (0, express_1.Router)();
/**
 * Login
 */
router.post('/login', validationUsername_1.validateUsername, authenticationController_1.login); // POST http://localhost:3000/login {"id": 1, "nome": "Federica", "ruolo": "ADMIN"}
exports.default = router;
