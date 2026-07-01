import React, { useState } from 'react'
import '../styles/ChatBot.css'

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input && input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          value={input || ''}
          onChange={(e) => setInput(e.target.value || '')}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          className="chat-input-field"
        />
        <button 
          type="submit" 
          disabled={!input || !input.trim() || isLoading}
          className="send-btn"
        >
          <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
        </button>
      </div>
    </form>
  )
}

export default ChatInput