import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import Link from 'next/link'
import CenteredContainer from './centeredContainer'
//https://temp-mail.org/en/

export default function ForgotPassword() {
    const emailRef = useRef()
    //   const passwordRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions')
            //   await login(emailRef.current.value, passwordRef.current.value)
            
        } catch {
            setError('Failed to reset password')
        }
        setLoading(false)
    }


    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Password Reset</h2>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    {message && <Alert variant='success'>{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-4" type="submit">Reset Password</Button>
                    </Form>

                    <div className='w-100 text-center mt-3'>
                        <Link href='/auth/login'>Login</Link>
                    </div>
                </Card.Body>
            </Card>

            <div className='w-100 text-center mt-2'>
                Need an account? <Link href="/auth/signup">Sign Up</Link>
            </div>
        </CenteredContainer>
    )
}
