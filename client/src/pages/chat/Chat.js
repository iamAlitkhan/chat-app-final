import React from 'react'
import { ChatLayout } from '../../components/chat/ChatLayout';


export const Chat = () => {
    return (
        <ChatLayout usersSide>
            <h1 className='text-center' style={{ marginTop: '20vh' }}>Click on any user to see your chat with them here!</h1>
        </ChatLayout>
    )
}
