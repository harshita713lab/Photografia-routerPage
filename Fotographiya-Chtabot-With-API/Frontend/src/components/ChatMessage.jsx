// ChatMessage.jsx
import React from 'react'
import '../styles/ChatBot.css'

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot'
  const time = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  const formatMessageText = (text) => {
    if (!text) return ''
    
    let formatted = text
    
    // Find all links [Text](URL)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const links = []
    let match
    
    // Extract all links
    while ((match = linkRegex.exec(text)) !== null) {
      links.push({
        text: match[1],
        url: match[2]
      })
    }
    
    // If no links, just return text with newlines
    if (links.length === 0) {
      return text.replace(/\n/g, '<br />')
    }
    
    // Build the HTML
    let result = ''
    let lastIndex = 0
    let linkIndex = 0
    
    // Reset regex to find positions
    linkRegex.lastIndex = 0
    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before link
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index)
        if (beforeText.trim()) {
          result += beforeText.replace(/\n/g, '<br />')
        }
      }
      
      // Add the link (will be wrapped in container later)
      result += `__LINK_${linkIndex}__`
      linkIndex++
      
      lastIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      const afterText = text.substring(lastIndex)
      if (afterText.trim()) {
        result += afterText.replace(/\n/g, '<br />')
      }
    }
    
    // Replace link placeholders with actual link HTML
    links.forEach((link, index) => {
      const placeholder = `__LINK_${index}__`
      const linkHtml = `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="chat-inline-link">${link.text}</a>`
      result = result.replace(placeholder, linkHtml)
    })
    
    // Wrap ALL links in a container if there are multiple
    // Count how many links in the result
    const linkCount = links.length
    
    if (linkCount > 0) {
      // Extract all link HTML from result
      const linkHtmls = links.map((link, index) => {
        return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="chat-inline-link">${link.text}</a>`
      })
      
      // Build final result with container
      let finalResult = ''
      
      // Get text before first link
      const firstLinkIndex = result.indexOf(linkHtmls[0])
      if (firstLinkIndex > 0) {
        finalResult += result.substring(0, firstLinkIndex)
      }
      
      // Add the link container
      finalResult += `<div class="link-container">${linkHtmls.join('')}</div>`
      
      // Get text after last link
      const lastLinkEnd = result.lastIndexOf(linkHtmls[linkHtmls.length - 1]) + linkHtmls[linkHtmls.length - 1].length
      if (lastLinkEnd < result.length) {
        finalResult += result.substring(lastLinkEnd)
      }
      
      // Clean up extra newlines
      finalResult = finalResult.replace(/\n{2,}/g, '\n')
      
      return finalResult
    }
    
    return result
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