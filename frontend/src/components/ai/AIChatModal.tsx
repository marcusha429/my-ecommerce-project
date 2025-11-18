'use client'

import { useState, useEffect, useRef } from 'react'
import { API_URL } from '@/lib/api'

interface Message {
    role: 'user' | 'assistant'
    message: string
    timestamp: Date
}

interface AIChatModalProps {
    isOpen: boolean
    onClose: (hadNewMessages: boolean) => void
}

//Mock AI respond for testing
const mockAIResponses = [
    "That's a great question! Based on your needs, I recommend starting with whole grain options like oatmeal or whole wheat bread. These have a lower glycemic index which helps manage blood sugar levels.",
    "For a diabetes-friendly breakfast, consider: Greek yogurt with berries, scrambled eggs with vegetables, or steel-cut oatmeal with nuts. All these options provide protein and fiber while keeping carbs in check.",
    "I'd be happy to help! Can you tell me more about your dietary preferences or any allergies you have?",
    "Great choice! That product is organic and has excellent nutritional value. Would you like me to suggest complementary items?",
]

export default function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [initialMessageCount, setInitialMessageCount] = useState(0)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Track initial message count when modal opens
    useEffect(() => {
        if (isOpen) {
            setInitialMessageCount(messages.length)
        }
    }, [isOpen])

    //Auto-scroll to bottom when new message arrives
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim()) return

        const userMessage = input
        setInput('')

        //Add user message
        setMessages(prev => [...prev, {
            role: 'user',
            message: userMessage,
            timestamp: new Date()
        }])

        setLoading(true)

        try {
            // Get access token from localStorage
            const token = localStorage.getItem('accessToken')

            if (!token) {
                throw new Error('Please sign in to use AI chat')
            }

            // Call backend API
            const response = await fetch(`${API_URL}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMessage })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get AI response')
            }

            // Add AI response
            setMessages(prev => [...prev, {
                role: 'assistant',
                message: data.message,
                timestamp: new Date(data.timestamp)
            }])
        } catch (error: any) {
            console.error('AI Chat Error:', error)
            // Show error message to user
            setMessages(prev => [...prev, {
                role: 'assistant',
                message: `❌ Error: ${error.message}. Please try again.`,
                timestamp: new Date()
            }])
        } finally {
            setLoading(false)
        }
    }

    //Suggest question for quick start
    const suggestedQuestions = [
        "I have diabetes, what should I buy for breakfast?",
        "Suggest a healthy dinner recipe",
        "What are good protein sources?",
        "I'm on a keto diet, what products do you recommend?"
    ]

    const handleSuggestedQuestion = (question: string) => {
        setInput(question)
    }

    const handleClose = () => {
        // Check if there are new messages (AI responses) since opening
        const hadNewMessages = messages.length > initialMessageCount
        onClose(hadNewMessages)
    }

    if (!isOpen) return null

    return (
        <>
            {/* Blur Backdrop */}
            <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/10" onClick={handleClose}></div>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white rounded-2xl max-w-2xl w-full h-[600px] flex flex-col shadow-2xl pointer-events-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 p-4 rounded-t-2xl flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">🤖 Gemini AI Assistant</h2>
                        <p className="text-sm text-white/80">Ask me about meals, recipes, and healthy eating</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors w-8 h-8 flex items-center justify-center"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 mt-8">
                            <div className="text-6xl mb-4">🤖</div>
                            <p className="text-lg mb-2 text-gray-700 font-semibold">👋 Hi! I'm your grocery AI assistant</p>
                            <p className="text-sm text-gray-500 mb-6">Try asking:</p>
                            <div className="space-y-2 max-w-md mx-auto">
                                {suggestedQuestions.map((question, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestedQuestion(question)}
                                        className="block w-full text-left bg-white hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300 p-3 rounded-lg text-sm text-gray-700 transition-all shadow-sm hover:shadow"
                                    >
                                        💬 {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${msg.role === 'user'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                                }`}>
                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">🤖</span>
                                        <span className="text-xs font-semibold text-emerald-600">Gemini AI</span>
                                    </div>
                                )}
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>
                                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">🤖</span>
                                    <span className="text-xs font-semibold text-emerald-600">Gemini AI</span>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-white rounded-b-2xl">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                            placeholder="Ask about meals, recipes, or health tips..."
                            className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
                        >
                            {loading ? '...' : 'Send'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        💡 Tip: Ask about dietary restrictions, meal planning, or product recommendations
                    </p>
                </div>
            </div>
        </div>
        </>
    )
}