import React, { useState, useRef, useEffect } from 'react'
import '../styles/ChatBot.css'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Fotographiya's AI assistant. How can I help you today? 📸",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    let storedSessionId = localStorage.getItem('chatSessionId')
    if (!storedSessionId) {
      storedSessionId = generateSessionId()
      localStorage.setItem('chatSessionId', storedSessionId)
    }
    setSessionId(storedSessionId)
  }, [])

  const generateSessionId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (userMessage) => {
    const userMsg = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Server error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        const botMsg = {
          id: Date.now() + 1,
          text: data.data.message,
          sender: 'bot',
          timestamp: new Date(data.data.timestamp || Date.now())
        }
        setMessages(prev => [...prev, botMsg])
      } else {
        throw new Error(data.message || 'Failed to get response')
      }

    } catch (error) {
      console.error('Chat Error:', error)
      const fallbackMsg = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting. Please try again later or contact us at support@fotographiya.com",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, fallbackMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button className="chat-toggle-btn" onClick={toggleChat}>
        <img 
          src="/src/assets/logo/logo.jpeg" 
          alt="Chat" 
          className="chat-toggle-icon"
        />
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'open' : 'closed'}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <img 
              src="/src/assets/logo/logo.jpeg" 
              alt="Fotographiya" 
              className="chat-logo"
            />
            <div>
              <h3>Fotographiya AI</h3>
              <span className="online-status">● Online</span>
            </div>
          </div>
          <button className="close-chat-btn" onClick={toggleChat}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Chat Body */}
        <div className="chat-body">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </>
  )
}

export default ChatBot