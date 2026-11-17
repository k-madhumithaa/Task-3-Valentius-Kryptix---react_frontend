
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Plus,
  ListTodo,
  RefreshCw,
  Eye,
} from 'lucide-react'
import useTasks from '../hooks/useTasks'

export default function AllTasks() {
  const navigate = useNavigate()
  const { tasks, loading, error, refetch } = useTasks()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()

    return tasks.filter(task => {
      const matchesSearch =
        (task.title || '').toLowerCase().includes(query) ||
        (task.description || '').toLowerCase().includes(query)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' && Boolean(task.completed)) ||
        (filter === 'pending' && !task.completed)

      return matchesSearch && matchesFilter
    })
  }, [tasks, search, filter])

  function formatDate(value) {
    if (!value) return 'Date unavailable'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return 'Date unavailable'

    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            All Tasks
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all your workspace tasks.
          </p>
        </div>

        <button
          onClick={() => navigate('/tasks/new')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          New Task
        </button>
      </section>

      {/* Search and filters */}
      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-indigo-400">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search by title or description..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                filter === option.value
                  ? 'bg-indigo-600 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}

          <button
            onClick={refetch}
            disabled={loading}
            aria-label="Refresh tasks"
            className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={loading ? 'animate-spin' : ''}
            />
          </button>
        </div>
      </section>

      {/* Task count */}
      {!loading && !error && (
        <p className="text-sm text-slate-500">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="text-center">
            <RefreshCw size={26} className="mx-auto animate-spin text-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">
              Loading tasks...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={refetch}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty states */}
      {!loading && !error && filteredTasks.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <ListTodo size={30} />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-800">
            {tasks.length === 0
              ? 'No tasks created yet'
              : 'No matching tasks found'}
          </h3>

          <p className="mt-2 max-w-sm text-sm text-slate-500">
            {tasks.length === 0
              ? 'Create your first task to start managing your work.'
              : 'Try changing your search or selecting another filter.'}
          </p>

          {tasks.length === 0 && (
            <button
              onClick={() => navigate('/tasks/new')}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={17} />
              Create Task
            </button>
          )}
        </div>
      )}

      {/* Task list */}
      {!loading && !error && filteredTasks.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {filteredTasks.map(task => (
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                className="flex flex-col justify-between gap-4 px-5 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className={`mt-1 rounded-lg p-2 ${
                    task.completed
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    <ListTodo size={19} />
                  </div>

                  <div className="min-w-0">
                    <h3 className={`truncate font-semibold ${
                      task.completed
                        ? 'text-slate-400 line-through'
                        : 'text-slate-800'
                    }`}>
                      {task.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {task.description || 'No description provided'}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Created {formatDate(task.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    task.completed
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>

                  <Eye size={18} className="text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
