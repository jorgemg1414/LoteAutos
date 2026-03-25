import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const COOKIE_NAME = 'loteautos_session'
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida')
}

// ── Token ────────────────────────────────────────────────────────────────────

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

// ── Cookies ───────────────────────────────────────────────────────────────────

function buildCookie(value, maxAge) {
  const parts = [
    `${COOKIE_NAME}=${value}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  parts.push(`Max-Age=${maxAge}`)
  return parts.join('; ')
}

export function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', buildCookie(token, 7 * 24 * 60 * 60))
}

export function clearAuthCookie(res) {
  res.setHeader(
    'Set-Cookie',
    buildCookie('', 0) + '; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, part) => {
    const idx = part.indexOf('=')
    if (idx < 0) return acc
    const key = part.slice(0, idx).trim()
    const val = decodeURIComponent(part.slice(idx + 1).trim())
    acc[key] = val
    return acc
  }, {})
}

export function getTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie)
  if (cookies[COOKIE_NAME]) return cookies[COOKIE_NAME]

  const auth = req.headers.authorization
  if (auth?.startsWith('Bearer ')) return auth.slice(7)

  return null
}

/**
 * Verifica autenticación. Si no es válida, responde 401 y retorna null.
 * Uso: const payload = requireAuth(req, res); if (!payload) return;
 */
export function requireAuth(req, res) {
  const token = getTokenFromRequest(req)
  if (!token) {
    res.status(401).json({ error: 'No autorizado' })
    return null
  }
  try {
    return verifyToken(token)
  } catch {
    res.status(401).json({ error: 'Sesión inválida o expirada' })
    return null
  }
}

// ── Credenciales admin ────────────────────────────────────────────────────────

export async function checkAdminCredentials(username, password) {
  const adminUsername = process.env.ADMIN_USERNAME
  if (!adminUsername || username !== adminUsername) return false

  // Soporte para hash bcrypt (producción) y texto plano (desarrollo)
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (hash) return bcrypt.compare(password, hash)

  const plain = process.env.ADMIN_PASSWORD
  if (plain) return password === plain

  return false
}
