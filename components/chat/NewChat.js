import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useRouter } from 'next/router'
import {  Button } from 'react-bootstrap'


export default function newChat() {

    const router = useRouter()
    const { currentUser, getUserByEmail } = useAuth()
    if (currentUser === undefined) return (<div>loading...</div>)

    const searchRef = useRef()
    const [members, setMembers] = useState([])

    function submitForm(e) {
        e.preventDefault()
        setMembers([...members, searchRef.current.value])
        console.log(members)
        searchRef.current.value = ''
    }



    function cancelMenber(index) {
        setMembers(members.filter((member, i) => i !== index))
    }


    async function crateRoom() {
        try {
            const roomId = await createRoom(members)
            router.push(`/chat/${roomId}`)
        } catch (e) {
            console.log(e)
        }
        // await createRoom(members)
        // const room = {user: currentUser.uid, members: members, createdAt: serverTimestamp()}
        // const roomRef = collection(db, 'rooms')
        // const docRef = await addDoc(roomRef, room)
        // console.log(docRef.id)
        // // router.push(`/chat/${docRef.id}`)
        // // router.push(`/${docRef.id}`)
        // router.push(`/`)

    }



    return (
        <div className="flex flex-col py-2 px-3 bg-grey-lighter justify-between items-center">
            <Button variant="link" onClick={() => { router.push("/") }}>Chat rooms</Button>
            <h2>Add email(s) to create a chat room</h2>

            <form onSubmit={submitForm} className="flex items-center justify-between">
                <input
                    ref={searchRef}

                    type="text" className="w-full border rounded px-2 py-2 text-sm" placeholder="Search or start new chat" />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Search
                </button>
            </form>
            {members.map((member, index) => (
                <div key={index} className="flex flex-row gap-x-3.5 my-1.5">
                    <span className="text-sm">{member}</span>
                    {member !== currentUser.email && <button
                        onClick={() => { cancelMenber(index) }}
                        type="button" className="bg-white border rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Close menu</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>}
                </div>
            ))}
            {members.length > 0 && <button
                onClick={crateRoom}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create
            </button>}

        </div>
    )
}


