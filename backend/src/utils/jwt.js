import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '86400', 10); // segundos

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en .env');
}

/**
 * Firma un JWT con el payload dado.
 * @param {object} payload - datos que se guardan dentro del token (ej: { userId, email, role })
 * @returns {string} token JWT
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifica un JWT y devuelve su payload.
 * @param {string} token - el JWT a verificar
 * @returns {object} payload decodificado
 * @throws si el token es inválido o expiró
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
