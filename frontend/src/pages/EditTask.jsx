
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import api from '../services/api'

export default function EditTask() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchTask = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.tasks.getById(id)
      setTitle(response.task.title || '')
      setDescription(response.task.description || '')
    } catch (err) {
      setError(err.message || 'Unable to load this task.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTask()
  }, [fetchTask])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const cleanTitle = title.trim()
    const cleanDescription = description.trim()

    if (!cleanTitle) {
      setError('Task title is required.')
      return
    }

    setSubmitting(true)

    try {
      await api.tasks.update(id, {
        title: cleanTitle,
        description: cleanDescription,
      })

      navigate(`/tasks/${id}`, {
        replace: true,
        state: { message: 'Task updated successfully.' },
      })
    } catch (err) {
      setError(err.message || 'Unable to update task.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <RefreshCw size={27} className="animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        onClick={() => navigate(`/tasks/${id}`)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft size={17} />
        Back to task
      </button>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Edit Task
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Update the task title or description.
        </p>

        {error && (
          <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error || title || description ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="edit-title" className="mb-2 block text-sm font-semibold text-slate-700">
                Task title *
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={event => setTitle(event.target.value)}
                maxLength={150}
                required
                disabled={submitting}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
              <p className="mt-1 text-xs text-slate-400">
                {title.length}/150 characters
              </p>
            </div>

            <div>
              <label htmlFor="edit-description" className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={event => setDescription(event.target.value)}
                rows={5}
                maxLength={1000}
                disabled={submitting}
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
              <p className="mt-1 text-xs text-slate-400">
                {description.length}/1000 characters
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(`/tasks/${id}`)}
                disabled={submitting}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={fetchTask}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
          >
            <RefreshCw size={16} />
            Retry loading task
          </button>
        )}
      </section>
    </div>
  )
}
