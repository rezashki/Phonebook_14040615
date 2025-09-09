import { useState, useEffect } from 'react'

function UserManagement({ user }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    is_active: true,
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user.role === 'admin') {
      fetchUsers()
    }
  }, [user.role])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()

      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const url = editingUser
        ? `/api/users/${editingUser.id}`
        : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'

      const submitData = { ...formData }
      if (!editingUser && !submitData.password) {
        alert('Password is required for new users')
        return
      }
      if (editingUser && !submitData.password) {
        delete submitData.password
      }
      delete submitData.confirmPassword

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const data = await response.json()

      if (data.success) {
        setShowForm(false)
        setEditingUser(null)
        resetForm()
        fetchUsers()
      } else {
        alert(data.error || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleEdit = (userData) => {
    setEditingUser(userData)
    setFormData({
      username: userData.username || '',
      email: userData.email || '',
      role: userData.role || 'user',
      is_active: userData.is_active !== false,
      password: '',
      confirmPassword: ''
    })
    setShowForm(true)
  }

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        fetchUsers()
      } else {
        alert(data.error || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Network error. Please try again.')
    }
  }

  const toggleActive = async (userId, currentStatus) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      })

      const data = await response.json()

      if (data.success) {
        fetchUsers()
      } else {
        alert(data.error || 'Update failed')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Network error. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      role: 'user',
      is_active: true,
      password: '',
      confirmPassword: ''
    })
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
  return 'bg-destructive/20 text-destructive'
      case 'editor':
  return 'bg-primary/20 text-primary'
      case 'user':
  return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
      default:
  return 'bg-muted text-muted-foreground'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (user.role !== 'admin') {
    return (
  <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-foreground">Access Denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">You don't have permission to access user management.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage user accounts, roles, and permissions.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setEditingUser(null)
              resetForm()
              setShowForm(true)
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Add User
          </button>
        </div>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-foreground/40"></div>
            </div>
            <div className="inline-block align-bottom bg-card text-card-foreground rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleFormSubmit}>
                <div className="bg-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-foreground mb-4">
                        {editingUser ? 'Edit User' : 'Add New User'}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Username *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Role
                          </label>
                          <select
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          >
                            <option value="user">User</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Password {editingUser ? '(leave blank to keep current)' : '*'}
                          </label>
                          <input
                            type="password"
                            required={!editingUser}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Confirm Password {editingUser ? '(leave blank to keep current)' : '*'}
                          </label>
                          <input
                            type="password"
                            required={!editingUser}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            id="is_active"
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                            className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                          />
                          <label htmlFor="is_active" className="ml-2 block text-sm text-foreground">
                            Active
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-muted px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-primary-foreground text-base font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingUser(null)
                      resetForm()
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-border shadow-sm px-4 py-2 bg-card text-base font-medium text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="mt-8 flex flex-col">
        <div className="overflow-hidden shadow ring-1 ring-border md:rounded-lg">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                  User
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                  Role
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                  Created
                </th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {users.map((userData) => (
                <tr key={userData.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div>
            <div className="font-medium text-foreground">{userData.username}</div>
            <div className="text-muted-foreground">{userData.email}</div>
                    </div>
                  </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userData.role)}`}>
                      {userData.role}
                    </span>
                  </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            userData.is_active ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {userData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                    {formatDate(userData.created_at)}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => toggleActive(userData.id, userData.is_active)}
            className={`text-sm ${userData.is_active ? 'text-muted-foreground hover:text-foreground' : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'}`}
                      >
                        {userData.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(userData)}
            className="text-primary hover:opacity-80 text-sm"
                      >
                        Edit
                      </button>
                      {userData.id !== user.id && (
                        <button
                          onClick={() => handleDelete(userData.id)}
              className="text-destructive hover:opacity-80 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found.</p>
          <button
            onClick={() => {
              setEditingUser(null)
              resetForm()
              setShowForm(true)
            }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90"
          >
            Create your first user
          </button>
        </div>
      )}
    </div>
  )
}

export default UserManagement
