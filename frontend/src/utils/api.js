// API utility functions with error handling
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error.message) {
    return error.message
  }
  return defaultMessage
}

export const showErrorToast = (message) => {
  // Simple error display - could be enhanced with a toast library
  alert(`Error: ${message}`)
}

export const showSuccessToast = (message) => {
  // Simple success display - could be enhanced with a toast library
  alert(message)
}
