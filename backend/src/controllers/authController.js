import bcrypt from 'bcrypt';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { signToken } from '../utils/jwt.js';

// Validación del body del login con Zod
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Password requerido'),
});

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 * Response (200): { user: { id, email, name, role }, token }
 * Response (400): validación inválida
 * Response (401): credenciales incorrectas
 */
export async function login(req, res) {
  // 1. Validar input
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({
      error: 'Validación fallida',
      details: parse.error.flatten().fieldErrors,
    });
  }
  const { email, password } = parse.data;

  // 2. Buscar al usuario
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // No distinguimos entre "email no existe" y "password incorrecto" — es buena práctica de seguridad
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // 3. Comparar el password con el hash bcrypt
  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // 4. Firmar el JWT
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // 5. Devolver el usuario (sin password) + el token
  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  });
}

/**
 * GET /api/v1/auth/me
 * Header: Authorization: Bearer <token>
 * Response (200): { user: { id, email, name, role } }
 * Response (401): token inválido o ausente (lo maneja el middleware)
 *
 * req.user fue seteado por el middleware authenticate.
 */
export async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  return res.json({ user });
}
