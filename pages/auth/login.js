import React from 'react'
import Login from '../../components/authentication/Login'
import { AuthProvider } from '../../contexts/AuthContext'

export default function login() {
  return (
    <AuthProvider>
      <Login/>
    </AuthProvider>
  )
}
