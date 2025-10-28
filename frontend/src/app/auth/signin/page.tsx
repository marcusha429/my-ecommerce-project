'use client' //tell Nextjs this run in browser

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService, SigninData } from '@/lib/auth'

export default function SigninPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() //prevent page refresh
        setIsLoading(true)
        setErrors({})

        //create data object to send to backend
        const signinData: SigninData = { //Typescript interface
            email,
            password
        }
        try {
            console.log('Attempting to sign in...')
            const response = await authService.signin(signinData) //call authService from auth.ts

            if (response.success) {
                setErrors({ success: 'Login successful! Redirecting...' })
                const redirectPath = response.user?.role === 'admin' ? '/admin' : '/dashboard'
                setTimeout(() => {
                    router.push(redirectPath)
                }, 1000)
            } else {
                if (response.errors) {
                    setErrors(response.errors) //backend validation errors
                } else {
                    setErrors({ general: response.message })
                }
                // alert(`Login failed: ${response.message}`)
                // console.log('Error:', response.errors)
            }
        } catch (error) {
            setErrors({ general: 'Something went wrong. Please try again.' })
            // console.error('Signin error:', error)
        } finally {
            setIsLoading(false) //stop loading
        }
        // console.log('Email: ', email)
        // console.log('Password: ', password)
        // alert(`Signing in with email: ${email}`)
    }
    return (
        /*
          ┌─────────────────────────────────────┐
          │ Gray background (full screen)       │
          │                                     │
          │     ┌─────────────────────┐         │
          │     │   White card        │ ← Shadow
          │     │   (with padding)    │         │
          │     │                     │         │
          │     │   Sign In           │         │
          │     │                     │         │
          │     └─────────────────────┘         │
          │                                     │
          └─────────────────────────────────────┘
        */
        <div style={{
            minHeight: '100vh', //full screen height
            display: 'flex', //Flexbox for centering
            alignItems: 'center', //center vertically
            justifyContent: 'center', //center horizontally
            backgroundColor: '#f5f5f5' //light gray background
        }}>
            <div style={{
                backgroundColor: 'white', //white background
                padding: '40px', //space between card edge and content
                borderRadius: '8px', //round the corner
                //no horicontal offset
                //shadow drops 2px down
                //shadow blur 10px (soft and sharp)
                //black color at 10% (vbery light)
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                width: '400px' // exactly 200px wide
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'black' }}>
                    Sign In
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email} //input display email state and react is not in control of the input
                        onChange={(e) => setEmail(e.target.value)} //setEmail = update the state => update (e.target.value) = whatever user type -> then re-render with new value
                        style={{
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: 'black'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password} //connect to state
                        onChange={(e) => setPassword(e.target.value)} //update state when typing
                        style={{
                            padding: '12px',
                            //the edge thick = 1px (not thick)
                            //have the border
                            //the border is light grey when unclicked and black when click
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: 'black'
                        }} />
                    {/*Success message*/}
                    {errors.success && (
                        <div style={{
                            padding: '10px',
                            borderRadius: '4px',
                            marginBottom: '15px',
                            backgroundColor: '#d4edda',
                            color: '#155724',
                            border: '1px solid #c3e6cb'
                        }}>
                            {errors.success}
                        </div>
                    )}
                    {/*General error message*/}
                    {errors.general && (
                        <div style={{
                            padding: '10px',
                            borderRadius: '4px',
                            marginBottom: '15px',
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                            border: '1px solid #f5c6cb'
                        }}>
                            {errors.general}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading} //disable when loading
                        style={{
                            padding: '12px',
                            backgroundColor: isLoading ? '#ccc' : '#007bff', //blue button
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: isLoading ? 'not-allowed' : 'pointer' //show the hand pointer when move the mouse into
                        }}
                    >{isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <span style={{ color: 'black' }}>
                            Don't have an account?{' '}
                            <a href="/auth/signup" style={{ color: '#007bff', textDecoration: 'none' }}>
                                Sign Up
                            </a>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    )
}