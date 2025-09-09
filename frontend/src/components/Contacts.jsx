import { useState, useEffect } from 'react'

function Contacts({ user }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    mobile: '',
    company_id: '',
    notes: ''
  })

  useEffect(() => {
    fetchContacts()
  }, [search, page])

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '10',
        search: search
      })

      const response = await fetch(`/api/contacts?${params}`)
      const data = await response.json()

      if (data.contacts) {
        setContacts(data.contacts)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1) // Reset to first page when searching
    fetchContacts()
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingContact
        ? `/api/contacts/${editingContact.id}`
        : '/api/contacts'
      const method = editingContact ? 'PUT' : 'POST'

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
        setEditingContact(null)
        resetForm()
        fetchContacts()
      } else {
        alert(data.error || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving contact:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setFormData({
      first_name: contact.first_name || '',
      last_name: contact.last_name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      mobile: contact.mobile || '',
      company_id: contact.company_id || '',
      notes: contact.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        fetchContacts()
      } else {
        alert(data.error || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      alert('Network error. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      mobile: '',
      company_id: '',
      notes: ''
    })
  }

  const canEdit = () => {
    return user.role === 'admin' || user.role === 'editor'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading contacts...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-foreground">Contacts</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your contact information and details.
          </p>
        </div>
        {canEdit() && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => {
                setEditingContact(null)
                resetForm()
                setShowForm(true)
              }}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Add Contact
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mt-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90"
          >
            Search
          </button>
        </form>
      </div>

      {/* Contact Form Modal */}
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
                        {editingContact ? 'Edit Contact' : 'Add New Contact'}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.first_name}
                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.last_name}
                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-muted-foreground">
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Mobile
                          </label>
                          <input
                            type="tel"
                            value={formData.mobile}
                            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Notes
                          </label>
                          <textarea
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
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
                    {editingContact ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingContact(null)
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

      {/* Contacts Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                      Contact Info
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                      Company
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">
                        {contact.first_name} {contact.last_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                        <div>
                          {contact.email && <div>{contact.email}</div>}
                          {contact.phone && <div>{contact.phone}</div>}
                          {contact.mobile && <div>{contact.mobile}</div>}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                        {contact.company ? contact.company.name : '-'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {canEdit() && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(contact)}
                              className="text-primary hover:opacity-80"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(contact.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.per_page) + 1} to {Math.min(pagination.page * pagination.per_page, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contacts
