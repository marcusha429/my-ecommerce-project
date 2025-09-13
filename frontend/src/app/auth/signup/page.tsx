'use client'

import {useState} from 'react'
import { authService, SignupData } from '@/lib/auth'

export default function SignupPage(){
    //name
    //email
    //password
    //passwordconfirmation
    //handlesubmit
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const signupData: SignupData = {
            name,
            email,
            password,
            passwordConfirmation
        }
        try{
            console.log('Attempting to sign up...')
            const response = await authService.signup(signupData)

            if(response.success){
                alert('Sign up successful')
            }else{
                alert(`Signup failed: ${response.message}`)
            }
        }catch(error){
            alert('Something went wrong, please try again.')
        }
    }

    return(
        <div style = {{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                width: '400px'
            }}>
                <h2 style = {{textAlign: 'center', marginBottom: '30px', color: 'black'}}>
                    Sign Up
                </h2>
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <input
                        type="text"
                        placeholder='Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: 'black'
                        }}/>
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: 'black'
                        }}/>
                    <input 
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        style={{
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: 'black'
                        }}/>
                    <input
                        type='password'
                        placeholder='Confirm Your Password'
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        style={{
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: 'black'
                        }}/>
                    <button
                        type='submit'
                        style={{
                            padding: '12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}>
                            Sign Up 
                    </button>
                    <div style={{textAlign: 'center', marginTop: '20px'}}>
                        <span style={{color: 'black'}}>
                            Already have an account?{' '}
                            <a href="/auth/signin" style={{color: '#007bff', textDecoration: 'none'}}>
                                Sign In
                            </a>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    )
}