import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import CenteredContainer from './centeredContainer'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Singup() {
  const router = useRouter()
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login, googleLogin } = useAuth()
  const [error, setError] = useState('')



  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      await login(emailRef.current.value, passwordRef.current.value)
      router.push('/')
    } catch {
      setError('Failed to log in')
    }

  }

  async function loginWithGoogole() {
    try {
      setError("")
      await googleLogin()
      router.push('/')
    } catch (error) {
      console.log(error)
      setError("Failed to login with Google")
    }
  }



  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>

            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button className="w-100 mt-4" type="submit">Login</Button>
          </Form>

          <div className='w-100 text-center mt-3'>
            <Link href='/auth/forgotPassword'>Forgot Password?</Link>
      <Button className="w-100 mt-4" onClick={loginWithGoogole}>Login with Google</Button>
          </div>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        Need an account? <Link href="/auth/signup">Sign Up</Link> 
      </div>
    </CenteredContainer>
  )
}
