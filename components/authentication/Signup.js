import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CenteredContainer from './centeredContainer'

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const {currentUser, signup } = useAuth()
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    try {
      setError('')
      await signup(firstNameRef.current.value + " " + lastNameRef.current.value, emailRef.current.value, passwordRef.current.value)
      router.push('/')
    } catch(err) {
      console.log(err)
      setError('Failed to create an account')
    }
  }


  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {currentUser && currentUser.email}
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>

          <Form.Group id="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" ref={firstNameRef} required />
            </Form.Group>

            <Form.Group id="LastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" ref={lastNameRef} required />
            </Form.Group>

            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>

            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>

            <Form.Group id="passwordConfirm">
              <Form.Label> Confirm Password</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>

            <Button  className="w-100 mt-4" type="submit">Sign up</Button>
          </Form>
        </Card.Body>
      </Card>

      <div className='w-100 text-center mt-2'>
        Already have an account?<Link href="/auth/login">Log In</Link>
      </div>
    </CenteredContainer>
  )
}
