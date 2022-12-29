import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useRouter } from 'next/router'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    signInWithRedirect,
    updateEmail,
    updatePassword,
    onAuthStateChanged,
    reauthenticateWithCredential,
} from 'firebase/auth'
import { collection, addDoc, serverTimestamp, setDoc, getDoc, doc } from 'firebase/firestore'
const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const provider = new GoogleAuthProvider();
    const [currentUser, setCurrentUser] = useState()
    async function signup(name, email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL: "https://cdn.pixabay.com/photo/2022/10/28/11/14/leaves-7552915_1280.png"
                })
                addDoc(collection(db, "users"), {
                    uid: auth.currentUser.uid,
                    displayName: name,
                    photoURL: "https://cdn.pixabay.com/photo/2022/10/28/11/14/leaves-7552915_1280.png",
                    email: email,
                    createdAt: serverTimestamp(),
                })
                setDoc(doc(db, "userChats", auth.currentUser.uid),{})
            }).then(()=>{
                signInWithEmailAndPassword(auth, email, password)
            })
            
    }


    async function getUserByEmail(email) {
        const userRef = doc(db, "users", email);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
            return userSnapshot.data()
        } else {
            return null
        }
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    function resetPassword(email) {

        return sendPasswordResetEmail(auth, email)
    }

    if (!currentUser) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user)
            } else {
                setCurrentUser(null)
            }
        })
    }


    function updateEmail(email) {
        console.log(auth.currentUser.updateEmail)
        return currentUser.updateEmail(auth, email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(auth, password)
    }

   async function googleLogin() {
        const result =  await signInWithPopup(auth, provider)
        const user = result.user
        setCurrentUser(user)
        const userRef =  doc(db, "users", user.uid)
        const docSnap =  await getDoc(userRef)
        if (!docSnap.exists()) {
             setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
            })
             setDoc(doc(db, "userChats", auth.currentUser.uid),{})
        }
    }   

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })

        return unsubscribe
    }, [])



    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        googleLogin,
        getUserByEmail,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
