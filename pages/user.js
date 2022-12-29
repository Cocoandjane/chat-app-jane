import React , {useState} from 'react'
import Profile from '../components/authentication/Profile'
import { AuthProvider } from '../contexts/AuthContext'


export default function User() {
  return (
    <AuthProvider>
    <Profile/>
    </AuthProvider>
  )
}
