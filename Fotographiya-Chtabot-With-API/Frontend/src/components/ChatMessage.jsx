// ChatMessage.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/ChatBot.css';

// ✅ FIX 1: Better Link Button with validation
const LinkButton = ({ href, text }) => {
  // Validate and fix URL
  let validHref = href;
  
  // Handle different URL types
  if (!validHref) {
    validHref = 'https://www.fotographiya.com/contact';
  } else if (!validHref.startsWith('http') && 
             !validHref.startsWith('tel:') && 
             !validHref.startsWith('mailto:') &&
             !validHref.startsWith('#')) {
    validHref = `https://${validHref}`;
  }
  
  // Fix common malformed URLs
  if (validHref.includes('destination-wedding-services') || 
      validHref.includes('destination-weddingservices')) {
    validHref = 'https://www.fotographiya.com/services/destination-wedding';
  }
  
  if (validHref === 'https://www.' || validHref === 'http://www.') {
    validHref = 'https://www.fotographiya.com/about';
  }

  return (
    <a 
      href={validHref} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="chat-inline-link"
      onClick={(e) => {
        // Don't prevent default for tel: and mailto: links
        if (href.startsWith('tel:') || href.startsWith('mailto:')) {
          return;
        }
        e.stopPropagation();
      }}
    >
      {text}
    </a>
  );
};

// ✅ FIX 2: Better Social Media Link Detection
const isSocialMediaLink = (href) => {
  const socialDomains = [
    'facebook.com', 'instagram.com', 'youtube.com', 
    'pexels.com', 'reddit.com', 'linkedin.com', 'medium.com'
  ];
  return socialDomains.some(domain => href.includes(domain));
};

// ✅ FIX 3: Parse message with better link handling
const parseMessage = (text) => {
  if (!text) return [{ type: 'text', content: text || '' }];
  
  const segments = [];
  let remaining = text;
  
  // First, protect existing markdown links that might be in the text
  // Find all [text](url) patterns and replace with placeholders
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const linkMatches = [];
  let linkMatch;
  
  // Collect all links first
  while ((linkMatch = linkRegex.exec(remaining)) !== null) {
    linkMatches.push({
      text: linkMatch[1],
      url: linkMatch[2],
      index: linkMatch.index,
      fullMatch: linkMatch[0]
    });
  }
  
  // If no links found, return as plain text
  if (linkMatches.length === 0) {
    return [{ type: 'text', content: text }];
  }
  
  // Build segments by splitting around links
  let lastIndex = 0;
  for (const match of linkMatches) {
    // Add text before this link
    if (match.index > lastIndex) {
      const textBefore = remaining.slice(lastIndex, match.index);
      if (textBefore.trim()) {
        segments.push({ type: 'text', content: textBefore });
      }
    }
    
    // Add the link
    segments.push({
      type: 'link',
      text: match.text,
      href: match.url
    });
    
    lastIndex = match.index + match.fullMatch.length;
  }
  
  // Add remaining text after last link
  if (lastIndex < remaining.length) {
    const remainingText = remaining.slice(lastIndex);
    if (remainingText.trim()) {
      segments.push({ type: 'text', content: remainingText });
    }
  }
  
  // ✅ FIX 4: Group consecutive links together
  const groupedSegments = [];
  let currentGroup = [];
  
  for (const segment of segments) {
    if (segment.type === 'link') {
      currentGroup.push(segment);
    } else {
      // If we have a group of links, add them
      if (currentGroup.length > 0) {
        groupedSegments.push({
          type: 'linkGroup',
          links: [...currentGroup]
        });
        currentGroup = [];
      }
      // Add text segment
      groupedSegments.push(segment);
    }
  }
  
  // Add any remaining links
  if (currentGroup.length > 0) {
    groupedSegments.push({
      type: 'linkGroup',
      links: [...currentGroup]
    });
  }
  
  return groupedSegments;
};

