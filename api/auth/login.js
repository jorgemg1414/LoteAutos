import { signToken, setAuthCookie, checkAdminCredentials } from '../lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { username, password } = req.body ?? {}

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
  }

  const valid = await checkAdminCredentials(username, password)
  if (!valid) {
    // Misma respuesta para usuario inexistente o contraseña incorrecta
    return res.status(401).json({ error: 'Credenciales incorrectas' })
  }

  const token = signToken({ role: 'admin', username })
  setAuthCookie(res, token)

  return res.status(200).json({ ok: true })
}
