import React, { useEffect, useState} from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useChat } from '../../contexts/ChatContext'
import Header from './Header'
import Search from './Search'
import Contacts from './Contacts'
import Input from './Input'
import Message from './Message'
import MessageByMe from './MessageByMe'
import RightHeader from './RightHeader'
import Pusher from 'pusher-js'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../../firebase'
import axios from 'axios'

export default function ChatRooms() {

    const { data } = useChat()
    const { currentUser } = useAuth()
    const [user, setUser] = useState([])
    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (data.chatId) {
            const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
                if (doc.exists()) {
                    setMessages(doc.data().messages)
                }
            })
            return () => {
                unsubscribe()
            }
        }
    }, [data.chatId])



    useEffect(() => {
        const unsub = setUser(currentUser?.displayName)
        return () => {
            unsub
        }
    }, [])

    // useEffect(() => {
    //     var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
    //         cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER
    //     });
    //     // my-change is the room
    //     var channel = pusher.subscribe('my-channel');
    //     //my-event is is eventlisener when someone send message to you
    //     channel.bind('my-event', function (data) {
    //         // setMessages(messages => [...messages, data.message])
    //         // alert(JSON.stringify(data));
    //     });

    //     return () => {
    //         pusher.unsubscribe('my-channel')
    //         pusher.disconnect()
    //     }
    // }, [])

    function sendMessage(message) {
        const chat = {
            id: self.crypto.randomUUID(),
            message: message,
            sender: currentUser.uid,
            timestamp: Date.now()
        }

        // user: currentUser?.displayName, message: message, timestamp: Date.now() }
        axios.post('/api/message', { chat });

    }

    return (
        <div>
            {/* 449388 */}
            <div className="w-full h-32" style={{ backgroundColor: "#449388" }}></div>
            <div className="container mx-auto" style={{ marginTop: "-82px" }}>
                <div className="py-6 h-screen">
                    <div className="flex border border-grey rounded shadow-lg h-full">
                        <div className="w-1/3 border flex flex-col">
                            <Header />
                            <div className="bg-grey-lighter flex-1 overflow-auto min-w-fit">
                                <Search />
                                <Contacts />
                            </div>
                        </div>

                        <div className="w-2/3 border flex flex-col">
                            <RightHeader />
                            <div className="flex-1 overflow-auto px-3" style={{ backgroundColor: "#DAD3CC" }}>
                                {messages !== undefined && messages.length > 0 && messages.map((message, index) => (
                                    //check if the message is from you or not
                                    message.sender === currentUser?.uid ? (
                                        <MessageByMe key={index} message={message} />
                                    ) : (
                                        <Message key={index} message={message} />)
                                ))}
                            </div>
                            <Input sendMessage={sendMessage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
