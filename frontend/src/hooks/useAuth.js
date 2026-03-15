import { useState, useEffect, useCallback } from 'react'
import { login as apiLogin } from '../services/api'

/**
 * Provides auth state + helpers.
 * Auth data is persisted in localStorage so it survives page refreshes.
 */
export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = useCallback(async (username, password) => {
    const { data } = await apiLogin(username, password)
    const userData = {
      token:       data.access_token,
      role:        data.role,
      userId:      data.user_id,
      fullname:    data.fullname,
      employeeId:  data.employee_id ?? null,
    }
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
  }, [])

  return { user, login, logout, isAdmin: user?.role === 'admin' }
}
