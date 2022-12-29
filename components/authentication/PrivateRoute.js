import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'

export default function PrivateRoute({ Children }) {
    
    const auth = useAuth()
    return auth ? <Children /> : Navigate('/login');
}

