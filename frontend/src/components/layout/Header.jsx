
import { Search, Bell, Menu, Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header({ onMenuClick }) {
  const navigate = useNavigate()
  const location = useLocation()

  const titles = {
    '/': 'Dashboard',
    '/tasks': 'All Tasks',
    '/tasks/new': 'Create Task',
  }

  const title = location.pathname.startsWith('/tasks/') &&
    location.pathname.endsWith('/edit')
    ? 'Edit Task'
    : location.pathname.startsWith('/tasks/') &&
      location.pathname !== '/tasks/new'
      ? 'Task Details'
      : titles[location.pathname] || 'TaskFlow'

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          <p className="hidden text-xs text-slate-400 sm:block">
            Workspace / {title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={17} className="text-slate-400" />
          <input
            type="search"
            placeholder="Search tasks..."
            className="w-36 bg-transparent text-sm outline-none placeholder:text-slate-400"
            aria-label="Search tasks"
          />
          <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-400">
            /
          </span>
        </div>

        <button
          className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <button
          onClick={() => navigate('/tasks/new')}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:px-4"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>
    </header>
  )
}
