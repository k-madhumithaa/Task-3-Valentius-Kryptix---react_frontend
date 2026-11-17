
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  Settings,
  CircleHelp,
  CheckCircle2,
  X,
  LogOut,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

const navigation = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'All Tasks', path: '/tasks', icon: ListTodo },
  { label: 'Calendar', path: '/calendar', icon: CalendarDays },
]

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    onClose?.()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <CheckCircle2 size={23} />
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              TaskFlow
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 py-7">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={19} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-2 border-t border-slate-100 p-4">

          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50"
          >
            <CircleHelp size={19} />
            Help & Support
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50"
          >
            <Settings size={19} />
            Settings
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
              M
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                My Workspace
              </p>
              <p className="text-xs text-slate-500">
                Task Manager
              </p>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={19} />
            Sign Out
          </button>

        </div>
      </aside>
    </>
  )
}
