import React, { useState } from 'react'
import { useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import dynamic from 'next/dynamic'
import { storage, db } from '../../firebase'
import { useChat } from '../../contexts/ChatContext'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { doc, setDoc, updateDoc, get, arrayUnion, onSnapshot } from 'firebase/firestore'
import { v4 } from 'uuid'
import { URLPattern } from 'next/server'
import Image from 'next/image'
import { message } from 'antd'
import { CONSTANTS } from '@firebase/util'
// import { listAll } from 'firebase/storage'

const Picker = dynamic(
    () => {
        return import("emoji-picker-react");
    },
    { ssr: false }

);


export default function Input({ allMessages, sendMessage, editMessage, isEdit, setEdit}) {
    const [emojisOpen, setEmojisOpen] = useState(false)
    const emojiRef = useRef()
    const { currentUser } = useAuth()
    const inputRef = useRef()
    const [imgInMsg, setImgInMsg] = useState(null)
    const { data, dispatch } = useChat()
    //edit still has a bug, need to refresh after first edit
    async function handleKeyUp(e) {
        e.preventDefault()
        if (e.keyCode === 13) {
            if (isEdit) {
                let updatedMessages = [];
                allMessages.map(msg => {
                    if(msg.id === editMessage.id){
                        updatedMessages.push({ ...msg, message: inputRef.current.value })
                    } else {
                        updatedMessages.push({ ...msg })
                    }
                    const docRef = doc(db, "chats", data.chatId)
                    updateDoc(docRef,{
                        "messages": updatedMessages
                    })
                
                })
                setEdit(false)
                inputRef.current.value = ''
                return
            }
            if (!data.chatId) return
            if (imgInMsg) {
                const storageRef = ref(storage, `images/${currentUser.uid}/${imgInMsg.name + v4()}`);
                await uploadBytes(storageRef, imgInMsg).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then((url) => {
                        updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: self.crypto.randomUUID(),
                                message: inputRef.current.value,
                                image: url,
                                sender: currentUser.uid,
                                timestamp: Date.now()
                            })
                        })
                    })
                })

            } else {
                await updateDoc(doc(db, "chats", data.chatId), {
                    messages: arrayUnion({
                        id: self.crypto.randomUUID(),
                        message: inputRef.current.value,
                        sender: currentUser.uid,
                        timestamp: Date.now()
                    })
                })
            }

            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".lastMessage"]: inputRef.current.value,
                [data.chatId + ".date"]: Date.now()
            })
            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: inputRef.current.value,
                [data.chatId + ".date"]: Date.now()
            })

            inputRef.current.value = ''
            setImgInMsg(null)
        }
    }


    function clickEmogi(e) {
        setEmojisOpen(!emojisOpen)
    }

    function onEmojiClick(event, emojiObject) {
        inputRef.current.value += emojiObject.emoji
        // console.log(emojiObject)
        setEmojisOpen(false)
    }

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (!emojiRef.current) return
            if (!emojiRef.current.contains(e.target)) {
                setEmojisOpen(false);
            } else {
            }
        };
        document.addEventListener("mousedown", checkIfClickedOutside);
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        };
    }, []);

    if (!data.chatId) return null


    return (
        <div>
            <div ref={emojiRef}>
                {emojisOpen && <Picker
                    onEmojiClick={onEmojiClick}
                />}
            </div>
            <div >
                {imgInMsg && <Image
                    alt="a image you just picked"
                    width={200}
                    height={300}
                    style={{ width: "200px", height: "auto" }}
                    src={URL.createObjectURL(imgInMsg)} />}
            </div>
            <div className="bg-grey-lighter px-4 py-4 flex items-center">
                <div>
                    <svg onClick={clickEmogi} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path opacity=".45" fill="#263238" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path></svg>
                </div>
                <div>

                </div>
                <div className=" flex flex-row w-full border rounded mx-2 ">
                    <input ref={inputRef} onKeyUp={handleKeyUp}
                        defaultValue={isEdit==true ? editMessage.message : ""}
                        className="w-full h-full py-2 px-2 !outline-none border-transparent focus:border-transparent focus:ring-0" type="text" />
                    <input onChange={(e) => setImgInMsg(e.target.files[0])} className="w-full h-full py-2 px-2 hidden" type="file" id="file" multiple />
                    <label htmlFor='file' className="py-2 px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24" strokeWidth="1.5" stroke="currentColor">
                            <path opacity=".45" strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </label >
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#263238" fillOpacity=".45" d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"></path></svg>
                </div>
            </div>
        </div>
    )
}
