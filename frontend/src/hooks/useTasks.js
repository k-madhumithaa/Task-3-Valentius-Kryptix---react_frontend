
import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'

export default function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.tasks.getAll()
      setTasks(Array.isArray(response?.tasks) ? response.tasks : [])
    } catch (err) {
      setError(err.message || 'Unable to load tasks.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  }
}
