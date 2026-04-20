import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Público: login
router.post('/login', authController.login);

// Protegido: obtener el usuario actual (requiere JWT válido)
router.get('/me', authenticate, authController.me);

export default router;
