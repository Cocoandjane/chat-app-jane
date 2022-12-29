import React from 'react'
import ForgotPassword from '../../components/authentication/ForgotPassword'
import { AuthProvider } from '../../contexts/AuthContext'
export default function forgotPassword() {
  return (
    <AuthProvider>
      <ForgotPassword/>
    </AuthProvider>
  )
}
