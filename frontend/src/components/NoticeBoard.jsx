import { useState, useEffect } from 'react'

function NoticeBoard({ user }) {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    is_active: true
  })

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices')
      const data = await response.json()

      if (data.notices) {
        setNotices(data.notices)
      }
    } catch (error) {
      console.error('Error fetching notices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingNotice
        ? `/api/notices/${editingNotice.id}`
        : '/api/notices'
      const method = editingNotice ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setShowForm(false)
        setEditingNotice(null)
        resetForm()
        fetchNotices()
      } else {
        alert(data.error || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving notice:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleEdit = (notice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title || '',
      content: notice.content || '',
      priority: notice.priority || 'normal',
      is_active: notice.is_active !== false
    })
    setShowForm(true)
  }

  const handleDelete = async (noticeId) => {
    if (!confirm('Are you sure you want to delete this notice?')) return

    try {
      const response = await fetch(`/api/notices/${noticeId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        fetchNotices()
      } else {
        alert(data.error || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting notice:', error)
      alert('Network error. Please try again.')
    }
  }

  const toggleActive = async (noticeId, currentStatus) => {
    try {
      const response = await fetch(`/api/notices/${noticeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      })

      const data = await response.json()

      if (data.success) {
        fetchNotices()
      } else {
        alert(data.error || 'Update failed')
      }
    } catch (error) {
      console.error('Error updating notice:', error)
      alert('Network error. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'normal',
      is_active: true
    })
  }

  const canManage = () => {
    return user.role === 'admin' || user.role === 'editor'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading notices...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-foreground">Notice Board</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Important announcements and updates for all users.
          </p>
        </div>
        {canManage() && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => {
                setEditingNotice(null)
                resetForm()
                setShowForm(true)
              }}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Add Notice
            </button>
          </div>
        )}
      </div>

      {/* Notice Form Modal */}
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
                        {editingNotice ? 'Edit Notice' : 'Add New Notice'}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Priority
                          </label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Content *
                          </label>
                          <textarea
                            rows={6}
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="Enter the notice content..."
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            id="is_active"
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="is_active" className="ml-2 block text-sm text-foreground">
                            Active (visible to users)
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
                    {editingNotice ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingNotice(null); resetForm() }}
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

      {/* Notices List */}
      <div className="mt-8 space-y-4">
        {notices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No notices found.</p>
            {canManage() && (
              <button
                onClick={() => { setEditingNotice(null); resetForm(); setShowForm(true) }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90"
              >
                Create your first notice
              </button>
            )}
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-card text-card-foreground shadow rounded-lg border-l-4 ${
                notice.priority === 'high' ? 'border-l-red-500' :
                notice.priority === 'medium' ? 'border-l-yellow-500' :
                notice.priority === 'low' ? 'border-l-green-500' :
                'border-l-gray-500'
              } ${!notice.is_active ? 'opacity-60' : ''}`}
            >
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-foreground">{notice.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notice.priority)}`}>
                      {notice.priority}
                    </span>
                    {!notice.is_active && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground/70">
                        Inactive
                      </span>
                    )}
                  </div>
                  {canManage() && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleActive(notice.id, notice.is_active)}
                        className={`text-sm ${notice.is_active ? 'text-muted-foreground hover:text-foreground' : 'text-green-600 hover:text-green-700'}`}
                      >
                        {notice.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleEdit(notice)} className="text-primary hover:opacity-80 text-sm">Edit</button>
                      <button onClick={() => handleDelete(notice.id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{notice.content}</div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Created: {formatDate(notice.created_at)}
                  {notice.updated_at !== notice.created_at && (<span> • Updated: {formatDate(notice.updated_at)}</span>)}
                  {notice.created_by && (<span> • By: {typeof notice.created_by === 'object' ? notice.created_by.username : notice.created_by}</span>)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NoticeBoard
