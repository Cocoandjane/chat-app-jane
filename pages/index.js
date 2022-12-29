
import { AuthProvider } from '../contexts/AuthContext'
import { ChatProvider } from '../contexts/ChatContext'

import ChatRooms from '../components/chat/ChatRooms'



export default function Home() {
  
  return (
    <AuthProvider>
      <ChatProvider>
      <ChatRooms/>
      </ChatProvider>
    </AuthProvider>
      
  )
}

