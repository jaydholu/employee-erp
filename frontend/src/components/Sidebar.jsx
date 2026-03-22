import { NavLink } from 'react-router-dom'
import { LayoutDashboard, User, Users, ChartNoAxesCombined } from 'lucide-react'

const adminLinks = [
  { to: '/dashboard',  label: 'Dashboard' },
  { to: '/employees',  label: 'Employees' },
]

const employeeLinks = [
  { to: '/dashboard',     label: 'Dashboard' },
  { to: '/profile',       label: 'My Profile' },
  { to: '/my-performance',label: 'Performance' },
]

// Icon components
const Icons = {
  grid: <LayoutDashboard className="w-5 h-5" />,
  user: <User className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  chart: <ChartNoAxesCombined className="w-5 h-5" />,
}

const lucideIcon = { '/dashboard': Icons.grid, '/employees': Icons.users, '/profile': Icons.user, '/my-performance': Icons.chart }

export default function Sidebar() {
  const user  = JSON.parse(localStorage.getItem('user') || 'null')
  const links = user?.role === 'admin' ? adminLinks : employeeLinks

  return (
    <aside className="w-60 bg-brand-900 flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-700">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
          ERP
        </div>
        <span className="text-white font-semibold tracking-wide text-sm">Employee Portal</span>
      </div>

      {/* Role badge */}
      <div className="px-6 pt-5 pb-2">
        <span className="text-xs font-mono uppercase tracking-widest text-brand-200 opacity-60">
          {user?.role === 'admin' ? 'HR Admin' : 'Employee'}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 pb-4 space-y-0.5">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600 text-white font-medium shadow-sm'
                  : 'text-brand-200 hover:bg-brand-700 hover:text-white'
              }`
            }
          >
            <span className="opacity-80">{lucideIcon[to]}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info bottom */}
      <div className="px-5 py-4 border-t border-brand-700">
        <p className="text-white text-sm font-medium truncate">{user?.fullname}</p>
        <p className="text-brand-300 text-xs truncate mt-0.5 font-mono">{user?.role}</p>
      </div>
    </aside>
  )
}
