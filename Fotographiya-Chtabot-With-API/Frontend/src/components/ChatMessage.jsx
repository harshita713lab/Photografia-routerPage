// ChatMessage.jsx - COMPLETE REPLACEMENT WITH ALL SOCIAL LINKS

import React from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/ChatBot.css';
//import { keywords } from '../../../Backend/src/data/companyData';

// ============================================
// ✅ MASTER KEYWORD TO LINK MAPPING (COMPLETE)
// ============================================

const LINK_CONFIG = {
  // ============================================
  // 📌 SOCIAL MEDIA - INDIVIDUAL
  // ============================================
  instagram: {
    keywords: ['instagram', 'insta', 'ig', 'social'],
    link: 'https://www.instagram.com/fotographiya_official/',
    label: 'Instagram',
    icon: '📸'
  },
  facebook: {
    keywords: ['facebook', 'fb', 'facebootk', 'fsbuk', 'social'],
    link: 'https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/',
    label: 'Facebook',
    icon: '📘'
  },
  youtube: {
    keywords: ['youtube', 'yt', 'you tube'],
    link: 'https://www.youtube.com/@Fotographiya_official',
    label: 'YouTube',
    icon: '🎬'
  },
  linkedin: {
    keywords: ['linkedin', 'linked in'],
    link: 'https://www.linkedin.com/company/fotographiya',
    label: 'LinkedIn',
    icon: '💼'
  },
  medium: {
    keywords: ['medium'],
    link: 'https://medium.com/@fotographiya',
    label: 'Medium',
    icon: '📝'
  },
  reddit: {
    keywords: ['reddit'],
    link: 'https://www.reddit.com/r/fotographiya',
    label: 'Reddit',
    icon: '🤖'
  },
  pexels: {
    keywords: ['pexels', 'pixel', 'pixels'],
    link: 'https://www.pexels.com/@fotographiya',
    label: 'Pexels',
    icon: '🖼️'
  },
  whatsapp: {
  keywords: ['whatsapp', 'wa', 'message', 'chat', 'text'],  // ← UNIQUE
  link: 'https://wa.me/919001110144',
  label: 'WhatsApp',
  icon: '💬'
  },
  Pinterest: {
    keywords: ['pinterest', 'pin', 'pins'],
    link: 'https://in.pinterest.com/fotographiya_thewedphotography/?invite_code=93a6af9d4e644a7890acaebef80d2e3d&sender=1152569867044695903',
    label: 'Pinterest',
    icon: '🖼️'

  },


  
  // ============================================
  // 📌 SOCIAL MEDIA - ALL (GROUP)
  // ============================================
  allSocial: {
    keywords: ['social media', 'social accounts', 'all social', 'social platforms', 'all platforms', 'social links'],
    links: [
      { label: '📸 Instagram', link: 'https://www.instagram.com/fotographiya_official/' },
      { label: '📘 Facebook', link: 'https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/' },
      { label: '🎬 YouTube', link: 'https://www.youtube.com/@Fotographiya_official' },
      { label: '💼 LinkedIn', link: 'https://www.linkedin.com/company/fotographiya' },
      { label: '📝 Medium', link: 'https://medium.com/@fotographiya' },
      { label: '🤖 Reddit', link: 'https://www.reddit.com/r/fotographiya' },
      { label: '🖼️ Pexels', link: 'https://www.pexels.com/@fotographiya' }
    ]
  },

  // ============================================
  // 📌 SERVICES
  // ============================================
  maternity: {
    keywords: ['maternity', 'pregnancy', 'baby bump', 'motherhood', 'baby shower', 'baby'],
    link: 'https://www.fotographiya.com/services/maternity-photography',
    label: 'Maternity Photography',
    icon: '👶'
  },
  prewedding: {
    keywords: ['pre wedding', 'pre-wedding', 'prewedding', 'engagement'],
    link: 'https://www.fotographiya.com/services/prewedding-photography',
    label: 'Pre-Wedding Photography',
    icon: '📸'
  },
  wedding: {
    keywords: ['wedding', 'marriage', 'shaadi', 'haldi', 'mehendi', 'Sangeet', 'Reception', 'Bride entry', 'Groom entry', 'Baraat', 'Vidaai', 'Family portraits'],
    link: 'https://www.fotographiya.com/services/wedding-photography',
    label: 'Wedding Photography',
    icon: '💍'
  },
  destination: {
    keywords: ['destination wedding', 'destination', 'Reception', 'Bride entry', 'Groom entry', 'Baraat', 'vidaai', 'family portraits'],
    link: 'https://www.fotographiya.com/services/destination-wedding',
    label: 'Destination Wedding',
    icon: '🏖️'
  },
  birthday: {
    keywords: ['birthday', 'cake smash', 'kids birthday'],
    link: 'https://www.fotographiya.com/services/birthday-photography',
    label: 'Birthday Photography',
    icon: '🎂'
  },
  roka: {
    keywords: ['roka', 'tilak', 'ring ceremony', 'engagement ceremony', 'roka ceremony', 'ring ceremony', 'engagement ceremony'],
    link: 'https://www.fotographiya.com/services/roka-photography',
    label: 'Roka Ceremony',
    icon: '💍'
  },
  corporate: {
    keywords: ['corporate', 'event photography', 'corporate event', 'bussiness photography', 'corporate photography', 'bussiness', 'event'],
    link: 'https://www.fotographiya.com/services/corporate-photography',
    label: 'Corporate Photography',
    icon: '🏢'
  },

  // ============================================
  // 📌 SERVICES - GENERAL
  // ============================================
  allServices: {
    keywords: ['services', 'offerings', 'what do you do', 'what services do you provide', ''],
    link: 'https://www.fotographiya.com/services',
    label: 'All Services',
    icon: '🎯'
  },
  
  // ============================================
  // 📌 Reels
  // ============================================
  allReels: {
    keywords: [
      'reels', 'reel', 'instagram reels', 'ig reels',
      'video', 'videos', 'short video', 'instagram video',
      'reels link', 'reels example', 'reels sample',
      'show reels', 'see reels', 'watch reels',
      'reels video', 'reels collection', 'our reels',
      'fotographiya reels', 'reel video'
    ],
    links: [
      { label: '🎬 Reel 1', link: 'https://www.instagram.com/reel/DaxHv6SjXIJ/?igsh=OHMwcG53OTN1OTF2' },
      { label: '🎬 Reel 2', link: 'https://www.instagram.com/reel/DZ1MtfkjMpu/?igsh=MXJ5Nm8xaGNsNDkybw%3D%3D' },
      { label: '🎬 Reel 3', link: 'https://www.instagram.com/reel/DZsMEFTiIVS/?igsh=eGJhMGl5Z2hsMGl4' },
      { label: '🎬 Reel 4', link: 'https://www.instagram.com/reel/DaXCUpZlHuf/?igsh=MXM2YzVjeHFpeWl1OA%3D%3D' },
    ]
  },


  // ============================================
  // 📌 PHOTOS - ✅ FIXED KEYWORDS
  // ============================================
  allPhotos: {
    keywords: [
      'photos', 'photo', 'pictures', 'pics', 'images', 'portfolio photos', 'gallery photos',
      'show photos', 'see photos', 'view photos',
      'sample photos', 'photo gallery', 'image gallery',
      'pinterest', 'wedding photos', 'couple photos'
    ],
    links: [
      { label: '🖼️ Photo 1', link: 'https://in.pinterest.com/pin/967288826241112251/' },
      { label: '🖼️ Photo 2', link: 'https://in.pinterest.com/pin/967288826220643904/' },
      { label: '🖼️ Photo 3', link: 'https://in.pinterest.com/pin/967288826241559570/' },
      { label: '🖼️ Photo 4', link: 'https://in.pinterest.com/pin/967288826217356685/' },
    ]
  },

  // ============================================
  // 📌 CONTACT
  // ============================================
contact: {
  keywords: ['contact', 'contact us', 'reach us', 'help', 'support', 'customer care', 'call', 'phone', 'whatsapp', 'email', 'complaint', 'discount', 'booking', 'payment', 'editors', 'EMI', 'Refund policy', 'refund', 'Cancellation charges', 'Cancellation', 'date', 'contract', 'book', 'booking'],
  links: [
    { label: '📞 Call Us', link: 'tel:+919001110144' },
    { label: '💬 WhatsApp', link: 'https://wa.me/919001110144' },
    { label: '📧 Email', link: 'mailto:fotographiyaworld@gmail.com' }
  ]
},
  // ============================================
  // 📌 LOCATION - MAP LINK
  // ============================================
  location: {
    keywords: [
      'location', 'address', 'studio', 'kota', 'rajasthan', 
      'where is fotographiya', 'where is studio', 'how can i find location',
      'map', 'direction', 'google map', 'find us', 'come to', 'office'
    ],
    link: 'https://www.google.com/maps/search/?api=1&query=F3%2C+Ballabh+Bari%2C+Electricity+Board+Area%2C+Kota%2C+Rajasthan+324007',
    label: 'View on Google Maps',
    icon: '📍'
  },

  // ============================================
  // 📌 OTHER PAGES
  // ============================================
  about: {
    keywords: ['about us', 'about', 'founder', 'history', 'who are you'],
    link: 'https://www.fotographiya.com/about',
    label: 'About Us',
    icon: '📖'
  },
  
  // ============================================
  // 📌 REVIEWS - About Us Page Link
  // ============================================
  reviews: {
    keywords: ['review', 'reviews', 'customer review', 'customer reviews', 'testimonial', 'testimonials', 'feedback', 'what people say'],
    link: 'https://www.fotographiya.com/',
    label: 'Customer Reviews',
    icon: '⭐'
  },

  // ============================================
  // 📌 PORTFOLIO
  // ============================================
  portfolio: {
    keywords: ['portfolio', 'gallery', 'work samples', 'our work', 'showcase', 'projects', 'photos', 'pictures', 'images', 'fotographiya', 'raw', 'shoot'],
    link: 'https://www.fotographiya.com/portfolio',
    label: 'Portfolio Gallery',
    icon: '🖼️'
  },

  // ============================================
  // 📌 GOLDENBOX
  // ============================================
  goldenbox: {
    keywords: ['golden box', 'goldenbox', 'qr photo'],
    link: 'https://www.fotographiya.com/',
    label: 'GoldenBox',
    icon: '✨'
  },

  // ============================================
  // 📌 ACADEMY
  // ============================================
  academy: {
    keywords: ['academy', 'course', 'training', 'internship'],
    link: 'https://www.fotographiya.com/fotographiya-academy',
    label: 'Fotographiya Academy',
    icon: '🎓'
  }
};

