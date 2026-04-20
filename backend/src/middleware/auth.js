import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware que verifica el JWT enviado en el header Authorization.
 * Si el token es válido, guarda el payload decodificado en req.user y deja pasar.
 * Si no, responde 401.
 *
 * Uso:
 *   router.get('/me', authenticate, authController.me);
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  try {
    const payload = verifyToken(token);
    req.user = payload; // { userId, email, role, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

/**
 * Middleware que restringe a usuarios con cierto rol.
 * Se usa DESPUÉS de authenticate.
 *
 * Uso:
 *   router.post('/users', authenticate, requireRole('admin'), createUserController);
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }
    return next();
  };
}
