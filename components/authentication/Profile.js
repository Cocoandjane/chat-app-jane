import React, { useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CenteredContainer from './centeredContainer'



export default function Profile() {
    const [error, setError] = useState('')
    const { currentUser, logout } = useAuth()
    const router = useRouter()

    if (currentUser === null) {
        router.push('/auth/login')
    }

    async function handleLogout() {
        setError('')

        try {
            await logout()
            router.push('auth/login')
        } catch {
            setError('Failed to log out')

        }
    }
    let jsx = null

    if (currentUser) {
        jsx = (
            <>
                <Card>
                    <Card.Body >
                        <h2 className="text-center mb-4">{currentUser?.displayName.split(" ")[0]}
                        </h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <img
                            referrerPolicy="no-referrer"
                            className="w-20 h-20 rounded-full mx-auto mb-2" src={currentUser?.photoURL} referrerPolicy='no-referrer' />

                        <div className="text-center">
                            <strong>Email:</strong> {currentUser.email}
                        </div>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    <Button variant="link" onClick={() => { router.push("/") }}>Chat rooms</Button>
                    <Button variant="link" onClick={handleLogout}>Log Out</Button>
                </div>
            </>
        )
    } else {
        jsx = (
            <div>
                <h1>Not logged in</h1>
                <Link href="auth/login">Login</Link>
            </div>
        )
    }

    return (
        <CenteredContainer>
            {jsx}
        </CenteredContainer>
    )
}
