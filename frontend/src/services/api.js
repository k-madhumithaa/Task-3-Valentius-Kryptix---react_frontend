
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const TOKEN_KEY = 'taskflow_token'

// Token management
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Centralized HTTP request handler
async function request(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
  } = options

  const token = getToken()

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      ...(body !== undefined && {
        body: JSON.stringify(body),
      }),
    })
  } catch {
    throw new Error(
      'Unable to connect to the server. Please check whether the backend is running.'
    )
  }

  const contentType = response.headers.get('content-type')

  const data = contentType?.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    if (response.status === 401 && token) {
      removeToken()
    }

    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    )
  }

  return data
}

// Authentication API
const auth = {
  register(payload) {
    return request('/auth/register', {
      method: 'POST',
      body: payload,
    })
  },

  login(payload) {
    return request('/auth/login', {
      method: 'POST',
      body: payload,
    })
  },

  me() {
    return request('/auth/me')
  },
}

// Task API
const tasks = {
  getAll() {
    return request('/tasks')
  },

  getById(id) {
    return request(`/tasks/${id}`)
  },

  create(payload) {
    return request('/tasks', {
      method: 'POST',
      body: payload,
    })
  },

  update(id, payload) {
    return request(`/tasks/${id}`, {
      method: 'PATCH',
      body: payload,
    })
  },

  remove(id) {
    return request(`/tasks/${id}`, {
      method: 'DELETE',
    })
  },
}

const api = {
  auth,
  tasks,
}

export default api