// ============================================
// ✅ SMART WORD MATCHING FUNCTION (FIXED)
// ============================================

function findMatchingLinks(userMessage) {
  if (!userMessage) return null;
  
  const lowerText = userMessage.toLowerCase().trim();
  const matches = [];
  const matchedKeys = new Set();
  
  // 🔥 STEP 1: Check for group keywords first (highest priority)
  const groupKeywords = {
    allSocial: ['social media', 'social accounts', 'all social', 'social platforms', 'all platforms', 'social links'],
    allPackages: ['packages', 'pricing', 'budget', 'cost', 'price'],
    contact: ['contact', 'contact us', 'reach us', 'help', 'support', 'customer care']
  };
  
   for (const [key, keywords] of Object.entries(groupKeywords)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      const config = LINK_CONFIG[key];
      if (config) {
        // Return only the group match with proper type
        if (config.links) {
          return [{
            type: 'multiple',
            links: config.links,
            key: key
          }];
        } else {
          return [config];
        }
      }
    }
  }
  
  // 🔥 STEP 2: Check individual social media first (highest priority for social)
  const socialKeys = ['instagram', 'facebook', 'youtube', 'linkedin', 'medium', 'reddit', 'pexels', 'whatsapp'];
  
  for (const key of socialKeys) {
    const config = LINK_CONFIG[key];
    if (!config) continue;
    
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        if (!matchedKeys.has(key)) {
          matchedKeys.add(key);
          matches.push({
            type: 'single',
            label: config.label,
            link: config.link,
            icon: config.icon || '🔗',
            key: key
          });
        }
        break;
      }
    }
  }


  // In findMatchingLinks() function - Add after socialKeys check

