import { useState } from 'react'
import { apiRequest, handleApiError } from '../utils/api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(formData) })
      if (data.success) return onLogin(data.user)
      setError(data.error || 'Login failed')
    } catch (err) {
      setError(handleApiError(err, 'Login failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <img src="/logo.svg" alt="Phonebook logo" className="mx-auto h-12 w-12 fade-in" />
            <CardTitle className="text-2xl font-bold">Phonebook Login</CardTitle>
            <CardDescription>Manage your contacts and company information</CardDescription>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">Admin</Badge>
              <Badge variant="secondary">Editor</Badge>
              <Badge variant="secondary">User</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input id="username" name="username" type="text" required placeholder="Enter your username" value={formData.username} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input id="password" name="password" type="password" required placeholder="Enter your password" value={formData.password} onChange={handleChange} />
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Default Credentials:</p>
              <p className="text-sm font-mono">Username: admin</p>
              <p className="text-sm font-mono">Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
