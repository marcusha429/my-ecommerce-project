import axios from 'axios' //comnicate with backend API //1
import Cookies from 'js-cookie' //2

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api' //3

const api = axios.create({
    baseURL: API_URL, //from .env.local
    withCredentials: true, //important: send http-only cookies with requests
    headers: {
        'Content-Type': 'application/json' //tell backend we're sending json data
    }
})

export interface SignupData {
    name: string
    email: string
    password: string
    passwordConfirmation: String
}

export interface SigninData {
    email: string
    password: string
}

//response type from backend
export interface AuthResponse {
    success: boolean
    message: string
    accessToken?: string
    user?: {
        id: string
        name: string
        email: string
    }
    errors?: Record<string, string> //for validation errros like {"email": "Invalid email format"}
}

export const authService = {
    //sign up new user
    signup: async (data: SignupData): Promise<AuthResponse> => {
        try {
            console.log('Sending signup request to backend...')
            const response = await api.post('/auth/signup', data)
            console.log('Signup reponse', response.data)

            return response.data
        } catch (error: any) {
            console.error('Signup error:', error)

            //Handle validation errors from your backend
            if (error.response?.data) {
                return error.response.data
            }

            //Handle network errors
            return {
                success: false,
                message: 'Network error. Please check your connection and try again.',
                errors: { general: 'Unabale to connect to server' }
            }
        }
    },

    //sign in existing user
    signin: async (data: SigninData): Promise<AuthResponse> => {
        try {
            console.log('Sending signin request to backend...')
            const response = await api.post('/auth/signin', data)
            console.log('Signin reponse', response.data)

            //If login successful, store access token in cookie
            if (response.data.success && response.data.accessToken) {
                //Don't save local
                // localStorage.setItem('accessToken', response.data.accessToken)
                console.log('Access token stored in localStorage')

                //Note: Refresh token is auto stored as http-only cookie by backend
            }
            return response.data
        } catch (error: any) {
            console.error('Signin error:', error)
            //Dandle validation/authentication errros
            if (error.response?.data) {
                return error.response.data
            }
            //Handle network errors
            return {
                success: false,
                message: 'Network error. Please check your connection and try again.',
                errors: { general: 'Unable to connect to server' }
            }
        }
    },

    //logout
    logout: async (): Promise<AuthResponse> => {
        try {
            const response = await api.post('/auth/logout')
            localStorage.removeItem('accessToken')
            return response.data
        } catch (error: any) {
            localStorage.removeItem('accessToken')
            return {
                success: true,
                message: 'Logged out'
            }
        }
    },

    //refresh token
    refreshToken: async (): Promise<AuthResponse> => {
        try {
            //call backend
            //refresh token auto sent as cookie
            const response = await api.post('/auth/refresh')

            //success -> store new access token
            if (response.data.success && response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken)
            }
            return response.data
        } catch (error) {
            //if fail, clear everything, must relogin
            localStorage.removeItem('accessToken')
            return {
                success: false,
                message: 'Session expired'
            }
        }
    }

}