
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import api from '../services/api'

export default function TaskDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchTask = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.tasks.getById(id)
      setTask(response.task)
    } catch (err) {
      setError(err.message || 'Unable to load this task.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTask()
  }, [fetchTask])

  async function handleToggleComplete() {
    if (!task || actionLoading) return

    setActionLoading(true)
    setError('')

    try {
      const response = await api.tasks.update(id, {
        completed: !Boolean(task.completed),
      })
      setTask(response.task)
    } catch (err) {
      setError(err.message || 'Unable to update task status.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    setActionLoading(true)
    setError('')

    try {
      await api.tasks.remove(id)
      navigate('/tasks', {
        replace: true,
        state: { message: 'Task deleted successfully.' },
      })
    } catch (err) {
      setError(err.message || 'Unable to delete this task.')
      setActionLoading(false)
    }
  }

  function formatDate(value) {
    if (!value) return 'Date unavailable'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return 'Date unavailable'

    return date.toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <RefreshCw className="animate-spin text-indigo-600" size={28} />
      </div>
    )
  }

  if (error && !task) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={fetchTask}
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
        <button
          onClick={() => navigate('/tasks')}
          className="ml-3 text-sm text-slate-600"
        >
          Back to tasks
        </button>
      </div>
    )
  }

  if (!task) return null

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      <Link
        to="/tasks"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft size={17} />
        Back to all tasks
      </Link>

      {location.state?.message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {location.state.message}
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              task.completed
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              {task.completed ? 'Completed' : 'Pending'}
            </span>

            <h2 className="mt-4 break-words text-2xl font-bold text-slate-900">
              {task.title}
            </h2>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => navigate(`/tasks/${id}/edit`)}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <Pencil size={16} />
              Edit
            </button>

            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-700">
            Description
          </h3>

          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Created
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {formatDate(task.created_at)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Status
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {task.completed ? 'Completed' : 'Pending'}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <button
            onClick={handleToggleComplete}
            disabled={actionLoading}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              task.completed
                ? 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {actionLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : task.completed ? (
              <Circle size={17} />
            ) : (
              <CheckCircle2 size={17} />
            )}

            {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
          </button>
        </div>
      </section>
    </div>
  )
}
