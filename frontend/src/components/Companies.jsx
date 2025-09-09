import { useState, useEffect } from 'react'

function Companies({ user }) {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    description: ''
  })

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      const data = await response.json()

      if (data.companies) {
        setCompanies(data.companies)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingCompany
        ? `/api/companies/${editingCompany.id}`
        : '/api/companies'
      const method = editingCompany ? 'PUT' : 'POST'

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
        setEditingCompany(null)
        resetForm()
        fetchCompanies()
      } else {
        alert(data.error || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving company:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleEdit = (company) => {
    setEditingCompany(company)
    setFormData({
      name: company.name || '',
      industry: company.industry || '',
      website: company.website || '',
      email: company.email || '',
      phone: company.phone || '',
      address: company.address || '',
      city: company.city || '',
      state: company.state || '',
      zip_code: company.zip_code || '',
      country: company.country || '',
      description: company.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (companyId) => {
    if (!confirm('Are you sure you want to delete this company?')) return

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        fetchCompanies()
      } else {
        alert(data.error || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting company:', error)
      alert('Network error. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      industry: '',
      website: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      description: ''
    })
  }

  const canEdit = () => {
    return user.role === 'admin' || user.role === 'editor'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading companies...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-foreground">Companies</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your company information and details.
          </p>
        </div>
        {canEdit() && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => {
                setEditingCompany(null)
                resetForm()
                setShowForm(true)
              }}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Add Company
            </button>
          </div>
        )}
      </div>

      {/* Company Form Modal */}
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
                        {editingCompany ? 'Edit Company' : 'Add New Company'}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-muted-foreground">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Industry
                          </label>
                          <input
                            type="text"
                            value={formData.industry}
                            onChange={(e) => setFormData({...formData, industry: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Website
                          </label>
                          <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
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
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-muted-foreground">
                            Address
                          </label>
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            value={formData.zip_code}
                            onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            Country
                          </label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-muted-foreground">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-input bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                    {editingCompany ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingCompany(null)
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

      {/* Companies Table */}
      <div className="mt-8 flex flex-col">
        <div className="overflow-hidden shadow ring-1 ring-border md:rounded-lg">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                  Company
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                  Industry
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                  Contact Info
                </th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">
                    <div>
                      <div className="font-medium">{company.name}</div>
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:opacity-80 text-xs"
                        >
                          {company.website}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                    {company.industry || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                    <div>
                      {company.email && <div>{company.email}</div>}
                      {company.phone && <div>{company.phone}</div>}
                      {(company.city || company.state) && (
                        <div>{[company.city, company.state].filter(Boolean).join(', ')}</div>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                    {canEdit() && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(company)}
                          className="text-primary hover:opacity-80"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="text-red-600 hover:text-red-700"
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

      {companies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No companies found.</p>
          {canEdit() && (
            <button
              onClick={() => {
                setEditingCompany(null)
                resetForm()
                setShowForm(true)
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90"
            >
              Add your first company
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Companies
