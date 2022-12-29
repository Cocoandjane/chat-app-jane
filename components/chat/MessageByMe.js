import React, { useRef, useEffect } from 'react'
import Image from 'next/image'


export default function MessageByMe({ message }) {
    const msgContainerRef = useRef()
    useEffect(() => {

        msgContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    }, [])
    return (

        <div ref={msgContainerRef} className="flex justify-end mb-2">
            <div className="rounded py-2 px-3" style={{ backgroundColor: "#E2F7CB" }}>
                {message.image && <Image src={message.image} alt="image" width="0"
                    height="0"
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }} />}
                <p className="text-sm mt-1">
                    {message.user}
                </p>
                <p className="text-sm mt-1">
                    {message.message}
                </p>
                <p className="text-right text-xs text-grey-dark mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>

    )
}
