import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CenteredContainer from './centeredContainer'
import { useAuth } from '../../contexts/AuthContext'

export default function UpdateProfile() {
  const router = useRouter()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser,  updateEmail, updatePassword } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
 

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    const promises = []
    if(emailRef.current.value !== currentUser.email) {
        promises.push(updateEmail(emailRef.current.value))
    }
    if(passwordRef.current.value) {
        promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises).then(() => {
        // router.push('/user')
    }).catch(() => {
        setError('Failed to update account')
    }).finally(() => {
        setLoading(false)
    })

    try {
      setError('')
      setLoading(true)
    //   await signup(emailRef.current.value, passwordRef.current.value)
      // router.push('/')
    } catch {
      setError('Failed to create an account')
    }
    setLoading(false)
  }

  if(!currentUser) {
    return <div>Loading...</div>
}
  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required 
              defaultValue={currentUser.email} />
            </Form.Group>

            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" 
              placeholder='leave black to keep the same' ref={passwordRef} />
            </Form.Group>

            <Form.Group id="passwordConfirm">
              <Form.Label> Confirm Password</Form.Label>
              <Form.Control type="password" placeholder='leave black to keep the same' 
              ref={passwordConfirmRef} />
            </Form.Group>

            <Button disabled={loading} className="w-100 mt-4" type="submit">Update</Button>
          </Form>
        </Card.Body>
      </Card>

      <div className='w-100 text-center mt-2'>
        Already have an account?<Link href="/user">Cancel</Link>
      </div>
    </CenteredContainer>
  )
}
