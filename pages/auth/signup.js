import React from 'react'
import Singup from '../../components/authentication/Signup'
import { AuthProvider } from '../../contexts/AuthContext'
export default function signup() {
  return (
    <AuthProvider>
      <Singup/>
    </AuthProvider>
  )
}
