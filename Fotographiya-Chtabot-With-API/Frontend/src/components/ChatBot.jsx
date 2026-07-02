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
      text: `Hello! I'm Fotographiya Assistant. How can I help you today? 📸`,
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const WHATSAPP_NUMBER = '918824127624'
  const PHONE_NUMBER = '+918824127624'

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
        text: `I'm having trouble connecting. Please try again later or contact us directly:\n\nCall: ${PHONE_NUMBER}\nWhatsApp: ${WHATSAPP_NUMBER}`,
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
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={toggleChat}>
          <img 
            src="/src/assets/logo/logo.jpeg" 
            alt="Chat" 
            className="chat-toggle-icon"
          />
        </button>
      )}

      <div className={`chat-window ${isOpen ? 'open' : 'closed'}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <img 
              src="/src/assets/logo/logo.jpeg" 
              alt="Fotographiya" 
              className="chat-logo"
            />
            <div className="header-text">
              <div className="brand-row">
                <span className="brand-name">Fotographiya</span>
                <span className="assistant-label">Assistant</span>
              </div>
              <div className="status-row">
                <span className="online-dot">●</span>
                <span className="online-text">Online</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
              title="Chat on WhatsApp"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width="20" 
                height="20" 
                fill="white"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a 
              href={`tel:${PHONE_NUMBER}`}
              className="call-btn"
              title="Call us"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width="20" 
                height="20" 
                fill="white"
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </a>
            <button className="close-chat-btn" onClick={toggleChat}>
              ✕
            </button>
          </div>
        </div>

        <div className="chat-body">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </>
  )
}

export default ChatBot