// src/data/companyData.js

const companyData = {
  // ===== COMPANY INFO =====
  company: {
    name: 'Fotographiya',
    founder: 'Mohit Barthunia',
    location: 'Kota, Rajasthan, India',
    established: '2023',
    experience: '2+ Years',
    website: 'https://www.fotographiya.com',
    phone: '+91 9001110144',
    email: 'fotographiyaworld@gmail.com',
    whatsapp: 'https://api.whatsapp.com/send/?phone=9001110144&text=Hi+Fotographiya%2C+I+want+to+enquire+about+your+photography+packages.&type=phone_number&app_absent=0',
    officeAddress: 'Fotographiya, iStart Nest, Near Abhay Command Center, CAD Circle, Gumanpura, Kota, Rajasthan – 324006',
    description: 'Fotographiya is a premium wedding photography and cinematography company based in Kota, Rajasthan. We combine creativity with technology using AI-powered tools, in-house software, and modern camera equipment to deliver high-quality photography and cinematic films.',
    mission: 'To transform wedding photography through the combination of professional photography, technology, and AI, delivering memorable experiences with fast, premium-quality services.',
    vision: 'To become one of India\'s most technology-driven wedding photography companies by continuously improving customer experience through innovation, automation, and high-quality visual storytelling.',
    tagline: 'Integrating technology in the art of wedding photography',
    businessHours: 'Our team will respond as soon as possible during business hours. For urgent inquiries, please contact us via phone or WhatsApp.'
  },

  // ===== TEAM =====
  team: {
    total: '11-50',
    description: 'Fotographiya has a multidisciplinary team that includes Wedding Photographers, Cinematographers, Drone Operators, Photo Editors, Video Editors, Album Designers, Customer Support Executives, Sales Team, Software Developers, and AI & Technology Team.',
    roles: [
      'Wedding Photographers',
      'Cinematographers',
      'Drone Operators',
      'Photo Editors',
      'Video Editors',
      'Album Designers',
      'Customer Support Executives',
      'Sales Team',
      'Software Developers',
      'AI & Technology Team'
    ]
  },

  // ===== ABOUT US =====
  about: {
    mission: `To bring world-class professionalism into India's wedding industry.

We built structured workflows, trained teams, created AI-powered tools like GoldenBox, premium album systems, and disciplined operations.

Because luxury is not only about beautiful photos. Luxury is about certainty.

✔ Clear pricing
✔ Professional behaviour
✔ On-time delivery
✔ Safe data backup
✔ Respectful artists
✔ Happy families

No chaos. No insecurity. No disappointment.`,

    vision: `To build India's most trusted wedding media company— and then export our systems to the world.

From a Tier-3 city to global standards

Because India should not only import professionalism. We should create it.`,

    whoWeAre: `Fotographiya is more than just a team; it's a family of passionate individuals. We're a unique blend of tech geeks, artists, and dreamers fuelled by a shared vision. Our team is restless, always pushing boundaries and exploring innovative ways to use technology to enhance the art of photography.

We are united by a selfless dedication to our mission. You'll find us collaborating, brainstorming, and innovating during the day, and then celebrating our achievements together in the evening because our motto is to work hard and party even harder.`,

    founder: {
      name: 'Mohit Barthunia',
      message: `India has the world's largest population and immense talent. But how can we become truly world-class if most service industries remain unstructured and unskilled?

I believe the answer is systems + technology. Instead of talking about change, I chose one unorganized industry — the wedding photography space — and started building structure through Fotographiya.

Our goal is simple: train photographers like professionals, build clear processes with tech, and create reliable experiences where both families and photographers receive world-class service.

Because when systems improve, respect improves. And when respect improves, India moves forward.`
    },

    awards: [
      { year: '2023', title: 'FEATURED IN NAKSHATRA, NEWS ARTICLE' },
      { year: '2023', title: 'FEATURED IN DAINIK ANGAD' },
      { year: '2024', title: 'RECOGNIZED IN JEETO MARATHON' }
    ]
  },

  // ===== PAYMENT METHODS =====
  payment: {
    methods: ['Net Banking', 'Cash', 'Cheque/DD', 'Debit/Credit Cards', 'Mobile Wallets', 'UPI'],
    advanceBooking: '25% advance required',
    cancellationPolicy: 'Conditional cancellation policy'
  },

  // ===== PACKAGES =====
  packages: {
    silver: {
      name: 'Silver',
      includes: 'Pre-Wedding Photography, Traditional & Candid Shots, 100+ Edited Photos, Online Gallery'
    },
    golden: {
      name: 'Golden',
      includes: 'Wedding Photography, Full Day Coverage, Traditional & Candid Styles, 300+ Edited Photos, Highlight Video, Online Gallery'
    },
    premium: {
      name: 'Premium',
      includes: 'Pre-Wedding + Wedding + Engagement, Multi-Day Coverage, Photography & Videography, Cinematic Film, Drone Shots, 500+ Photos, Luxury Album'
    }
  },

  // ===== GOLDENBOX =====
  goldenBox: {
    description: 'AI-powered photo delivery system invented by Mohit Barthunia. A local server system that delivers high-quality event photos instantly to attendees.',
    howItWorks: 'Step 1: On-Site Capture → Step 2: AI Processing → Step 3: Desk QR Display → Step 4: Instant Download',
    features: ['No internet required', 'No app download', 'No phone number share', 'AI-enhanced premium quality', '3-second instant download', 'Real-time delivery'],
    steps: {
      capture: 'Our photographers click professional portraits. Images are wirelessly synced to the local server instantly.',
      processing: 'The local GoldenBox AI instantly color-corrects, optimizes exposure, and indexes images.',
      qrDisplay: 'Attendees approach our live photo desk or screen and scan the secure local QR code.',
      download: 'The attendee retrieves and saves their high-res files directly on their phone within 3 seconds.'
    },
    aiPowered: `Our exclusive GoldenBox AI device designed and developed by Fotographiya (invented by Mohit Barthunia) team captures and delivers memories in real-time. Guests interact, click, and instantly receive enhanced, premium-quality outputs. This is not just photography — it's live entertainment powered by technology. It requires no internet, no app download, no phone number — just click it and get it.`,
    quickAlbumSelection: `Fotographiya's revolutionary album selection software is a total game changer! With flash-speed and intelligent algorithms, this tool helps you effortlessly put together your dream wedding album. It identifies the most captivating shots, suggesting perfect combinations for each page. You can easily refine the selections to match your personal taste, creating a stunning narrative of your special day.`,
    aiIntegrated: `Our AI is more than just a tool; it's your personal wedding photo stylist. It scans every image, enhancing colors, perfecting lighting, and even suggesting the best shots for your album. It's like having a world-class photo editor working tirelessly behind the scenes, ensuring your memories look nothing short of extraordinary.`,
    handCraftedAlbum: `Why put album in almiras from ages, where you can display it on your table? Fully customized album designs tailored to your story with a stand. High-end materials, modern layouts, and detailed postproduction ensure a timeless keepsake. Our handcrafted albums are bespoke masterpieces, crafted to mirror your unique love story.`,
    preWeddingShoot: `From the bustling streets of Kota to serene outdoor locations, we find the perfect backdrop for your love story. Our professional photographers will guide you through the process, ensuring you feel relaxed and confident. Our pre-wedding shoots are a blend of art and fun, designed to capture your chemistry and personalities.`,
    caricatures: `Our custom caricatures are unique and entertaining additions to your special day! Whether you want to surprise your guests with an animated wedding come to life or some of their silly little cartoon portraits, Fotographiya won't let you down. It's a perfect way to add a personal touch to your wedding and create lasting memories.`,
    reelographer: `No need to hire from outside. Our dedicated Reelographer team creates trendy, cinematic reels delivered the same day. No waiting for weeks. Your wedding trends while the celebration is still happening.`,
    latestEquipment: `We use industry-leading cameras, lenses, drones, and lighting systems to ensure cinematic output under any condition.`,
    postProduction: `Color science, cinematic grading, skin tone optimization, and storytelling edits handled by our technical experts — not freelancers. We are also developing custom software for smoothing the process.`,
    afterSalesSupport: `Dedicated support even after delivery. Revisions, archive management, album updates — we stay connected beyond the event. We use our custom-made CRM software so we can keep you updated.`
  },

  // ===== SERVICES =====
  services: {
    wedding: {
      name: 'Wedding Photography',
      description: `Wedding Photography is Fotographiya's primary service, covering every important moment of the wedding journey—from pre-wedding ceremonies to the reception. The team focuses on storytelling, emotions, traditions, and candid moments to create timeless memories.

Includes:
• Bride & Groom Portraits
• Family Portraits
• Ceremony Coverage
• Venue Decoration
• Guest Candid Moments
• Group Photos
• Couple Photos
• Bridal Details
• Groom Preparations`
    },
    candid: {
      name: 'Candid Photography',
      description: `Candid Photography captures genuine emotions and natural expressions without asking people to pose. The photographers document spontaneous smiles, laughter, tears, and memorable interactions.

Ideal for:
• Weddings
• Engagements
• Family Events
• Birthday Parties
• Corporate Events`
    },
    traditional: {
      name: 'Traditional Photography',
      description: `Traditional Photography focuses on posed photographs and important ceremonial moments. This style ensures that every family member and key ritual is professionally documented.

Includes:
• Family Portraits
• Ritual Photography
• Stage Photos
• Group Photos
• Formal Couple Portraits`
    },
    prewedding: {
      name: 'Pre-Wedding Shoots',
      description: `Pre-Wedding Shoots allow couples to celebrate their relationship before the wedding day through creative outdoor or indoor photography sessions.

Popular Locations:
• Heritage Sites
• Lakes
• Gardens
• Resorts
• Cafes
• Destination Locations

Deliverables:
• Edited Photos
• Short Cinematic Video
• Instagram Reels
• Save-the-Date Content`
    },
    engagement: {
      name: 'Engagement Photography',
      description: `Professional coverage of engagement ceremonies, including ring exchange, family interactions, decorations, couple portraits, and celebration moments.`
    },
    haldi: {
      name: 'Haldi Ceremony Coverage',
      description: `Captures the colorful and joyful Haldi ceremony with candid moments, family interactions, traditional rituals, and vibrant portraits.`
    },
    mehendi: {
      name: 'Mehendi Ceremony Coverage',
      description: `Documents mehendi application, family celebrations, dance performances, décor, candid emotions, and bridal portraits.`
    },
    sangeet: {
      name: 'Sangeet Coverage',
      description: `Complete photography and videography coverage of dance performances, stage events, family celebrations, musical performances, and candid moments.`
    },
    reception: {
      name: 'Reception Photography',
      description: `Professional coverage of wedding receptions including:
• Couple Entry
• Stage Ceremony
• Cake Cutting (if applicable)
• Guest Portraits
• Family Photos
• Dance Performances
• Couple Portrait Session`
    },
    maternity: {
      name: 'Maternity Shoot',
      description: `Creative maternity photography celebrating pregnancy with elegant portraits in indoor or outdoor settings.

Includes:
• Individual Portraits
• Couple Portraits
• Family Portraits
• Lifestyle Photography`
    },
    baby: {
      name: 'Baby Shoot',
      description: `Photography sessions for newborns, infants, and toddlers designed to capture precious childhood memories.

Suitable For:
• Newborn Photography
• Baby Milestones
• Cake Smash Sessions
• Family Portraits`
    },
    birthday: {
      name: 'Birthday Photography',
      description: `Coverage of birthday celebrations including:
• Cake Cutting
• Family Photos
• Guest Photos
• Decoration Photography
• Candid Moments
• Kids Activities`
    },
    corporate: {
      name: 'Corporate Event Photography',
      description: `Professional photography and videography for businesses.

Suitable For:
• Conferences
• Product Launches
• Award Ceremonies
• Seminars
• Office Events
• Team Activities`
    },
    fashion: {
      name: 'Fashion Photography',
      description: `Photography services for fashion brands, designers, influencers, and models.

Includes:
• Portfolio Shoots
• Editorial Photography
• Lookbook Photography
• Studio Photography`
    },
    product: {
      name: 'Product Photography',
      description: `Professional product photography designed for e-commerce websites, catalogs, social media, and advertising.

Suitable For:
• Clothing
• Jewelry
• Electronics
• Cosmetics
• Food
• Handicrafts`
    },
    drone: {
      name: 'Drone Photography',
      description: `Aerial photography and videography using drones to capture unique perspectives of weddings, venues, and events.

Best For:
• Wedding Venues
• Couple Portraits
• Outdoor Events
• Destination Weddings

Note: Drone usage is subject to local regulations, permissions, weather conditions, and venue restrictions.`
    },
    cinematic: {
      name: 'Cinematic Wedding Films',
      description: `Professionally edited wedding films with cinematic storytelling, music, color grading, and highlights of the entire celebration.

Deliverables may include:
• Wedding Teaser
• Highlight Film
• Full Wedding Film
• Social Media Reels`
    },
    livestream: {
      name: 'Live Streaming',
      description: `If available for a specific event, Fotographiya can arrange live streaming so friends and family who cannot attend in person can watch the ceremony remotely.

Availability depends on:
• Internet connectivity
• Venue infrastructure
• Client requirements
• Additional equipment`
    },
    pinkRun: {
      name: 'Pink Run & Marathons',
      description: 'Specialized event photography for marathons and community runs. Captures the vibrant sea of pink, shared enthusiasm, raw determination, and high-energy smiles of participants.',
      coverage: ['Raw determination & running strides', 'Vibrant sea of pink & community energy', 'Candid triumphs, finish-line joy, emotional milestones', 'Empowered group celebrations & sponsor highlights']
    },
    corporateEvents: {
      name: 'Corporate Event Photography',
      description: 'Comprehensive visual documentation of company milestones. Specialized team coverage for athletic, celebratory, and business events.',
      offerings: ['Executive Headshots - Polished, publication-ready headshots for corporate profiles', 'Corporate Event Coverage - Comprehensive visual documentation of company milestones', 'Workspace & Industrial - Capturing office culture, workspace design, warehouse hubs, and industrial yards for employer branding']
    },
    list: [
      { name: 'Wedding Photography', description: 'Full day wedding coverage with candid and traditional styles' },
      { name: 'Pre-Wedding Photography', description: 'Romantic pre-wedding shoots at beautiful locations' },
      { name: 'Engagement Photography', description: 'Professional coverage of engagement ceremonies' },
      { name: 'Haldi Ceremony Coverage', description: 'Colorful and joyful Haldi ceremony coverage' },
      { name: 'Mehendi Ceremony Coverage', description: 'Mehendi application, family celebrations, dance performances' },
      { name: 'Sangeet Coverage', description: 'Complete photography and videography of Sangeet' },
      { name: 'Reception Photography', description: 'Professional coverage of wedding receptions' },
      { name: 'Candid Photography', description: 'Genuine emotions and natural expressions' },
      { name: 'Traditional Photography', description: 'Posed photographs and important ceremonial moments' },
      { name: 'Destination Wedding', description: 'Destination wedding photography across India' },
      { name: 'Anniversary Photography', description: 'Celebrate milestone moments' },
      { name: 'Maternity Shoot', description: 'Creative maternity photography celebrating pregnancy' },
      { name: 'Baby Shoot', description: 'Photography sessions for newborns, infants, and toddlers' },
      { name: 'Birthday Photography', description: 'Coverage of birthday celebrations' },
      { name: 'Corporate Event Photography', description: 'Professional photography for businesses' },
      { name: 'Fashion Photography', description: 'Photography for fashion brands, designers, influencers' },
      { name: 'Product Photography', description: 'Professional product photography for e-commerce' },
      { name: 'Drone Photography', description: 'Aerial photography and videography using drones' },
      { name: 'Cinematic Wedding Films', description: 'Professionally edited wedding films with cinematic storytelling' },
      { name: 'Live Streaming', description: 'Live streaming for remote guests' },
      { name: 'Pink Run & Marathons', description: 'Specialized event photography for marathons and community runs' },
      { name: 'Executive Headshots', description: 'Polished, publication-ready headshots for corporate profiles' },
      { name: 'Workspace & Industrial Photography', description: 'Capturing office culture, workspace design, warehouse hubs, and industrial yards' }
    ],
    occasions: ['Wedding', 'Pre-Wedding', 'Engagement', 'Haldi', 'Mehendi', 'Sangeet', 'Reception', 'Corporate', 'Maternity', 'Baby Shoot', 'Birthday', 'Anniversary', 'Pink Run', 'Marathon'],
    styles: ['Traditional', 'Candid', 'Cinematography', 'Drone', 'Photobooth', 'Live Screening']
  },

  // ===== BOOKING =====
  booking: {
    steps: [
      'Contact the Fotographiya team via phone, WhatsApp, website, or social media',
      'Share your event details (date, venue, city, type of event, and requirements)',
      'Discuss available photography packages or request a customized package',
      'Receive a quotation based on your requirements',
      'Confirm the booking by completing the required booking formalities and advance payment (25% advance)',
      'The team will coordinate with you before the event for planning and scheduling'
    ],
    description: `Customers can book Fotographiya by following these steps:

1. Contact the Fotographiya team via phone, WhatsApp, website, or social media.
2. Share your event details (date, venue, city, type of event, and requirements).
3. Discuss available photography packages or request a customized package.
4. Receive a quotation based on your requirements.
5. Confirm the booking by completing the required booking formalities and advance payment.
6. The team will coordinate with you before the event for planning and scheduling.`,
    advancePayment: '25%',
    cancellationPolicy: 'Conditional'
  },

  // ===== FAQ =====
  faq: [
    { q: 'Which photography services do you offer?', a: 'We provide wedding, candid, traditional, pre-wedding, engagement, Haldi, Mehendi, Sangeet, reception, maternity, baby, birthday, corporate, fashion, product, drone photography, cinematic films, live streaming, and Pink Run event photography.' },
    { q: 'Can I book only a pre-wedding shoot?', a: 'Yes. Individual services such as pre-wedding, maternity, birthday, and corporate photography can be booked separately.' },
    { q: 'Do you travel outside Kota?', a: 'Yes. Destination weddings and outstation events can be covered. Travel charges may apply.' },
    { q: 'Do you provide both photography and videography?', a: 'Yes. Both services can be booked individually or as a combined package.' },
    { q: 'What are the payment methods?', a: 'We accept Net Banking, Cash, Cheque/DD, Debit/Credit Cards, Mobile Wallets, and UPI. 25% advance is required for booking.' },
    { q: 'What is GoldenBox?', a: 'GoldenBox is our AI-powered local server system that delivers high-quality event photos instantly to attendees. No internet, no app, no phone number required. Guests scan a QR code and download photos in 3 seconds.' },
    { q: 'Do you cover corporate events?', a: 'Yes. We provide corporate event photography including conferences, product launches, executive headshots, office culture, and industrial photography.' }
  ],

  // ===== PORTFOLIO =====
  portfolio: {
    description: `At Fotographiya, we've had the honour of collaborating with more than 100 cherished couples, each with their own unique wedding story to tell.

What truly sets us apart from any other wedding photography company is our unwavering commitment to capturing these love stories most extraordinarily, exactly as they've always envisioned.

But don't just take our word for it; check out our portfolio and experience the enchanting artistry our talented photographers bring to life through their lenses.`,
    couplesCount: '100+',
    link: 'https://www.fotographiya.com/portfolio'
  },

  // ===== CLIENT TESTIMONIALS =====
  testimonials: [
    {
      name: 'Ashveen Makkarh',
      rating: 5,
      text: `I have been meeting this team of Fotographiya in past few events like WALK-O-RUN launch party, WINTER WONDERLAND, NEW YEAR PARTY at Kota Club. Wonderful team, very quick and prompt service, awesome hospitality specially PRINCU ❤️❤️`
    },
    {
      name: 'Annie Astonish',
      rating: 5,
      text: `Found your page while searching on Google for a wedding photographer, and booking you turned out to be one of the best decisions I made. The photography and videography are absolutely beautiful and truly incredible—I loved every bit of it. Dev and his team are extremely supportive, dedicated, and put so much effort into capturing each moment. Their passion really shows in their work, and they made sure to take the best photographs possible. I couldn't be more happier with the results. ❤️❤️`
    },
    {
      name: 'Priyanka Mundhra',
      rating: 5,
      text: `Thank you so much, Mohit, Princu, and the entire Fotographiya team! ❤️❤️ You captured our event beautifully, and we absolutely loved your work. Your professionalism, dedication, and seamless cooperation made the experience truly special and helped make the event even more memorable. Thank you for all your hard work and support! ❤️❤️ Kudos to the entire Fotographiya team for a job exceptionally well done! ❤️❤️ Looking forward to working with you again! ❤️❤️`
    }
  ],

  // ===== ACADEMY =====
  academy: {
    url: 'https://www.fotographiya.com/fotographiya-academy',
    tagline: 'Not a Course. A Career. Launchpad.',
    description: `Real exp. Real shoots. Paid internship. From passion to profession. This is Fotographiya Academy — where professionals are actually made.`,

    programs: {
      customized: {
        name: 'Customized Course',
        subtitle: 'Pick Your Specialization',
        duration: '5 months intensive training',
        features: [
          'Real shoots in your specialization',
          '4 months paid internship',
          'Industry recognised certificate',
          'Full-time placement Opportunities',
          'Top performer wins a camera'
        ]
      },
      master: {
        name: 'Master Program',
        subtitle: 'The Complete Professional',
        duration: 'All 8 courses covered',
        features: [
          'Everything in Customized Course',
          'All 8 courses covered',
          'Professional branded Equipment Kit',
          'Team of 10 members assigned to you',
          'Portfolio + personal branding',
          'Vendor network + client skills'
        ]
      }
    },

    courses: [
      { id: '01', icon: '◈', name: 'Basic Photography', description: 'Exposure, composition, manual controls — the foundation every visual career is built on.', specializations: ['Product', 'Portrait', 'Event'] },
      { id: '02', icon: '▶', name: 'Basic Videography', description: 'Frame rates, movement, audio sync. Build cinematic language from the ground up.', specializations: ['Commercial', 'Event', 'Social'] },
      { id: '03', icon: '◉', name: 'Candid Photography', description: 'Read moments before they happen. Master the invisible art of unposed storytelling.', specializations: ['Wedding', 'Birthday', 'Event'] },
      { id: '04', icon: '⬡', name: 'Cinematography', description: 'Visual storytelling through motion and light. Film-grade technique on real work.', specializations: ['Wedding Film', 'Commercial', 'Fashion'] },
      { id: '05', icon: '◐', name: 'Reelography', description: 'Short-form content engineered for impact. The language of modern visual media.', specializations: ['Brand Reels', 'Wedding', 'Product'] },
      { id: '06', icon: '⬢', name: 'Drone Pilot', description: 'Aerial perspective that transforms ordinary locations into cinematic landscapes.', specializations: ['Aerial', 'Commercial', 'Location'] },
      { id: '07', icon: '◧', name: 'Video Editing', description: 'Cut, grade, deliver. Transform raw footage into polished commercial deliverables.', specializations: ['Wedding', 'Commercial', 'Reels'] },
      { id: '08', icon: '◫', name: 'Photo Editing', description: 'Culling, color grading, retouching — the complete post-production pipeline at speed.', specializations: ['Wedding', 'Fashion', 'Product'] }
    ],

    structure: {
      phaseOne: { name: 'Phase One', duration: '5 Months', description: 'Live, intensive training in your chosen discipline. Real shoots from week one.', tags: ['Live Training', 'Real Shoots', 'Mentor Access'] },
      phaseTwo: { name: 'Phase Two', duration: '4 Months', description: 'Paid internship on real client work. Studios, weddings, commercial sets.', tags: ['Paid', 'Client Work', 'Portfolio'] },
      outcome: { name: 'Outcome', duration: '9 Months', description: 'Certificate, placement Opportunities — and a camera for the top performer.', tags: ['Certificate', 'Placement', 'Reward'] }
    },

    specializations: [
      { name: 'Commercial', description: 'Brand campaigns and product launches for real clients.' },
      { name: 'Birthday', description: 'Newborn and family sessions that demand real sensitivity.' },
      { name: 'Jewelry', description: 'Macro precision and light control. Zero margin for error.' },
      { name: 'Fashion', description: 'Direction, styling and model coordination at pro level.' },
      { name: 'Product', description: 'Lighting and post-production for e-commerce and brand clients.' },
      { name: 'Wedding', description: 'The most demanding environment in photography. You\'ll be ready.' }
    ],

    masterProgramBenefits: [
      { icon: '◈', title: 'All 8 courses', description: 'Complete mastery across every course. Specialise in one, fluent in all eight.' },
      { icon: '▣', title: 'Branded Equipment Kit', description: 'Full Fotographiya-branded equipment kit. Look the part from day one.' },
      { icon: '◉', title: 'Team of 10 members', description: '10 trained professionals assigned to you during internship. You lead. You deliver.' },
      { icon: '⬡', title: 'Fotographiya Uniform', description: 'Your team, uniformed and branded. A complete professional unit identity.' },
      { icon: '◐', title: 'Portfolio Development', description: 'Structured portfolio across weddings, commercial shoots, and live events.' },
      { icon: '⬢', title: 'Client Handling', description: 'Communication, consultation, negotiation — handle high-value clients under pressure.' },
      { icon: '◧', title: 'Performance Leaderboard', description: 'Real-time growth tracking. Know where you stand. Push to the top.' },
      { icon: '◫', title: 'Vendor Network Access', description: 'Direct intros to Fotographiya\'s network of vendors, planners, and brands.' },
      { icon: '★', title: 'Personal Brand', description: 'Build your identity and grow your presence before you even graduate.' }
    ],

    internshipExclusive: {
      title: 'Your Team. Your Projects. Your Call.',
      description: 'During internship, 10 trained professionals are assigned under you. Uniformed. Ready. You direct them on real weddings and live events. You manage the shoot. You deliver the result. This is how leaders are built — not taught.',
      stats: { trainedMembers: '10', events: 'Real Wedding Events', lead: 'Your lead' }
    },

    outcomes: [
      { icon: '01', title: 'Industry Recognised Certificate', description: 'A certificate that carries real weight — earned through real work, not attendance.' },
      { icon: '02', title: 'Full-Time Placement Opportunities', description: 'Direct placement opportunities. We help the best graduates land studio and brand positions.' },
      { icon: '03', title: 'Top Performer Wins a Camera', description: 'One per batch. The highest performer walks away with a professional camera. Earn it.' }
    ],

    whyFotographiya: {
      title: 'We aren\'t instructors.',
      description: 'Fotographiya operates at the top of the Indian wedding and commercial photography industry. You aren\'t learning from someone who used to shoot. You\'re learning from people who shoot every week, in the same environment you\'ll be working in.',
      quote: 'We built this academy because we were tired of hiring people who knew theory but couldn\'t survive their first real shoot. We train the way we work — on the floor, under pressure, delivering.',
      tags: ['Live', 'Always on-field', 'Real', 'Actual clients', '9 Month', 'Full program', 'Paid', 'Internship']
    },

    keyHighlights: [
      '8 courses offered',
      '9 months full program',
      '4 months paid internship',
      'Industry recognised certificate',
      'Full-time placement opportunities',
      'Top performer wins a camera',
      'Real shoots, real clients, real experience'
    ]
  },

  // ===== SOCIAL MEDIA =====
  socialMedia: {
    instagram: { platform: 'Instagram', url: 'https://www.instagram.com/fotographiya_official/' },
    facebook: { platform: 'Facebook', url: 'https://www.facebook.com/people/Fotographiya-Wedphotography/100092454265642/' },
    youtube: { platform: 'YouTube', url: 'https://www.youtube.com/@Fotographiya_official' },
    linkedin: { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/fotographiya-the-wedding-photography/' },
    reddit: { platform: 'Reddit', url: 'https://www.reddit.com/user/Foreign-Barracuda340/' },
    medium: { platform: 'Medium', url: 'https://medium.com/@fotographiyaworld' },
    pexels: { platform: 'Pexels', url: 'https://www.pexels.com/@fotographiya-wedding-photography-823737813/' }
  },

  // ===== WEBSITE PAGES =====
  pages: {
    home: 'https://www.fotographiya.com/',
    about: 'https://www.fotographiya.com/about',
    services: 'https://www.fotographiya.com/services',
    wedding: 'https://www.fotographiya.com/services/wedding-photography',
    prewedding: 'https://www.fotographiya.com/services/prewedding-photography',
    destination: 'https://www.fotographiya.com/services/destination-wedding',
    anniversary: 'https://www.fotographiya.com/services/anniversary-photography',
    corporate: 'https://www.fotographiya.com/services/corporate-photography',
    academy: 'https://www.fotographiya.com/fotographiya-academy',
    portfolio: 'https://www.fotographiya.com/portfolio',
    contact: 'https://www.fotographiya.com/contact'
  },

  links: [
    'https://www.fotographiya.com/',
    'https://www.fotographiya.com/about',
    'https://www.fotographiya.com/services',
    'https://www.fotographiya.com/services/wedding-photography',
    'https://www.fotographiya.com/services/prewedding-photography',
    'https://www.fotographiya.com/services/destination-wedding',
    'https://www.fotographiya.com/services/anniversary-photography',
    'https://www.fotographiya.com/services/corporate-photography',
    'https://www.fotographiya.com/fotographiya-academy',
    'https://www.fotographiya.com/portfolio',
    'https://www.fotographiya.com/contact'
  ],

  // ========================================
  // KEYWORDS FOR DETECTION (MAXIMUM COVERAGE)
  // ========================================
  keywords: {
    // Company
    company: ['fotographiya', 'photographiya', 'foto', 'company', 'studio', 'photography studio', 'wedding photography company', 'indian wedding photographer', 'photography services', 'photographer', 'candid photographer', 'traditional photographer', 'cinematographer', 'about company', 'tell me about company', 'your company', 'fotographiya company'],

    // Academy
    academy: ['academy', 'fotographiya academy', 'photography course', 'learn photography', 'training', 'photography training', 'videography course', 'career in photography', 'photography career', 'paid internship', 'internship', 'courses', 'basic photography', 'basic videography', 'candid photography', 'cinematography', 'reelography', 'drone pilot', 'video editing', 'photo editing', 'master program', 'customized course', 'pick your specialization', 'phase one', 'phase two', 'outcome', 'commercial', 'birthday', 'jewelry', 'fashion', 'product', 'wedding', 'certificate', 'placement', 'top performer wins camera', 'real shoots', 'real clients', 'real experience', '9 months program', 'we are not instructors', 'career launchpad', 'photography classes', 'learn photography online', 'photography institute'],

    // GoldenBox
    goldenbox: ['goldenbox', 'golden box', 'qr code', 'qr service', 'instant photo', 'real-time photo delivery', 'ai powered', 'no internet', 'no app download', 'no phone number', 'click and get', 'live entertainment', 'album selection', 'quick album selection', 'ai album selection', 'ai integrated', 'photo stylist', 'ai photo editor', 'handcrafted album', 'bespoke album', 'customized album', 'premium album', 'reelographer', 'same day reels', 'same day video', 'cinematic reels', 'professional camera equipment', 'latest cameras', 'drones', 'post production', 'color science', 'cinematic grading', 'skin tone optimization', 'after sales support', 'crm software', 'goldenbox ai', 'golden box system', 'qr photo delivery'],

    // Services - Wedding
    wedding: ['wedding', 'wedding photography', 'marriage', 'wedding shoot', 'wedding photographer', 'wedding coverage', 'wedding package', 'candid wedding', 'traditional wedding', 'wedding cinematography', 'wedding film', 'wedding videography', 'wedding ceremony', 'wedding reception', 'wedding portraits', 'bridal portraits', 'groom portraits', 'family portraits', 'wedding rituals', 'wedding traditions', 'indian wedding', 'rajasthan wedding', 'destination wedding', 'wedding photos', 'wedding album', 'wedding highlights', 'wedding teaser'],

    // Pre-Wedding
    prewedding: ['pre wedding', 'prewedding', 'engagement', 'engagement shoot', 'engagement photography', 'pre marriage shoot', 'couple shoot', 'couple photography', 'love story', 'romantic shoot', 'pre wedding photos', 'save the date', 'engagement announcement', 'couple portraits', 'pre wedding film', 'cinematic pre wedding'],

    // Haldi
    haldi: ['haldi', 'haldi ceremony', 'haldi photography', 'haldi coverage', 'turmeric ceremony', 'haldi ritual', 'haldi function', 'haldi photos', 'haldi candid', 'haldi traditional'],

    // Mehendi
    mehendi: ['mehendi', 'mehndi', 'mehendi ceremony', 'mehndi photography', 'mehendi coverage', 'mehndi function', 'henna ceremony', 'mehendi photos', 'mehendi dance', 'mehendi celebration'],

    // Sangeet
    sangeet: ['sangeet', 'sangeet ceremony', 'sangeet photography', 'sangeet coverage', 'sangeet function', 'sangeet dance', 'sangeet performance', 'sangeet photos', 'sangeet videography', 'musical night', 'dance performance'],

    // Reception
    reception: ['reception', 'reception photography', 'reception coverage', 'reception ceremony', 'reception function', 'reception photos', 'reception videography', 'wedding reception', 'reception party', 'reception stage', 'cake cutting', 'guest portraits'],

    // Maternity
    maternity: ['maternity', 'maternity shoot', 'maternity photography', 'pregnancy photography', 'maternity photos', 'pregnancy shoot', 'baby bump', 'expecting mother', 'maternity portraits', 'maternity session'],

    // Baby
    baby: ['baby', 'baby shoot', 'baby photography', 'newborn photography', 'infant photography', 'toddler photography', 'baby photos', 'baby session', 'cake smash', 'baby milestones', 'newborn shoot', 'baby portraits'],

    // Birthday
    birthday: ['birthday', 'birthday photography', 'birthday shoot', 'birthday photos', 'birthday party', 'birthday celebration', 'cake cutting', 'birthday portraits', 'kids birthday', 'birthday event'],

    // Corporate
    corporate: ['corporate', 'corporate photography', 'business photography', 'corporate event', 'headshots', 'product photography', 'brand campaigns', 'conference photography', 'team photo', 'corporate headshots', 'executive portraits', 'office photography', 'workspace photography', 'industrial photography', 'corporate event coverage', 'company event', 'team building', 'award ceremony', 'product launch', 'seminar photography'],

    // Pink Run
    pinkRun: ['pink run', 'marathon', 'pink marathon', 'run photography', 'marathon photography', 'event photography', 'community run', 'pink event', 'women run', 'running event', 'marathon coverage', 'pink run kota', 'pink run rajasthan'],

    // Fashion
    fashion: ['fashion', 'fashion photography', 'fashion shoot', 'editorial photography', 'lookbook', 'fashion brand', 'model photography', 'studio photography', 'fashion portraits', 'portfolio shoot', 'fashion editorial'],

    // Product
    product: ['product', 'product photography', 'product shoot', 'e-commerce photography', 'catalog photography', 'product photos', 'commercial photography', 'product branding', 'jewelry photography', 'food photography', 'clothing photography'],

    // Drone
    drone: ['drone', 'drone photography', 'aerial photography', 'drone videography', 'aerial view', 'drone shots', 'drone coverage', 'drone wedding', 'aerial wedding', 'drone filming'],

    // Cinematic
    cinematic: ['cinematic', 'cinematic film', 'wedding film', 'cinematic wedding', 'highlight film', 'wedding teaser', 'cinematic video', 'wedding movie', 'cinematic storytelling', 'wedding cinema'],

    // Live Streaming
    livestream: ['live streaming', 'live stream', 'live broadcast', 'livestreaming', 'wedding live', 'event live', 'remote viewing', 'online wedding', 'virtual wedding', 'live coverage'],

    // Packages
    packages: ['silver', 'golden', 'premium', 'package', 'packages', 'pakages', 'pricing', 'price', 'cost', 'budget', 'wedding package', 'photography package', 'package details', 'package price'],

    // About
    about: ['about', 'about us', 'who we are', 'mission', 'vision', 'founder', 'mohit', 'barthunia', 'awards', 'recognition', 'nakashatra', 'dainik angad', 'jeeto marathon', 'goldenbox inventor', 'company history', 'our story', 'about fotographiya', 'company mission', 'company vision'],

    // Team
    team: ['team', 'employees', 'staff', 'people', 'workers', 'production team', 'tech team', 'operation team', 'management team', 'sales team', 'digital marketing team', 'how many employees', 'company team', 'photographers team', 'cinematographers team', 'drone operators', 'editors', 'album designers'],

    // Portfolio
    portfolio: ['portfolio', 'gallery', 'work', 'samples', 'showcase', 'couples', '100 couples', 'wedding portfolio', 'our work', 'past work', 'wedding gallery', 'photo gallery', 'sample photos'],

    // Contact
    contact: ['contact', 'reach us', 'find us', 'phone', 'call', 'email', 'whatsapp', 'address', 'location', 'kota', 'rajasthan', 'office address', 'istart nest', 'cad circle', 'gumanpura', 'contact number', 'contact details', 'get in touch', 'reach out'],

    // Booking
    booking: ['book', 'booking', 'how to book', 'book event', 'book wedding', 'inquiry', 'enquire', 'hire', 'steps to book', 'booking process', 'book shoot', 'book photographer', 'hire photographer', 'wedding booking'],

    // Testimonials
    testimonials: ['testimonials', 'reviews', 'client feedback', 'happy clients', 'what clients say', 'ashveen', 'annie', 'priyanka', '5 star', 'rating', 'client review', 'customer review', 'feedback', 'google review'],

    // Social Media
    social: ['social media', 'social links', 'all social', 'instagram', 'facebook', 'youtube', 'linkedin', 'reddit', 'medium', 'pexels', 'follow us', 'social handles'],

    // Technology
    technology: ['technology', 'ai', 'artificial intelligence', 'goldenbox', 'tech', 'qr', 'app', 'software', 'automation', 'ai tools', 'ai photography', 'tech driven'],

    // Pages
    pages: ['home', 'about us', 'services page', 'wedding page', 'pre wedding page', 'destination page', 'anniversary page', 'corporate page', 'academy page', 'portfolio page', 'contact page', 'website page'],

    // FAQ
    faq: ['faq', 'frequently asked questions', 'questions', 'can i book', 'do you travel', 'do you provide', 'which services', 'common questions', 'help', 'support'],

    // Greetings
    greetings: ['hello', 'helo', 'hii', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste', 'नमस्ते', 'कैसे हो', 'how are you', 'good day', 'hola', 'whats up'],

    // Help
    help: ['how can you help', 'what can you tell me', 'what do you do', 'help me', 'help', 'assist', 'support', 'information', 'tell me about', 'what is', 'who is', 'where is', 'how to'],

    // General
    general: ['fotographiya', 'photographiya', 'foto', 'company', 'studio', 'photography studio', 'wedding photography company', 'indian wedding photographer', 'photography services', 'photographer', 'candid photographer', 'traditional photographer', 'cinematographer', 'photo', 'video', 'film', 'shoot', 'session'],

    // Anniversary
    anniversary: ['anniversary', 'anniversary photography', 'anniversary shoot', 'milestone', 'anniversary celebration', 'wedding anniversary', 'anniversary photos'],

    // Destination
    destination: ['destination', 'destination wedding', 'destination shoot', 'outstation wedding', 'travel wedding', 'royal wedding', 'beach wedding', 'fort wedding', 'destination photography'],

    // Payment
    payment: ['payment', 'pay', 'cost', 'price', 'rate', 'charges', 'fee', 'advance', 'booking fee', 'payment method', 'net banking', 'upi', 'card payment', 'cash payment']
  }
};

module.exports = companyData;