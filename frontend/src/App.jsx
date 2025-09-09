import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Contacts from './components/Contacts'
import Companies from './components/Companies'
import NoticeBoard from './components/NoticeBoard'
import UserManagement from './components/UserManagement'
import Layout from './components/Layout'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
            }
          />
          {user && (
            <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}> 
              <Route path="dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
              <Route path="contacts" element={<Contacts user={user} />} />
              <Route path="companies" element={<Companies user={user} />} />
              <Route path="notices" element={<NoticeBoard user={user} />} />
              {user.role === 'admin' && <Route path="users" element={<UserManagement user={user} />} />}
            </Route>
          )}
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
