
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import api, {
  getToken,
  setToken,
  removeToken,
} from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Validate an existing session when the application starts
  useEffect(() => {
    let active = true

    async function restoreSession() {
      if (!getToken()) {
        if (active) setLoading(false)
        return
      }

      try {
        const response = await api.auth.me()

        if (active) {
          setUser(response.user)
        }
      } catch {
        removeToken()

        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [])

  // Login
  async function login(email, password) {
    const response = await api.auth.login({
      email,
      password,
    })

    setToken(response.token)
    setUser(response.user)

    return response
  }

  // Logout
  function logout() {
    removeToken()
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    )
  }

  return context
}
