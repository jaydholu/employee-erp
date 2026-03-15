import { useNavigate, useLocation } from 'react-router-dom'

const titles = {
  '/dashboard':      'Dashboard',
  '/employees':      'Employees',
  '/profile':        'My Profile',
  '/my-performance': 'My Performance',
}

export default function Navbar() {
  const navigate  = useNavigate()
  const { pathname } = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const pageTitle = Object.entries(titles).find(([path]) => pathname.startsWith(path))?.[1] ?? 'Portal'

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const initials = user?.fullname
    ? user.fullname.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <header className="h-14 bg-white border-b border-surface-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
      <h1 className="text-base font-semibold text-slate-800">{pageTitle}</h1>

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
          {initials}
        </div>
        <span className="text-sm text-slate-600 hidden sm:block">{user?.fullname}</span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="ml-2 text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-surface-100 hover:text-slate-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
