/**
 * Cliente HTTP para las API Routes de Vercel.
 * Incluye credenciales (cookie httpOnly) en cada petición.
 */
async function request(path, options = {}) {
  const { body, ...rest } = options

  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...rest.headers,
    },
    ...rest,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  // Intentar parsear JSON siempre
  let data
  const ct = res.headers.get('content-type') ?? ''
  if (ct.includes('application/json')) {
    data = await res.json()
  } else {
    data = await res.text()
  }

  if (!res.ok) {
    const message = (typeof data === 'object' ? data?.error : data) ?? `HTTP ${res.status}`
    const err = new Error(message)
    err.status = res.status
    throw err
  }

  return data
}

export const api = {
  get:    (path)        => request(path, { method: 'GET' }),
  post:   (path, body)  => request(path, { method: 'POST',   body }),
  put:    (path, body)  => request(path, { method: 'PUT',    body }),
  delete: (path)        => request(path, { method: 'DELETE' }),
}
