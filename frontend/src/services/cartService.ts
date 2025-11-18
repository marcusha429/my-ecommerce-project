import { API_URL as BASE_URL } from '@/lib/api'

const API_URL = `${BASE_URL}/api/cart`

// Helper to get auth token
const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken')
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

// GET /api/cart - Get user's cart
export const getCart = async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: getAuthHeader()
        })

        if (!response.ok) {
            throw new Error('Failed to get cart')
        }

        return await response.json()
    } catch (error) {
        console.error('Get cart error:', error)
        throw error
    }
}

// POST /api/cart/add - Add item to cart
export const addToCart = async (productId: string, quantity: number = 1) => {
    try {
        const response = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ productId, quantity })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to add to cart')
        }

        return await response.json()
    } catch (error) {
        console.error('Add to cart error:', error)
        throw error
    }
}

// PUT /api/cart/update - Update item quantity
export const updateCart = async (productId: string, quantity: number) => {
    try {
        const response = await fetch(`${API_URL}/update`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify({ productId, quantity })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to update cart')
        }

        return await response.json()
    } catch (error) {
        console.error('Update cart error:', error)
        throw error
    }
}

// DELETE /api/cart/remove/:productId - Remove item from cart
export const removeFromCart = async (productId: string) => {
    try {
        const response = await fetch(`${API_URL}/remove/${productId}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to remove from cart')
        }

        return await response.json()
    } catch (error) {
        console.error('Remove from cart error:', error)
        throw error
    }
}

// DELETE /api/cart/clear - Clear entire cart
export const clearCart = async () => {
    try {
        const response = await fetch(`${API_URL}/clear`, {
            method: 'DELETE',
            headers: getAuthHeader()
        })

        if (!response.ok) {
            throw new Error('Failed to clear cart')
        }

        return await response.json()
    } catch (error) {
        console.error('Clear cart error:', error)
        throw error
    }
}