import { NavLink } from 'react-router-dom'

const adminLinks = [
  { to: '/dashboard',  label: 'Dashboard',   icon: '⬛' },
  { to: '/employees',  label: 'Employees',   icon: '👥' },
]

const employeeLinks = [
  { to: '/dashboard',     label: 'Dashboard',    icon: '⬛' },
  { to: '/profile',       label: 'My Profile',   icon: '👤' },
  { to: '/my-performance',label: 'Performance',  icon: '📊' },
]

// Icon components (inline SVG)
const Icons = {
  grid: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0zM3 7a3 3 0 116 0 3 3 0 01-6 0z"/>
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
  ),
}

const svgIcon = { '/dashboard': Icons.grid, '/employees': Icons.users, '/profile': Icons.user, '/my-performance': Icons.chart }

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
            <span className="opacity-80">{svgIcon[to]}</span>
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
