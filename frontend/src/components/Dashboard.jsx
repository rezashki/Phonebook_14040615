import { useState, useEffect } from 'react'
import Contacts from './Contacts'
import Companies from './Companies'
import NoticeBoard from './NoticeBoard'
import UserManagement from './UserManagement'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

function Dashboard({ user, onLogout }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light'
    } catch (e) {
      return 'light'
    }
  })
  const [currentView, setCurrentView] = useState('dashboard')
  const [notices, setNotices] = useState([])
  const [stats, setStats] = useState({
    contacts: 0,
    companies: 0,
    users: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentView === 'dashboard') {
      fetchDashboardData()
    }
  }, [currentView])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try { localStorage.setItem('theme', theme) } catch (e) {}
  }, [theme])

  const fetchDashboardData = async () => {
    try {
      // Fetch notices
      const noticesResponse = await fetch('/api/notices')
      const noticesData = await noticesResponse.json()
      if (noticesData.notices) {
        setNotices(noticesData.notices.slice(0, 5)) // Show latest 5 notices
      }

      // Fetch stats if admin
      if (user.role === 'admin') {
        const [contactsRes, companiesRes, usersRes] = await Promise.all([
          fetch('/api/contacts'),
          fetch('/api/companies'),
          fetch('/api/users')
        ])

        const contactsData = await contactsRes.json()
        const companiesData = await companiesRes.json()
        const usersData = await usersRes.json()

        setStats({
          contacts: contactsData.contacts?.length || 0,
          companies: companiesData.companies?.length || 0,
          users: usersData.users?.length || 0
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      onLogout()
    } catch (error) {
      console.error('Logout error:', error)
      onLogout() // Logout locally even if API call fails
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-background rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">Phonebook Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* Theme toggle */}
                <div className="flex items-center gap-2">
                  <label htmlFor="theme-toggle" className="text-sm text-muted-foreground">Theme</label>
                  <select id="theme-toggle" value={theme} onChange={e => setTheme(e.target.value)} className="p-1 rounded border bg-input text-card-foreground">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.username}
                  </span>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            </div>
            {/* Navigation */}
            <nav className="flex space-x-2 pb-4">
              <Button
                onClick={() => setCurrentView('dashboard')}
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => setCurrentView('contacts')}
                variant={currentView === 'contacts' ? 'default' : 'ghost'}
                size="sm"
              >
                Contacts
              </Button>
              <Button
                onClick={() => setCurrentView('companies')}
                variant={currentView === 'companies' ? 'default' : 'ghost'}
                size="sm"
              >
                Companies
              </Button>
              <Button
                onClick={() => setCurrentView('notices')}
                variant={currentView === 'notices' ? 'default' : 'ghost'}
                size="sm"
              >
                Notice Board
              </Button>
              {user.role === 'admin' && (
                <Button
                  onClick={() => setCurrentView('users')}
                  variant={currentView === 'users' ? 'default' : 'ghost'}
                  size="sm"
                >
                  User Management
                </Button>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="py-6">
            {currentView === 'dashboard' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Contacts</CardTitle>
                      <span className="text-2xl">📞</span>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.contacts}</div>
                      <p className="text-xs text-muted-foreground">
                        Total contacts in system
                      </p>
                    </CardContent>
                  </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Companies</CardTitle>
                    <span className="text-2xl">🏢</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.companies}</div>
                    <p className="text-xs text-muted-foreground">
                      Total companies registered
                    </p>
                  </CardContent>
                </Card>

                {user.role === 'admin' && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Users</CardTitle>
                      <span className="text-2xl">👥</span>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.users}</div>
                      <p className="text-xs text-muted-foreground">
                        Active system users
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Notices</CardTitle>
                    <span className="text-2xl">📢</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{notices.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Recent announcements
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Notices */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notices</CardTitle>
                  <CardDescription>
                    Latest announcements and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notices.length === 0 ? (
                    <p className="text-muted-foreground">No notices available.</p>
                  ) : (
                    <div className="space-y-4">
                      {notices.map((notice) => (
                        <div key={notice.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{notice.title}</h4>
                              <Badge variant={getPriorityColor(notice.priority)}>
                                {notice.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notice.content}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(notice.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
          {currentView === 'contacts' && <Contacts user={user} />}
          {currentView === 'companies' && <Companies user={user} />}
          {currentView === 'notices' && <NoticeBoard user={user} />}
          {currentView === 'users' && user.role === 'admin' && <UserManagement user={user} />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
