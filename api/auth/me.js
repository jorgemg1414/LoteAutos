import { getTokenFromRequest, verifyToken } from '../lib/auth.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const token = getTokenFromRequest(req)
  if (!token) return res.status(200).json({ authenticated: false })

  try {
    const payload = verifyToken(token)
    return res.status(200).json({ authenticated: true, username: payload.username })
  } catch {
    return res.status(200).json({ authenticated: false })
  }
}
