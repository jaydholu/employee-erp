import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEmployee, getMyProfile } from '../services/api'

export default function EmployeeProfile({ isSelf = false }) {
  const { id }   = useParams()
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('user') || 'null')

  const [emp, setEmp]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    const fetch = isSelf ? getMyProfile() : getEmployee(id)
    fetch
      .then(r => setEmp(r.data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [id, isSelf])

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (error) return <p className="text-red-500 text-sm">{error}</p>
  if (!emp)  return null

  const initials = emp.user.fullname.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

  const fields = [
    { label: 'Department',   value: emp.department },
    { label: 'Position',     value: emp.position },
    { label: 'Joining Date', value: emp.joining_date },
    { label: 'Salary',       value: '₹' + Number(emp.salary).toLocaleString('en-IN') },
    { label: 'Email',        value: emp.user.email },
    { label: 'Username',     value: emp.user.username },
    { label: 'Role',         value: emp.user.role },
  ]

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white text-xl font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800">{emp.user.fullname}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{emp.position} · {emp.department}</p>
        </div>
        <button
          onClick={() => navigate(isSelf ? `/my-performance` : `/performance/${emp.id}`)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          View Reviews
        </button>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100">
          <h3 className="font-semibold text-slate-800 text-sm">Employee Details</h3>
        </div>
        <div className="divide-y divide-surface-50">
          {fields.map(({ label, value }) => (
            <div key={label} className="px-5 py-3.5 flex items-center">
              <span className="w-36 text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">{label}</span>
              <span className="text-sm text-slate-700 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/employees')}
            className="px-4 py-2 border border-surface-200 text-slate-600 hover:bg-surface-100 text-sm font-medium rounded-lg transition-colors"
          >
            ← Back to Employees
          </button>
        </div>
      )}
    </div>
  )
}
