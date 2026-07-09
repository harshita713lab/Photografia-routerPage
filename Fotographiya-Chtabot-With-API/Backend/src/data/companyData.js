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
    rating: "4.6/5",
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
    // 🌟 CELEBRITY WEDDINGS (6 COUPLES)
    // ============================================
    celebrity: {
      title: "Celebrity Weddings",
      description: "We have had the privilege of capturing some of the most beautiful celebrity weddings.",
      featured: [
        {
          couple: "Anubhav Dubey & Ayushi Pandey",
          location: "Delhi, India",
          date: "December 2024",
          description: "A grand celebrity wedding filled with love, laughter, and royal traditions.",
          highlights: ["Pre-wedding shoot in Delhi", "Traditional Hindu ceremonies", "Lavish reception with 500+ guests"]
        },
        {
          couple: "Rahul Sharma & Priya Singh",
          location: "Mumbai, India",
          date: "November 2024",
          description: "A star-studded wedding with Bollywood celebrities and extravagant decor.",
          highlights: ["Bollywood theme", "Celebrity performances", "Luxury venue"]
        },
        {
          couple: "Vikram Mehta & Ananya Reddy",
          location: "Hyderabad, India",
          date: "October 2024",
          description: "A royal South Indian wedding with traditional rituals and modern elegance.",
          highlights: ["South Indian traditions", "Temple ceremony", "Grand reception"]
        },
        {
          couple: "Arjun Kapoor & Meera Nair",
          location: "Kerala, India",
          date: "September 2024",
          description: "A beautiful beach wedding in Kerala with intimate celebrations.",
          highlights: ["Beach wedding", "Intimate gathering", "Natural photography"]
        },
        {
          couple: "Karan Malhotra & Riya Gupta",
          location: "Jaipur, Rajasthan",
          date: "August 2024",
          description: "A lavish Rajasthani wedding at a heritage palace.",
          highlights: ["Palace venue", "Rajasthani folk music", "Royal theme"]
        },
        {
          couple: "Amit Patel & Sneha Desai",
          location: "Ahmedabad, Gujarat",
          date: "July 2024",
          description: "A vibrant Gujarati wedding with colorful traditions and festivities.",
          highlights: ["Garba night", "Traditional Gujarati rituals", "Colorful decor"]
        }
      ]
    },

    // ============================================
    // 💍 FEATURED WEDDINGS (6 COUPLES)
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
    // 💕 PRE-WEDDING SHOOTS (6 COUPLES)
    // ============================================
    prewedding: [
      {
        couple: "Harshita & Nilanshi",
        location: "Delhi, India",
        date: "December 2024",
        description: "A vibrant pre-wedding photoshoot capturing love in the beautiful streets of Delhi.",
        style: "Urban & Contemporary",
        highlights: ["Delhi heritage locations", "Candid moments", "Artistic portraits"],
        venue: "Lodhi Garden, Delhi"
      },
      {
        couple: "Kunal & Sana",
        location: "Jaipur, Rajasthan",
        date: "November 2024",
        description: "A royal pre-wedding shoot at majestic palaces of Jaipur.",
        style: "Royal & Traditional",
        highlights: ["Amber Fort", "Pink City vibes", "Royal attire"],
        venue: "Amber Fort, Jaipur"
      },
      {
        couple: "Ankit & Divya",
        location: "Goa, India",
        date: "October 2024",
        description: "A fun and romantic pre-wedding shoot by the beaches of Goa.",
        style: "Beach & Bohemian",
        highlights: ["Beach sunset", "Candid moments", "Colorful outfits"],
        venue: "Calangute Beach, Goa"
      },
      {
        couple: "Nikhil & Anjali",
        location: "Udaipur, Rajasthan",
        date: "September 2024",
        description: "A dreamy pre-wedding shoot on the lakes of Udaipur.",
        style: "Romantic & Dreamy",
        highlights: ["Lake Pichola", "Boat ride", "Sunset photography"],
        venue: "Lake Pichola, Udaipur"
      },
      {
        couple: "Raj & Priyanka",
        location: "Agra, Uttar Pradesh",
        date: "August 2024",
        description: "A majestic pre-wedding shoot at the Taj Mahal.",
        style: "Iconic & Timeless",
        highlights: ["Taj Mahal backdrop", "Cultural outfits", "Sunrise shoot"],
        venue: "Taj Mahal, Agra"
      },
      {
        couple: "Manish & Neha",
        location: "Manali, Himachal Pradesh",
        date: "July 2024",
        description: "An adventurous pre-wedding shoot in the Himalayas.",
        style: "Adventure & Nature",
        highlights: ["Snow mountains", "Coffee with a view", "Winter outfits"],
        venue: "Rohtang Pass, Manali"
      }
    ],

    // ============================================
    // 🏖️ DESTINATION WEDDINGS (6 COUPLES)
    // ============================================
    destination: [
      {
        couple: "Divyanshu & Kuntal",
        location: "Kumbhalgarh, Rajasthan",
        date: "December 2024",
        description: "A dream destination wedding at the majestic Kumbhalgarh fort.",
        venue: "Kumbhalgarh Fort",
        style: "Royal & Historic",
        highlights: ["Fort backdrop", "Royal theme", "Traditional Rajasthani decor"]
      },
      {
        couple: "Raja & Rani",
        location: "Delhi NCR, India",
        date: "November 2024",
        description: "A grand destination-style wedding in Delhi with royal themes.",
        venue: "The Lodhi, New Delhi",
        style: "Royal & Grand",
        highlights: ["Traditional rituals", "Royal themed decor", "Cinematic coverage"]
      },
      {
        couple: "Virat & Anushka",
        location: "Jaipur, Rajasthan",
        date: "October 2024",
        description: "A royal destination wedding at a heritage palace in Jaipur.",
        venue: "Rambagh Palace, Jaipur",
        style: "Royal & Vintage",
        highlights: ["Palace wedding", "Vintage cars", "Royal banquet"]
      },
      {
        couple: "Dhruv & Kashish",
        location: "Goa, India",
        date: "September 2024",
        description: "A beautiful destination wedding with beach views and sunset vows.",
        venue: "Taj Exotica, Goa",
        style: "Beach & Tropical",
        highlights: ["Beach ceremony", "Tropical decor", "Sunset photography"]
      },
      {
        couple: "Samarth & Ishita",
        location: "Udaipur, Rajasthan",
        date: "August 2024",
        description: "A fairy-tale destination wedding on the lakes of Udaipur.",
        venue: "The Leela Palace, Udaipur",
        style: "Royal & Romantic",
        highlights: ["Lake views", "Boat entry", "Royal decor"]
      },
      {
        couple: "Gaurav & Megha",
        location: "Jaisalmer, Rajasthan",
        date: "July 2024",
        description: "A majestic destination wedding in the golden city of Jaisalmer.",
        venue: "Jaisalmer Fort",
        style: "Royal & Desert",
        highlights: ["Desert wedding", "Camel rides", "Golden sunset"]
      }
    ]
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
      description: "We offer professional destination wedding photography services across India. Our team covers all major Indian destinations including Rajasthan, Goa, Kerala, and Himachal Pradesh."
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
