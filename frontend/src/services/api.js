import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,   // Vite proxy rewrites /auth, /employees, /performance → backend
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────────────────────────
export const login = (username, password) => {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)
  return api.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// ── Employees ─────────────────────────────────────────────────────────────────
export const getEmployees       = ()           => api.get('/employees/')
export const getEmployee        = (id)         => api.get(`/employees/${id}`)
export const getMyProfile       = ()           => api.get('/employees/me')
export const createEmployee     = (data)       => api.post('/employees/', data)
export const updateEmployee     = (id, data)   => api.put(`/employees/${id}`, data)

// ── Performance ───────────────────────────────────────────────────────────────
export const getPerformance     = (empId)      => api.get(`/performance/${empId}`)
export const createPerformance  = (data)       => api.post('/performance/', data)

export default api
