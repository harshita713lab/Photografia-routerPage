// ============================================
// ✅ FOTOGRAFIYA COMPANY DATA
// ============================================
// This file contains all company information used by
// aiService.js for fallback responses and context building.

const companyData = {
  company: {
    name: "Fotographiya",
    tagline: "Integrating technology in the art of wedding photography",
    description: "Fotographiya is a premium wedding photography and cinematography company based in Kota, Rajasthan, India. We blend traditional artistry with modern technology to create timeless memories.",
    location: "Kota, Rajasthan, India",
    officeAddress: "Kota, Rajasthan",
    phone: "+91 9001110144",
    email: "fotographiyaworld@gmail.com",
    website: "https://www.fotographiya.com",
    whatsapp: "https://api.whatsapp.com/send/?phone=9001110144",
    founder: "Mohit Barthunia",
    established: "2023",
    rating: "4.9/5",
    customers: "100+ Happy Couples"
  },

  team: {
    total: "50+",
    description: "Fotographiya has a team of 50+ dedicated professionals across multiple departments, working together to deliver exceptional photography services.",
    roles: [
      "Founder & CEO",
      "Lead Photographer",
      "Cinematographer",
      "Drone Operator",
      "Photo Editor",
      "Video Editor",
      "Album Designer",
      "Software Developer",
      "AI Engineer",
      "Sales Manager",
      "Digital Marketing Manager",
      "Customer Relations"
    ]
  },
  weddings: {

    // ============================================
    // 🌟 CELEBRITY WEDDINGS
    // ============================================
    celebrity: {
      title: "Celebrity Weddings",
      description: "We have had the privilege of capturing some of the most beautiful celebrity weddings.",
      featured: [
        {
          couple: "Anubhav & Ayushi",
          location: "Delhi, India",
          date: "December 2024",
          description: "A grand celebrity wedding filled with love, laughter, and royal traditions.",
          highlights: ["Pre-wedding shoot in Delhi", "Traditional Hindu ceremonies", "Lavish reception with 500+ guests"]
        }
      ]
    },

    // ============================================
    // 💍 FEATURED WEDDINGS
    // ============================================
    featured: [
      {
        couple: "Yash & Sakshi",
        location: "Rajasthan, India",
        date: "June 2024",
        description: "A royal wedding captured in the heart of Rajasthan with all traditional rituals.",
        services: ["Wedding Photography", "Cinematography", "Pre-wedding Shoot"],
        venue: "Umaid Bhawan Palace, Jodhpur"
      },
      {
        couple: "Prabal & Rani",
        location: "Delhi NCR, India",
        date: "May 2024",
        description: "An exquisite wedding celebration blending traditional Indian rituals with contemporary style.",
        services: ["Wedding Photography", "Cinematography", "Drone Coverage"],
        venue: "The Leela Palace, Delhi"
      },
      {
        couple: "Rohan & Kavya",
        location: "Goa, India",
        date: "April 2024",
        description: "A stunning beach wedding with sunset views and bohemian vibes.",
        services: ["Wedding Photography", "Cinematography", "Candid Coverage"],
        venue: "W Goa, Vagator"
      },
      {
        couple: "Siddharth & Nisha",
        location: "Udaipur, Rajasthan",
        date: "March 2024",
        description: "A fairy-tale wedding at the City Palace in Udaipur.",
        services: ["Wedding Photography", "Cinematography", "Night Photography"],
        venue: "City Palace, Udaipur"
      },
      {
        couple: "Aditya & Pooja",
        location: "Shimla, Himachal Pradesh",
        date: "February 2024",
        description: "A beautiful mountain wedding with snow-capped views.",
        services: ["Wedding Photography", "Cinematography", "Adventure Shoot"],
        venue: "The Oberoi Wildflower Hall, Shimla"
      },
      {
        couple: "Vivek & Swati",
        location: "Jaipur, Rajasthan",
        date: "January 2024",
        description: "A grand wedding at a heritage haveli with traditional decor.",
        services: ["Wedding Photography", "Cinematography", "Heritage Shoot"],
        venue: "Samode Haveli, Jaipur"
      }
    ],

    // ============================================
    // 💕 PRE-WEDDING SHOOTS
    // ============================================
    prewedding: [
      {
        couple: "Shubham & Neha",
        style: "Royal & Traditional",
        highlights: ["Heritage palaces", "Candid moments", "Artistic portraits"]
      },
      {
        couple: "Yash & Sakhi",
        style: "Urban & Contemporary",
        highlights: ["City locations", "Candid moments", "Artistic portraits"]
      },
      {
        couple: "Mrithunjay & Ayushi",
        style: "Romantic & Dreamy",
        highlights: ["Lake Pichola", "Boat ride", "Sunset photography"]
      },
      {
        couple: "Praduman & Vinita",
        style: "Royal & Traditional",
        highlights: ["Amber Fort", "Pink City vibes", "Royal attire"]
      },
      {
        couple: "Gourav & Anjali",
        style: "Romantic & Dreamy",
        highlights: ["Lake views", "Sunset shoot", "Royal backdrop"]
      }
    ],

    // ============================================
    // 🏖️ DESTINATION WEDDINGS
    // ============================================
    destination: [
      {
        couple: "Shubham & Vishakha",
        location: "Haryana, India",
        date: "December 2024",
        description: "A beautiful destination wedding in Haryana with traditional ceremonies and grandeur.",
        venue: "Haryana Farmhouse",
        style: "Traditional & Grand",
        highlights: ["Traditional rituals", "Farmhouse venue", "Grand celebration"]
      },
      {
        couple: "Shubham & Neha",
        location: "Jaipur, Rajasthan",
        date: "November 2024",
        description: "A royal destination wedding in the Pink City of Jaipur.",
        venue: "Rambagh Palace, Jaipur",
        style: "Royal & Traditional",
        highlights: ["Palace wedding", "Royal Rajasthani decor", "Grand festivities"]
      },
      {
        couple: "Karan & Bhavna",
        location: "Delhi, India",
        date: "October 2024",
        description: "A luxurious destination wedding in the capital city of Delhi.",
        venue: "The Leela Palace, Delhi",
        style: "Luxury & Grand",
        highlights: ["Luxury venue", "Grand decor", "Celebrity performances"]
      }
    ],

    // ============================================
    // 📍 TOP INDIAN DESTINATIONS
    // ============================================
    topLocations: {
      rajasthan: ["Udaipur", "Jaipur", "Jodhpur", "Jaisalmer", "Ajmer", "Kumbhalgarh", "Mount Abu", "Ranthambore"],
      northIndia: ["Delhi", "Shimla (Himachal)", "Manali (Himachal)", "Rishikesh (Uttarakhand)", "Srinagar (J&K)", "Pahalgam (J&K)"],
      westIndia: ["Goa", "Mumbai (Maharashtra)", "Lonavala (Maharashtra)", "Alibaug (Maharashtra)", "Rann of Kutch (Gujarat)"],
      southIndia: ["Munnar (Kerala)", "Coorg (Karnataka)", "Mysore (Karnataka)", "Ooty (Tamil Nadu)", "Pondicherry", "Andaman Islands"],
      eastNortheast: ["Shillong (Meghalaya)", "Gangtok (Sikkim)", "Agra (UP)", "Orchha (MP)"],
      note: "We cover wedding photography across ALL of India. From royal palaces of Rajasthan to beaches of Goa, from Himalayan mountains to South Indian temples — we shoot everywhere in India."
    }
  },

  socialMedia: {
    instagram: {
      platform: "Instagram",
      url: "https://www.instagram.com/fotographiya_official/"
    },
    facebook: {
      platform: "Facebook",
      url: "https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/"
    },
    youtube: {
      platform: "YouTube",
      url: "https://www.youtube.com/@Fotographiya_official"
    },
    linkedin: {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/company/fotographiya"
    },
    reddit: {
      platform: "Reddit",
      url: "https://www.reddit.com/r/fotographiya"
    },
    medium: {
      platform: "Medium",
      url: "https://medium.com/@fotographiya"
    },
    pexels: {
      platform: "Pexels",
      url: "https://www.pexels.com/@fotographiya"
    }
  },

  pages: {
    home: "https://www.fotographiya.com",
    about: "https://www.fotographiya.com/about",
    services: "https://www.fotographiya.com/services",
    wedding: "https://www.fotographiya.com/services/wedding-photography",
    prewedding: "https://www.fotographiya.com/services/prewedding-photography",
    destination: "https://www.fotographiya.com/services/destination-wedding",
    anniversary: "https://www.fotographiya.com/services/anniversary-photography",
    corporate: "https://www.fotographiya.com/services/corporate-photography",
    academy: "https://www.fotographiya.com/fotographiya-academy",
    portfolio: "https://www.fotographiya.com/portfolio",
    contact: "https://www.fotographiya.com/contact",
    maternity: "https://www.fotographiya.com/services/maternity-photography",
    birthday: "https://www.fotographiya.com/services/birthday-photography",
    roka: "https://www.fotographiya.com/services/roka-photography"
  },

  links: [
    "https://www.fotographiya.com",
    "https://www.fotographiya.com/about",
    "https://www.fotographiya.com/services",
    "https://www.fotographiya.com/services/wedding-photography",
    "https://www.fotographiya.com/services/prewedding-photography",
    "https://www.fotographiya.com/services/destination-wedding",
    "https://www.fotographiya.com/services/corporate-photography",
    "https://www.fotographiya.com/fotographiya-academy",
    "https://www.fotographiya.com/portfolio",
    "https://www.fotographiya.com/contact"
  ],

  services: {
    wedding: {
      description: "We provide comprehensive wedding photography covering all ceremonies - from pre-wedding rituals to the reception, with professional editing and creative storytelling."
    },
    prewedding: {
      description: "We offer professional pre-wedding photography services for couples. Our team captures romantic moments at scenic locations with expert editing and creative direction."
    },
    destination: {
      description: "We offer professional destination wedding photography services across India. Top Rajasthan cities include Udaipur, Jaipur, Ajmer, and Kumbhalgarh. We cover all over India — from Kashmir to Kanyakumari, from Gujarat to Meghalaya."
    },
    corporate: {
      description: "Professional corporate photography services for events, conferences, team photos, and brand imagery."
    },
    maternity: {
    description: "Professional maternity photography celebrating the beauty of pregnancy. We capture the glow, the love, and the anticipation of expecting mothers."
  },
  birthday: {
    description: "Professional birthday photography capturing the joy, laughter, and love of your special day from cake smash to celebration."
  },
  roka: {
    description: "Professional Roka ceremony photography capturing every ritual, emotion, and sacred moment of this cherished pre-wedding tradition."
  }
  },

  packages: {
    silver: {
      name: "Silver Package",
      includes: "Basic wedding coverage with professional photography, edited digital photos, and online gallery."
    },
    golden: {
      name: "Golden Package",
      includes: "Comprehensive wedding coverage with photography and cinematography, professional editing, album, and online gallery."
    },
    premium: {
      name: "Premium Package",
      includes: "Premium wedding coverage with photography, cinematography, drone shots, premium album, and all digital assets."
    }
  },

  goldenBox: {
    description: "GoldenBox is our innovative AI-powered system that delivers high-quality event photos instantly to attendees without requiring internet or app downloads.",
    features: [
      "No internet required",
      "No app download needed",
      "3-second instant download",
      "AI-enhanced premium quality",
      "QR code based delivery",
      "Real-time photo processing"
    ],
    aiPowered: "AI-powered facial recognition and photo enhancement for instant delivery of premium quality photos.",
    steps: {
      capture: "Capture",
      processing: "AI Processing",
      qrDisplay: "QR Display",
      download: "Download"
    }
  },

  academy: {
    tagline: "Not a Course. A Career. Launchpad.",
    description: "Fotographiya Academy offers professional photography and videography courses with paid internships and industry-recognized certification.",
    courses: [
      "Professional Photography",
      "Cinematography & Videography",
      "Photo Editing & Retouching",
      "Video Editing & Post-Production",
      "Drone Photography",
      "Lighting & Studio Setup",
      "Wedding Photography Masterclass",
      "Business of Photography"
    ]
  },

  portfolio: {
    description: "Our portfolio showcases 100+ weddings and events we've captured with creativity, passion, and professional excellence.",
    couplesCount: "100+"
  },

  keywords: {
    international: [
      'international', 'outside india', 'abroad', 'foreign', 'overseas',
      'bali', 'maldives', 'thailand', 'dubai', 'uae', 'usa', 'uk', 
      'europe', 'america', 'canada', 'australia', 'singapore', 'malaysia'
    ]
  }
};

module.exports = companyData;