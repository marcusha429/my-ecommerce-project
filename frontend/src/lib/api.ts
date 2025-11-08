//Get API from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

//Helper function to auth token from localStorage
const getAuthToken = (): string | null => {
    //Check if running in browser ?
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken')
    }
    return null
}
//API helper object with all HTTP methods
export const api = {
    /**
   * GET request - fetch data from server
   * @param endpoint - API endpoint path (e.g., '/api/products')
   * @returns JSON response
   */
    async get(endpoint: string) {
        const response = await fetch(`${API_URL}${endpoint}`)
        if (!response.ok) {
            throw new Error(`GET ${endpoint} failed: ${response.statusText}`)
        }
        return response.json()
    },

    /**
   * POST request - create new resource
   * @param endpoint - API endpoint path
   * @param data - Data to send in request body
   * @param requireAuth - Whether to include Authorization header
   * @returns JSON response
   */
    async post(endpoint: string, data: any, requireAuth = false) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        }
        //Add Authorization header if required
        if (requireAuth) {
            const token = getAuthToken()
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        })
        return response.json()
    },

    /**
   * PUT request - update existing resource (admin only)
   * @param endpoint - API endpoint path
   * @param data - Updated data
   * @returns JSON response
   */
    async put(endpoint: string, data: any) {
        const token = getAuthToken()
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token || ''}`
            },
            body: JSON.stringify(data)
        })
        return response.json()
    },

    /**
 * DELETE request - remove resource (admin only)
 * @param endpoint - API endpoint path
 * @returns Response object (not JSON)
 */
    async delete(endpoint: string) {
        const token = getAuthToken()

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token || ''}`
            }
        })

        return response
    }
}

export { API_URL }