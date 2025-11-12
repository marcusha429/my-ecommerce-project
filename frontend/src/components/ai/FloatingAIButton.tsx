'use client'

import { useState } from 'react'
import AIChatModal from './AIChatModal'

export default function FloatingAIButton() {
    const [showChat, setShowChat] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false) // No badge until new messages

    const handleOpenChat = () => {
        setShowChat(true)
        setHasUnreadMessages(false) // Mark messages as read when opening chat
    }

    const handleCloseChat = (hadNewMessages: boolean) => {
        setShowChat(false)
        // If there were new AI messages sent while chatting, show NEW badge when closed
        if (hadNewMessages) {
            setHasUnreadMessages(true)
        }
    }

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={handleOpenChat}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="fixed bottom-6 right-6 z-40 group"
                aria-label="Open AI Assistant"
            >
                {/* Main Button */}
                <div className="relative">
                    {/* Pulse Animation Ring - only show if has unread messages */}
                    {hasUnreadMessages && (
                        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                    )}

                    {/* Button Container */}
                    <div className={`relative bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full shadow-2xl transition-all duration-300 ${isHovered ? 'scale-110 shadow-emerald-500/50' : 'shadow-emerald-500/30'
                        }`}>
                        {/* Button Content */}
                        <div className="flex items-center gap-3 px-6 py-4">
                            {/* AI Icon */}
                            <div className={`text-3xl transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''
                                }`}>
                                🤖
                            </div>

                            {/* Text */}
                            <div className="text-white">
                                <div className="font-bold text-lg">Ask AI</div>
                                <div className="text-xs text-emerald-200">Get instant help</div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Badge - only show if has unread messages */}
                    {hasUnreadMessages && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                            NEW
                        </div>
                    )}
                </div>

                {/* Tooltip on hover */}
                {isHovered && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
                        💬 Chat with our AI assistant
                        <div className="absolute top-full right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                    </div>
                )}
            </button>

            {/* Chat Modal */}
            <AIChatModal isOpen={showChat} onClose={handleCloseChat} />
        </>
    )
}