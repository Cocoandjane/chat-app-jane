import React from 'react'
import UpdateProfile from '../../components/authentication/UpdateProfile'
import { AuthProvider } from '../../contexts/AuthContext'
export default function Profile() {
  return (
    <AuthProvider>
      <UpdateProfile/>
    </AuthProvider>
  )
}
