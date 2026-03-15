import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login          from './pages/Login'
import Dashboard      from './pages/Dashboard'
import Employees      from './pages/Employees'
import EmployeeProfile from './pages/EmployeeProfile'
import Performance    from './pages/Performance'
import Layout         from './components/Layout'

// Simple guard – redirects to /login if no token
function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user') || 'null')
  if (!token) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <PrivateRoute><Layout /></PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="employees"  element={
            <PrivateRoute adminOnly><Employees /></PrivateRoute>
          }/>
          <Route path="employees/:id" element={<EmployeeProfile />} />
          <Route path="performance/:employeeId" element={<Performance />} />
          <Route path="profile" element={<EmployeeProfile isSelf />} />
          <Route path="my-performance" element={<Performance isSelf />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