// 🔥 STEP 2.5: Check Contact
const contactConfig = LINK_CONFIG.contact;
if (contactConfig && !matchedKeys.has('contact')) {
  for (const keyword of contactConfig.keywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      matchedKeys.add('contact');
      matches.push({
        type: 'multiple',
        links: contactConfig.links,
        key: 'contact'
      });
      break;
    }
  }
}
  
  // 🔥 STEP 3: Check services with PRIORITY ORDER
  const servicePriority = [
    'prewedding', 'destination', 'maternity', 'birthday', 'roka', 'corporate', 'wedding'
  ];
  
  // Check specific services
  for (const key of servicePriority) {
    const config = LINK_CONFIG[key];
    if (!config) continue;
    if (matchedKeys.has(key)) continue;
    
    let isMatch = false;
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        isMatch = true;
        break;
      }
    }
    
    if (isMatch) {
      matchedKeys.add(key);
      matches.push({
        type: 'single',
        label: config.label,
        link: config.link,
        icon: config.icon || '🔗',
        key: key
      });
    }
  }
  
  // 🔥 STEP 4: Check location (map link)
  const locationConfig = LINK_CONFIG.location;
  if (locationConfig && !matchedKeys.has('location')) {
    for (const keyword of locationConfig.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchedKeys.add('location');
        matches.push({
          type: 'single',
          label: locationConfig.label,
          link: locationConfig.link,
          icon: locationConfig.icon || '📍',
          key: 'location'
        });
        break;
      }
    }
  }
  
  // 🔥 STEP 5: Check reviews
  const reviewsConfig = LINK_CONFIG.reviews;
  if (reviewsConfig && !matchedKeys.has('reviews')) {
    for (const keyword of reviewsConfig.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchedKeys.add('reviews');
        matches.push({
          type: 'single',
          label: reviewsConfig.label,
          link: reviewsConfig.link,
          icon: reviewsConfig.icon || '⭐',
          key: 'reviews'
        });
        break;
      }
    }
  }

  // ✅ NEW: STEP 2.6: Check REELS
  const reelsConfig = LINK_CONFIG.allReels;
  if (reelsConfig && !matchedKeys.has('allReels')) {
    let isReelsMatch = false;
    for (const keyword of reelsConfig.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        isReelsMatch = true;
        break;
      }
    }
    if (isReelsMatch) {
      matchedKeys.add('allReels');
      matches.push({
        type: 'multiple',
        links: reelsConfig.links,
        key: 'allReels'
      });
    }
  }


   // ✅ NEW: STEP 2.7: Check PHOTOS
  const photosConfig = LINK_CONFIG.allPhotos;
  if (photosConfig && !matchedKeys.has('allPhotos')) {
    let isPhotosMatch = false;
    for (const keyword of photosConfig.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        isPhotosMatch = true;
        break;
      }
    }
    if (isPhotosMatch) {
      matchedKeys.add('allPhotos');
      matches.push({
        type: 'multiple',
        links: photosConfig.links,
        key: 'allPhotos'
      });
    }
  }

  
  // 🔥 STEP 6: Check portfolio
  const portfolioConfig = LINK_CONFIG.portfolio;
  if (portfolioConfig && !matchedKeys.has('portfolio')) {
    for (const keyword of portfolioConfig.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchedKeys.add('portfolio');
        matches.push({
          type: 'single',
          label: portfolioConfig.label,
          link: portfolioConfig.link,
          icon: portfolioConfig.icon || '🖼️',
          key: 'portfolio'
        });
        break;
      }
    }
  }
  
  // 🔥 STEP 7: Check other pages (about, goldenbox, academy)
  const otherKeys = ['about', 'goldenbox', 'academy', 'allServices'];
  
  for (const key of otherKeys) {
    const config = LINK_CONFIG[key];
    if (!config) continue;
    if (matchedKeys.has(key)) continue;
    
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchedKeys.add(key);
        if (config.link) {
          matches.push({
            type: 'single',
            label: config.label,
            link: config.link,
            icon: config.icon || '🔗',
            key: key
          });
        } else if (config.links) {
          matches.push({
            type: 'multiple',
            links: config.links,
            key: key
          });
        }
        break;
      }
    }
  }
  
  // 🔥 STEP 8: Remove duplicates
  const uniqueMatches = [];
  const seenKeys = new Set();
  
  for (const match of matches) {
    if (!seenKeys.has(match.key)) {
      seenKeys.add(match.key);
      uniqueMatches.push(match);
    }
  }
  
  return uniqueMatches.length > 0 ? uniqueMatches : null;
}

