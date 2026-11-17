
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import api from '../services/api'

export default function CreateTask() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const cleanTitle = title.trim()
    const cleanDescription = description.trim()

    if (!cleanTitle) {
      setError('Please enter a task title.')
      return
    }

    setSubmitting(true)

    try {
      const response = await api.tasks.create({
        title: cleanTitle,
        description: cleanDescription,
      })

      navigate(`/tasks/${response.task.id}`, {
        replace: true,
        state: { message: 'Task created successfully.' },
      })
    } catch (err) {
      setError(err.message || 'Unable to create task.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft size={17} />
        Go back
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Create a new task
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Add a task to your workspace and keep track of your work.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Task title <span className="text-red-500">*</span>
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="e.g. Complete project documentation"
              required
              maxLength={150}
              disabled={submitting}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            />

            <p className="mt-1 text-xs text-slate-400">
              {title.length}/150 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={event => setDescription(event.target.value)}
              placeholder="Add details about this task..."
              rows={5}
              maxLength={1000}
              disabled={submitting}
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            />

            <p className="mt-1 text-xs text-slate-400">
              {description.length}/1000 characters
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
