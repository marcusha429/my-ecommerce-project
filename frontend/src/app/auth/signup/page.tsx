'use client'

import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { authService, SignupData } from '@/lib/auth'

export default function SignupPage(){
    const router = useRouter()
    //name
    //email
    //password
    //passwordconfirmation
    //handlesubmit
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{[key:string]:string}>({})

    const validateForm = () =>{
        const newErrors: {[key:string]:string} = {}

        if (!name.trim()) newErrors.name = 'Name is required'
        if (!email.trim()) newErrors.email = 'Email is required'
        if (!email.includes('@')) newErrors.email = 'Please enter a valid email'
        if (password.length < 8 || password.length >128) newErrors.password = 'Password must be from 8 to 128 characters'
        if (password !== passwordConfirmation) newErrors.passwordConfirmation = 'Password do not match'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0 //return true if no error
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() //prevent page refresh
        if(!validateForm()) return //doesn't continue if validate fails
        setIsLoading(true) //only run if validate pass

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
                alert('Sign up successful! Please sign in.')
                router.push('/auth/signin')
            }else{
                alert(`Signup failed: ${response.message}`)
            }
        }catch(error){
            alert('Something went wrong, please try again.')
        }finally{
            setIsLoading(false)
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
                            border: errors.name ?  '1px solid red':'1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: 'black'
                        }}/>
                        {errors.name && <p style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{errors.name}</p>}
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            padding: '12px',
                            border: errors.email? '1px solid red':'1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: 'black'
                        }}/>
                        {errors.email && <p style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{errors.email}</p>}
                    <input 
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        style={{
                            padding: '12px',
                            border: errors.password? '1px solid red':'1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: 'black'
                        }}/>
                        {errors.password && <p style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{errors.password}</p>}
                    <input
                        type='password'
                        placeholder='Confirm Your Password'
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        style={{
                            padding: '12px',
                            border: errors.passwordConfirmation? '1px solid red':'1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: 'black'
                        }}/>
                        {errors.passwordConfirmation && <p style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{errors.passwordConfirmation}</p>}
                    <button
                        type='submit'
                        disabled={isLoading}
                        style={{
                            padding: '12px',
                            backgroundColor: isLoading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: isLoading ? 'not-allowed':'pointer'
                        }}>
                            {isLoading ? 'Signing up...' : 'Sign Up'} 
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