// ============================================
// ✅ LinkButton
// ============================================

const LinkButton = ({ href, text }) => {
  let validHref = href;
  
  if (!validHref) {
    validHref = 'https://www.fotographiya.com/contact';
  } else if (!validHref.startsWith('http') && 
             !validHref.startsWith('tel:') && 
             !validHref.startsWith('mailto:') &&
             !validHref.startsWith('#')) {
    validHref = `https://${validHref}`;
  }
  
  return (
    <a 
      href={validHref} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="chat-inline-link"
    >
      {text}
    </a>
  );
};

// ============================================
// ✅ parseMessage
// ============================================

const parseMessage = (text) => {
  if (!text) return [{ type: 'text', content: text || '' }];
  
  const segments = [];
  let remaining = text;
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const linkMatches = [];
  let linkMatch;
  
  while ((linkMatch = linkRegex.exec(remaining)) !== null) {
    linkMatches.push({
      text: linkMatch[1],
      url: linkMatch[2],
      index: linkMatch.index,
      fullMatch: linkMatch[0]
    });
  }
  
  if (linkMatches.length === 0) {
    return [{ type: 'text', content: text }];
  }
  
  let lastIndex = 0;
  for (const match of linkMatches) {
    if (match.index > lastIndex) {
      const textBefore = remaining.slice(lastIndex, match.index);
      if (textBefore.trim()) {
        segments.push({ type: 'text', content: textBefore });
      }
    }
    segments.push({
      type: 'link',
      text: match.text,
      href: match.url
    });
    lastIndex = match.index + match.fullMatch.length;
  }
  
  if (lastIndex < remaining.length) {
    const remainingText = remaining.slice(lastIndex);
    if (remainingText.trim()) {
      segments.push({ type: 'text', content: remainingText });
    }
  }
  
  const groupedSegments = [];
  let currentGroup = [];
  
  for (const segment of segments) {
    if (segment.type === 'link') {
      currentGroup.push(segment);
    } else {
      if (currentGroup.length > 0) {
        groupedSegments.push({
          type: 'linkGroup',
          links: [...currentGroup]
        });
        currentGroup = [];
      }
      groupedSegments.push(segment);
    }
  }
  
  if (currentGroup.length > 0) {
    groupedSegments.push({
      type: 'linkGroup',
      links: [...currentGroup]
    });
  }
  
  return groupedSegments;
};

