
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard from './pages/Dashboard'
import TaskDetails from './pages/TaskDetails'
import CreateTask from './pages/CreateTask'
import EditTask from './pages/EditTask'
import Login from './pages/Login'
import Register from './pages/Register'
import AllTasks from './pages/AllTasks'

function PlaceholderPage({ title }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <h2 className="text-2xl font-bold text-slate-900">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        This section will be implemented in the next development phase.
      </p>
    </div>
  )
}

function NotFound() {
  return (
    <div className="py-20 text-center">
      <h2 className="text-4xl font-bold text-slate-900">
        404
      </h2>
      <p className="mt-3 text-slate-500">
        Page not found.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authentication protection */}
          <Route element={<ProtectedRoute />}>

            {/* Shared application layout */}
            <Route element={<MainLayout />}>

              <Route path="/" element={<Dashboard />} />

              <Route path="/tasks" element={<AllTasks />} />

              <Route
                path="/tasks/new"
                element={<CreateTask />}
              />

              <Route
                path="/tasks/:id"
                element={<TaskDetails />}
              />

              <Route
                path="/tasks/:id/edit"
                element={<EditTask />}
              />

              <Route
                path="/calendar"
                element={<PlaceholderPage title="Calendar" />}
              />

            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
