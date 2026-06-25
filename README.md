<h1 align="center">Fotographiya - Wedding Photography Website</h1>

## Project Overview
This project is a comprehensive photography portfolio website developed for Fotographiya, a wedding photography company. The website showcases three major photography services:

* **Roka Ceremony Photography** - Traditional pre-wedding rituals
* **Birthday Photography** - Celebration and event coverage
* **Maternity Photography** - Pregnancy and motherhood shoots

The website features a modern, dark-themed design with smooth animations, responsive layouts, and an intuitive user interface.

## Technologies Used

### Frontend

**React 19** - UI library
**React Router DOM 7** - Routing and navigatio
**Bootstrap 5 + React-Bootstrap** - UI components and responsive grid
**GSAP 3** - Smooth animations and scroll effects
**CSS Modules** - Component-scoped styling

### Build Tools

Vite 8 - Fast build tool and development server
ESLint 10 - Code linting and formatting

## 📁 Project Structure

```
routingpage/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── birthday/
│   │   │   ├── image/      
│   │   │   └── video/      
│   │   ├── maternity/
│   │   │   ├── images/       
│   │   │   └── video/        
│   │   └── hero.png
│   ├── components/
│   │   ├── common/        
│   │   │   ├── Blog.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── GalleryGrid.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── VideoGrid.jsx
│   │   │   └── OtherWork.jsx
│   │   ├── roka/           
│   │   ├── birthday/         
│   │   ├── maternity/        
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx  
│   ├── pages/
│   │   ├── rokaPage/      
│   │   ├── birthdayPage/    
│   │   └── maternityPa
│   ├── styles/
│   │   ├── global/          
│   │   ├── common/         
│   │   ├── roka/   
│   │   ├── birthday/     
│   │   └── maternity/     
│   ├── App.jsx              
│   ├── main.jsx              
│   ├── index.css 
│   └── App.css         
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js

```

## Features


### Navigation
* Smooth scrolling navbar with hide/show on scroll
* Dropdown menu for services
* Social media links (Instagram, Facebook, YouTube)
* Mobile-responsive hamburger menu

## Pages

### 🏠 Roka Page (/roka)
* Hero section with animated title
* Roka services showcase
* Blog section with alternating layouts
* Gallery grid with lightbox
* FAQ section
* CTA for booking
* Video grid for highlights

### 🎂 Birthday Page (/birthday)
* Hero section with image grid
* Gallery with staggered masonry layout
* Blog section with alternating cards
* Services section
* Carousel slider
* FAQ with expandable items
* Other work navigation
* CTA for booking

### 🤰 Maternity Page (/maternity)
* Video hero background
* Big section with image + content
* Gallery
* Blog section with number overlays
* Services
* Carousel
* FAQ
* CTA for booking

### 📝 Blog Detail Pages
* roka/:id - Roka blog details
* /birthday-blog/:id - Birthday blog details
* /maternity-blog/:id - Maternity blog details
* Each blog detail includes:
Hero section with title animation
Content with rich text
Gallery
Info box with related content

### Animations
* GSAP-powered scroll animations
* Word-by-word title reveals
* Staggered child animations
* Hover effects on cards and images
* Smooth page transitions
* Zoom effects on hero images

## 📦 Installation & Setup

```
# Clone the repository
git clone <your-repo-url>
cd routingpage

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```
## 🌐 Routing Structure

| Route Path | Component | Description |
|------------|------------|-------------|
| `/` | `Roka` | Landing page for the Roka section. |
| `/roka` | `Roka` | Dedicated page showcasing Roka ceremony photography and related content. |
| `/blog/:id` | `BlogDetail` | Displays detailed information for a specific Roka blog post. |
| `/birthday` | `Birthday` | Birthday photography portfolio and service page. |
| `/birthday-blog/:id` | `BirthdayBlogPage` | Displays a detailed birthday photography blog post. |
| `/maternity` | `Maternity` | Maternity photography portfolio and service page. |
| `/maternity-blog/:id` | `MaternityBlogPage` | Displays a detailed maternity photography blog post. |

## 🎨 Key Components
### Common Components
* **Blog** - Configurable blog grid/cards
* **FAQ** - Accordion-style FAQ section
* **GalleryGrid** - Responsive masonry grid with lightbox
* **Services** - Service cards with hover effects
* **VideoGrid** - Video display with autoplay
* **OtherWork** - Navigation buttons for other services

### Page-Specific Components
* Each page has dedicated components for hero, gallery, 
* blog, services, carousel, FAQ, and CTA
* Consistent dark theme with white accents
* Mobile-first responsive design

### 📱 Responsive Design
The website is fully responsive with breakpoints at:
* **Desktop:** 1200px+
* **Tablet:** 992px - 1199px
* **Mobile:** 768px - 991px
* **Small Mobile:** 576px - 767px
* **Extra Small:** < 576px

## 🔧 Configuration
### Vite Configuration
````
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
````
### ESLint Configuration
Uses modern ESLint flat config with plugins for React hooks and React Refresh.

## 📝 Notes
* **Internship Project:** Developed during my internship at Fotographiya
* **Images & Videos:** Assets are stored locally in the assets/ folder
* **Company License:** No public license available - this is a private portfolio project

## 👩‍💻 Author
* **Harshita Rathore**
* Intern at Fotographiya
* **GitHub:** https://github.com/harshita713lab
* **LinkedIn:** https://www.linkedin.com/in/harshita-rathore-cs/
-------------------------------------------- 

<p align="center">
This project was created as part of my internship at Fotographiya. All rights reserved by the company and the intern developer.
</p>
