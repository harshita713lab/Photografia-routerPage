import React from 'react'
import '../styles/ChatBot.css'

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot'
  const time = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  const formatMessageText = (text) => {
    let formatted = text.replace(/\n/g, '<br />')
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    return formatted
  }

  return (
    <div className={`message-wrapper ${isBot ? 'bot' : 'user'}`}>
      <div className="message-avatar">
        {isBot ? (
          <img src="/src/assets/logo/logo.jpeg" alt="Bot" className="avatar-img" />
        ) : (
          <div className="user-avatar">👤</div>
        )}
      </div>
      <div className="message-content">
        <div className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
          <p 
            className="message-text"
            dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }}
          />
        </div>
        <span className="message-time">{time}</span>
      </div>
    </div>
  )
}

export default ChatMessage