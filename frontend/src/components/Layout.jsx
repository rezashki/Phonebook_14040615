import { useState, useEffect } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

function Layout({ user, onLogout, children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'light' } catch { return 'light' }
  })
  const navigate = useNavigate()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }) } catch {}
    onLogout()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/contacts', label: 'Contacts' },
    { to: '/companies', label: 'Companies' },
    { to: '/notices', label: 'Notice Board' },
  ]
  if (user.role === 'admin') {
    navItems.push({ to: '/users', label: 'User Management' })
  }  const linkBase = 'px-3 py-1 rounded-md text-sm font-medium transition-colors'

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-background rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
        <header className="border-b bg-card">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-xl font-bold">Phonebook</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="theme-toggle" className="text-sm text-muted-foreground">Theme</label>
                  <select id="theme-toggle" value={theme} onChange={e => setTheme(e.target.value)} className="p-1 rounded border bg-input text-card-foreground text-sm">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{user.username}</span>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
                <Button variant="destructive" size="sm" onClick={handleLogout}>Logout</Button>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2 pb-4">
              {navItems.map(item => (
                <NavLink key={item.to} to={item.to} end className={({ isActive }) => `${linkBase} ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-foreground'}`}>{item.label}</NavLink>
              ))}
            </nav>
          </div>
        </header>
        <main className="py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto flex-1">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default Layout
