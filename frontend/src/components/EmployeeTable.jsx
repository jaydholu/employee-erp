import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EmployeeTable({ employees, onEdit }) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = employees.filter(emp =>
    emp.user.fullname.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase()) ||
    emp.position.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
      {/* Search bar */}
      <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search employees…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-100">
              {['Name', 'Department', 'Position', 'Joining Date', 'Salary', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">No employees found.</td>
              </tr>
            ) : filtered.map(emp => (
              <tr key={emp.id} className="hover:bg-surface-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {emp.user.fullname.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{emp.user.fullname}</p>
                      <p className="text-xs text-slate-400">{emp.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700">
                    {emp.department}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{emp.position}</td>
                <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{emp.joining_date}</td>
                <td className="px-5 py-3.5 text-slate-700 font-mono">
                  ₹{Number(emp.salary).toLocaleString('en-IN')}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      className="text-xs px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(emp)}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/performance/${emp.id}`)}
                      className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-medium"
                    >
                      Reviews
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
