import React , {useState} from 'react'
import Profile from '../components/authentication/Profile'
import { AuthProvider } from '../contexts/AuthContext'
import {useRouter} from 'next/router'

export default function user() {

  const router = useRouter()
  const [currentUser, setCurrentUser] = useState('')

  if(currentUser === null) {

    router.push('/auth/login')
}
  return (
    <AuthProvider>
    <Profile/>
    </AuthProvider>
  )
}
