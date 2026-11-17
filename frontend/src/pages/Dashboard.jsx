
import { useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ListTodo,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  RefreshCw,
  Eye,
} from 'lucide-react'
import useTasks from '../hooks/useTasks'

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

export default function Dashboard() {
  const navigate = useNavigate()
  const { tasks, loading, error, refetch } = useTasks()

  const stats = useMemo(() => {
    const completed = tasks.filter(task => Boolean(task.completed)).length
    const pending = tasks.length - completed

    return [
      {
        label: 'Total Tasks',
        value: tasks.length,
        note: 'Tasks in your workspace',
        icon: ListTodo,
        color: 'bg-indigo-50 text-indigo-600',
      },
      {
        label: 'In Progress',
        value: pending,
        note: 'Tasks not yet completed',
        icon: Clock3,
        color: 'bg-blue-50 text-blue-600',
      },
      {
        label: 'Completed',
        value: completed,
        note: 'Successfully finished',
        icon: CheckCircle2,
        color: 'bg-emerald-50 text-emerald-600',
      },
      {
        label: 'Pending',
        value: pending,
        note: 'Awaiting your attention',
        icon: AlertCircle,
        color: 'bg-amber-50 text-amber-600',
      },
    ]
  }, [tasks])

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      })
      .slice(0, 5)
  }, [tasks])

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            YOUR WORKSPACE
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back!
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Here's an overview of your tasks and progress.
          </p>
        </div>

        <button
          onClick={() => navigate('/tasks/new')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          <Plus size={19} />
          Create New Task
        </button>
      </section>

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-900"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-xl p-3 ${color}`}>
                <Icon size={21} />
              </div>
              <ArrowUpRight size={18} className="text-slate-300" />
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              {label}
            </p>

            <h3 className="mt-1 text-3xl font-bold text-slate-900">
              {loading ? '—' : value}
            </h3>

            <p className="mt-2 text-xs text-slate-400">{note}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Recent Tasks
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Your latest task activity
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={refetch}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>

            <button
              onClick={() => navigate('/tasks')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Eye size={16} />
              View All
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <RefreshCw size={25} className="mx-auto animate-spin text-indigo-600" />
              <p className="mt-3 text-sm text-slate-500">Loading your tasks...</p>
            </div>
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            Tasks could not be loaded. Please retry.
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <ListTodo size={30} />
            </div>

            <h4 className="mt-5 text-lg font-semibold text-slate-800">
              No tasks yet
            </h4>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Create your first task to get started. Your tasks will appear here.
            </p>

            <button
              onClick={() => navigate('/tasks/new')}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus size={17} />
              Create your first task
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTasks.map(task => (
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                className="flex flex-col justify-between gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800">
                    {task.title}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {task.description || 'No description provided'}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      task.completed
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>

                  <span className="text-xs text-slate-400">
                    {formatDate(task.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <p className="text-center text-xs text-slate-400">
        TaskFlow · Your personal productivity workspace
      </p>
    </div>
  )
}
