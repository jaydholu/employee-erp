import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Building2, Banknote, UserPlus, BriefcaseBusiness, CalendarDays } from 'lucide-react'
import StatCard from '../components/StatCard'
import { getEmployees, getMyProfile } from '../services/api'

export default function Dashboard() {
  const user     = JSON.parse(localStorage.getItem('user') || 'null')
  const isAdmin  = user?.role === 'admin'
  const navigate = useNavigate()

  const [employees, setEmployees] = useState([])
  const [myProfile, setMyProfile] = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (isAdmin) {
      getEmployees()
        .then(r => setEmployees(r.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      getMyProfile()
        .then(r => setMyProfile(r.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [isAdmin])

  const departments = [...new Set(employees.map(e => e.department))].length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Admin Dashboard ──────────────────────────────────────────────────────
  if (isAdmin) {
    const recentEmployees = [...employees]
      .sort((a, b) => new Date(b.joining_date) - new Date(a.joining_date))
      .slice(0, 5)

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Welcome back, {user.fullname}!</h2>
          <p className="text-sm text-slate-400 mt-0.5">Here's a quick overview of your workforce.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Employees" value={employees.length} icon={ Users } accent="brand" sub="Active headcount" />
          <StatCard title="Departments"     value={departments}      icon={ Building2 } accent="rose" sub="Across the organization" />
          <StatCard title="Avg Salary"      value={
            employees.length
              ? '₹' + Math.round(employees.reduce((s, e) => s + Number(e.salary), 0) / employees.length).toLocaleString('en-IN')
              : '—'
          } icon={ Banknote } accent="emerald" sub="Per employee" />
          <StatCard title="New This Month"  value={
            employees.filter(e => {
              const d = new Date(e.joining_date)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length
          } icon={ UserPlus } accent="amber" sub="Joined recently" />
        </div>

        {/* Recent employees */}
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
            <h3 className="text-brand-600 hover:text-brand-700 font-medium text-lg">Recent Employees</h3>
            <button
              onClick={() => navigate('/employees')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-surface-50">
            {recentEmployees.map(emp => (
              <div key={emp.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
                    {emp.user.fullname.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{emp.user.fullname}</p>
                    <p className="text-xs text-slate-400">{emp.position} · {emp.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400 font-mono">{emp.joining_date}</span>
                  <button
                    onClick={() => navigate(`/employees/${emp.id}`)}
                    className="text-lg text-brand-600 hover:text-brand-800 font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
            {employees.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No employees yet. Create one!</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Employee Dashboard ───────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Welcome, {user.fullname} 👋</h2>
        <p className="text-sm text-slate-400 mt-0.5">Here's your work summary.</p>
      </div>

      {myProfile ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Department" value={myProfile.department}  icon={ Building2 } accent="brand" />
          <StatCard title="Position"   value={myProfile.position}    icon={ BriefcaseBusiness } accent="emerald" />
          <StatCard title="Since"      value={myProfile.joining_date} icon={ CalendarDays } accent="amber" sub="Joining date" />
        </div>
      ) : (
        <p className="text-sm text-slate-400">No profile data available.</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/profile')}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          View Profile
        </button>
        <button
          onClick={() => navigate('/my-performance')}
          className="px-4 py-2 border border-surface-200 text-slate-600 hover:bg-surface-100 text-sm font-medium rounded-lg transition-colors"
        >
          My Reviews
        </button>
      </div>
    </div>
  )
}