// ✅ FIX 5: Custom components for markdown rendering
const markdownComponents = {
  a: ({ href, children }) => {
    // Don't render links inside the message if they'll be handled separately
    // This prevents duplicate rendering
    return (
      <span className="markdown-link-wrapper">
        <LinkButton href={href} text={children} />
      </span>
    );
  },
  
  p: ({ children }) => (
    <p className="message-text">{children}</p>
  ),
  
  strong: ({ children }) => (
    <strong className="chat-bold">{children}</strong>
  ),
  
  em: ({ children }) => (
    <em className="chat-italic">{children}</em>
  ),
  
  ul: ({ children }) => (
    <ul className="chat-list">{children}</ul>
  ),
  
  ol: ({ children }) => (
    <ol className="chat-list chat-list-ordered">{children}</ol>
  ),
  
  li: ({ children, ordered }) => {
    const prefix = ordered ? '' : '• ';
    return <li className="chat-list-item">{prefix}{children}</li>;
  },
  
  h1: ({ children }) => <h1 className="chat-heading chat-heading-1">{children}</h1>,
  h2: ({ children }) => <h2 className="chat-heading chat-heading-2">{children}</h2>,
  h3: ({ children }) => <h3 className="chat-heading chat-heading-3">{children}</h3>,
  
  br: () => <br className="chat-line-break" />,
  
  code: ({ children }) => (
    <code className="chat-inline-code">{children}</code>
  ),
};

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  const time = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // ✅ FIX 6: User messages - render plain text with line breaks
  if (!isBot) {
    return (
      <div className={`message-wrapper user`}>
        <div className="message-avatar">
          <div className="user-avatar">👤</div>
        </div>
        <div className="message-content">
          <div className="message-bubble user-bubble">
            <p className="message-text user-message-text">
              {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>
          <span className="message-time">{time}</span>
        </div>
      </div>
    );
  }

  // ✅ FIX 7: Bot messages - parse and render with links
  const segments = parseMessage(message.text);

  // If no segments or just text, render with markdown
  if (segments.length === 0 || segments.every(s => s.type === 'text')) {
    const content = segments.length > 0 ? segments[0].content : message.text;
    return (
      <div className={`message-wrapper bot`}>
        <div className="message-avatar">
          <img src="/src/assets/logo/logo.jpeg" alt="Bot" className="avatar-img" />
        </div>
        <div className="message-content">
          <div className="message-bubble bot-bubble">
            <ReactMarkdown components={markdownComponents}>
              {content || ''}
            </ReactMarkdown>
          </div>
          <span className="message-time">{time}</span>
        </div>
      </div>
    );
  }

  // ✅ FIX 8: Render with link groups
  return (
    <div className={`message-wrapper bot`}>
      <div className="message-avatar">
        <img src="/src/assets/logo/logo.jpeg" alt="Bot" className="avatar-img" />
      </div>
      <div className="message-content">
        <div className="message-bubble bot-bubble">
          {segments.map((segment, idx) => {
            if (segment.type === 'linkGroup') {
              // Render grouped links
              return (
                <div key={`link-group-${idx}`} className="link-container">
                  {segment.links.map((link, lIdx) => (
                    <LinkButton 
                      key={`link-${idx}-${lIdx}`} 
                      href={link.href} 
                      text={link.text} 
                    />
                  ))}
                </div>
              );
            } else if (segment.type === 'link') {
              // Single link - render as button
              return (
                <div key={`single-link-${idx}`} className="link-container">
                  <LinkButton href={segment.href} text={segment.text} />
                </div>
              );
            } else {
              // Text content - render with markdown
              return (
                <ReactMarkdown key={`text-${idx}`} components={markdownComponents}>
                  {segment.content || ''}
                </ReactMarkdown>
              );
            }
          })}
        </div>
        <span className="message-time">{time}</span>
      </div>
    </div>
  );
};

export default ChatMessage;