import React, { useState } from 'react'
import { useRef, useEffect } from 'react'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'

import { collection, query, where, getDocs, getDoc,update, addDoc, setDoc,updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { async } from '@firebase/util';
export default function Search() {
    const [userName, setUserName] = useState('')
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)

    const { currentUser } = useAuth()

    const handleSearch = async () => {
        // const q = query(collection(db, "users"), where("displayName"), "==", userName);
        // const q = query(collection(db, "users"), where('displayName', '>=', userName), where('displayName', '<=', userName + '\uf8ff'))
        if (userName === '') {
            setUser(null)
            return
        }
        const q = query(collection(db, "users"), where('displayName', '>=', userName), where('displayName', '<=', userName + '\uf8ff'))
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                setUser(doc.data())
            })
        }
        catch (err) {
            setError(true)
        }
    }

    function handleKeyDown(e) {
   
        handleSearch()
        // if (e.key === 'Enter') {
        //     handleSearch()
        // }
    }
    //chats
    //5ZlDRQi6X9SLW7PVWmcsSIPUVGJ21hprOf1AtnMEfefTLxEUrhTNj6d2 me
    //iygfEVpD8nhDhbMUh1tsjN3RTCa21hprOf1AtnMEfefTLxEUrhTNj6d2 me

    //iygfEVpD8nhDhbMUh1tsjN3RTCa25ZlDRQi6X9SLW7PVWmcsSIPUVGJ2 not me


    //userChats
    //1hprOf1AtnMEfefTLxEUrhTNj6d2 me
    //the following 2 chattings are in my userChat list
     //5ZlDRQi6X9SLW7PVWmcsSIPUVGJ21hprOf1AtnMEfefTLxEUrhTNj6d2 me
    //iygfEVpD8nhDhbMUh1tsjN3RTCa21hprOf1AtnMEfefTLxEUrhTNj6d2 me
    async function handleSelect() {
        console.log(user)
        console.log("select")
        console.log(currentUser.uid)
        console.log(user.uid)
        const combindId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid
        try {
            const result = await getDoc(doc(db, "chats", combindId))
            if (!result.exists()) {

                await setDoc(doc(db, "chats", combindId), { message: [] })
            
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combindId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combindId +".date"]: Date.now()
                })
                await updateDoc(doc(db, "userChats", user.uid), {
                    [combindId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combindId +".date"]: Date.now()
                })
            }

         
            if(result.exists()){
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combindId + ".closed"]: false,
                })
            }

        } catch (e) {
            console.log(e)
        }
        setUser(null)
        setUserName('')
    }
    return (
        <div >
            <div className="py-2 px-2 bg-grey-lightest" style={{backgroundColor : "#F5F5F5"}} >
                <input 
                    onKeyDown={handleKeyDown}
                    onChange={e => setUserName(e.target.value)}
                    value={userName}
                    type="text" className="w-full px-2 py-2 text-sm !outline-none border-transparent focus:border-transparent focus:ring-0" placeholder="Search or start new chat" />
            </div>
            {error && <div>user not found</div>}
            {user !== null && <div
                onClick={handleSelect}
                className="flex items-center justify-between px-2 py-2">
                <Image
                width={45} height={45}
                referrerPolicy="no-referrer"
                alt="search result image"
                src={user.photoURL}  className="w-8 h-8 rounded-full" />
                {user.displayName}
            </div>}
        </div>
    )
}