// ============================================
// ✅ markdownComponents
// ============================================

const markdownComponents = {
  a: ({ href, children }) => (
    <span className="markdown-link-wrapper">
      <LinkButton href={href} text={children} />
    </span>
  ),
  p: ({ children }) => <p className="message-text">{children}</p>,
  strong: ({ children }) => <strong className="chat-bold">{children}</strong>,
  ul: ({ children }) => <ul className="chat-list">{children}</ul>,
  li: ({ children }) => <li className="chat-list-item">• {children}</li>,
};

// ============================================
// ✅ MAIN: ChatMessage Component
// ============================================

const ChatMessage = ({ message, lastUserMessage }) => {
  // ✅ Always show contact links for the bot
  const permanentContactLinks = [
    {
      label: '📝 Contact Page',
      link: 'https://www.fotographiya.com/contact'
    }
  ];

  const renderPermanentLinks = () => (
    <div className="link-container permanent-links">
      {permanentContactLinks.map((link, idx) => (
        <a key={idx} href={link.link} target="_blank" rel="noopener noreferrer" className="chat-inline-link">{link.label}</a>
      ))}
    </div>
  );

  const isBot = message.sender === 'bot';
  const time = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // ===== USER MESSAGE =====
  if (!isBot) {
    return (
      <div className="message-wrapper user">
        <div className="message-avatar">
          <div className="user-avatar">👤</div>
        </div>
        <div className="message-content">
          <div className="message-bubble user-bubble">
            <p className="message-text">{message.text}</p>
          </div>
          <span className="message-time">{time}</span>
        </div>
      </div>
    );
  }

  // ===== BOT MESSAGE =====
  
  // ✅ STEP 1: Find keyword-based links from user's last message
  const keywordLinks = lastUserMessage ? findMatchingLinks(lastUserMessage) : null;
  
  // ✅ STEP 2: If keyword match found, show AI answer + links
  if (keywordLinks && keywordLinks.length > 0) {
    return (
      <div className="message-wrapper bot">
        <div className="message-avatar">
          <img src="/src/assets/logo/logo.jpeg" alt="Bot" className="avatar-img" />
        </div>
        <div className="message-content">
          <div className="message-bubble bot-bubble">
            {/* AI ka answer */}
            <ReactMarkdown components={markdownComponents}>
              {message.text || ''}
            </ReactMarkdown>

            {/* ✅ Always show permanent contact links */}
            {isBot && message.id !== 1 && renderPermanentLinks()}
            
            {/* ✅ Keyword-based links */}
            {keywordLinks.map((linkGroup, index) => {
              if (linkGroup.type === 'multiple') {
                return (
                  <div key={index} className="link-container">
                    {linkGroup.links.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chat-inline-link"
                      >
                        {link.icon || '🔗'} {link.label}
                      </a>
                    ))}
                  </div>
                );
              } else {
                return (
                  <div key={index} className="link-container">
                    <a 
                      href={linkGroup.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chat-inline-link"
                    >
                      {linkGroup.icon} {linkGroup.label}
                    </a>
                  </div>
                );
              }
            })}
          </div>
          <span className="message-time">{time}</span>
        </div>
      </div>
    );
  }

  // ✅ STEP 3: No keyword match - Only AI answer (no links)
  return (
    <div className="message-wrapper bot">
      <div className="message-avatar">
        <img src="/src/assets/logo/logo.jpeg" alt="Bot" className="avatar-img" />
      </div>
      <div className="message-content">
        <div className="message-bubble bot-bubble">
          <ReactMarkdown components={markdownComponents}>
            {message.text || ''}
          </ReactMarkdown>

          {/* ✅ Always show permanent contact links */}
          {isBot && message.id !== 1 && renderPermanentLinks()}
        </div>
        <span className="message-time">{time}</span>
      </div>
    </div>
  );
};

export default ChatMessage;