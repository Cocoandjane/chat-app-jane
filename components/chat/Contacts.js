import React, { useEffect, useState } from 'react'
import { onSnapshot, doc, updateDoc, deleteField, where, query, collection, QuerySnapshot, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useChat } from '../../contexts/ChatContext'
import Image from 'next/image'
import { Button, Dropdown, Space } from 'antd';

export default function Contacts() {

    const { currentUser } = useAuth()
    const { data, dispatch } = useChat()
    const [contacts, setContacts] = useState([])
    const [contextMenuId, setcontextMenuId] = useState("")
    const [ContextMenuName, setContextMenuName] = useState("")
  
    // if(contacts){
    //    let newContacts = Object.entries(contacts)
    //  const filtered = newContacts.filter(data => data[1].closed===true )
    //  console.log(filtered)
    //    newContacts.forEach((contact)=>{
    //          console.log(contact[1].date, contact[1].userInfo.displayName)
    //          // console time from firebase hour and miniute
    //             // console.log(contact[1].date.toDate().getHours()+":"+ contact[1].date.toDate().getMinutes())
    //     })
    // }

    useEffect(() => {
        if (currentUser) {
            const unsub = onSnapshot(doc(db, "userChats", currentUser?.uid), where(data.chatId + ".closed", "1=", true), (doc) => {
                setContacts(doc.data())
            });
            return unsub
        }
    }, [currentUser?.uid])

    function handleSelect(user) {
        dispatch({
            type: "CHANGE_USER",
            payload: user
        })

    }

    //delete room option right click
    async function handleDeleteRoom() {
       
        //get data that is from current clicked user
        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [contextMenuId + ".closed"]: true,
        })
       
    }

    const items = [
        // {
        //     key: '1',
        //     label: (
        //         <Button type='ghost'>  View  {ContextMenuName.split(" ")[0]}'s profile</Button>
        //     ),
        //     disabled: true
        // },
        {
            key: '2',
            label: (
                <Button type='ghost' onClick={handleDeleteRoom}> Close chat with {ContextMenuName.split(" ")[0]}</Button>
            ),
        },
   
    ];

    return (
        <>
            {Object.entries(contacts).sort((a, b) => b[1].date - a[1].date).filter(data => data[1].closed !== true).map((contact) => (
                
                <div  key={contact[0]}>
                    {/* // onContextMenu={(e) => { e.preventDefault(); handleDeleteRoom(contact) }}
                    // onClick={() => handleSelect(contact[1].userInfo)}
                    // key={contact[0]} > */}
                    <Dropdown
                        menu={{
                            items,
                            // onClick,
                        }}
                        trigger={["contextMenu"]}
                        onContextMenu={() => {setcontextMenuId(contact[0]), setContextMenuName(contact[1].userInfo.displayName)}}
                    >
                        <div 
                        onClick={() => handleSelect(contact[1].userInfo)}
                        className=" bg-white px-3 flex items-center hover:bg-grey-lighter cursor-pointer ">
                            <div>
                               { contact[1].userInfo.photoURL &&  <Image
                                width={48} height={48}
                                alt={contact[1].userInfo.displayName}
                                className="rounded-full "

                                    referrerPolicy="no-referrer"
                                    src={contact[1].userInfo.photoURL} />}
                            </div>
                            <div className="ml-4 flex-1 border-b border-grey-lighter pt-4">
                                <div className="flex items-bottom justify-between">
                                    <p className="text-grey-darkest">
                                        {contact[1].userInfo.displayName}
                                    </p>
                                    <p className="text-xs text-grey-darkest">
                                        {/* {contact[1].date.toDate().getHours()+":"+ contact[1].date.toDate().getMinutes()} */}
                                        {/* {contact[1].date} */}
                                        {contact[1].date === undefined ? "nothing" : new Date(contact[1].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <p className="text-grey-dark text-sm -mt-3 truncate w-[200px] ">
                                    {contact[1].lastMessage}
                                </p>
                            </div>

                        </div>
                    </Dropdown>
                </div>


            ))}
        </>

    )
}
