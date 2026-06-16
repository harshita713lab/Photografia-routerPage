import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "./Navbar.css";
import logo from "../../assets/hero.png";


// Use an existing asset placeholder until the real logo file is added
import logo from "../assets/hero.png";

export default function Navbar() {
  const navRef = useRef(null);
  const lastScroll = useRef(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    gsap.set(nav, { y: 0 });

    const onScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll - lastScroll.current > 10 && currentScroll > 120) {
        gsap.to(nav, { y: -120, duration: 0.9, ease: "power3.out" });
      } else if (lastScroll.current - currentScroll > 10) {
        gsap.to(nav, { y: 0, duration: 0.8, ease: "power3.out" });
      }
      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <nav className="navbar-01" ref={navRef}>
        {/* Div ki jagah image tag aur Link (taki logo par click karke home ja sakein) */}
        <div className="navbar-logo-01">
          <Link to="/">
            <img src={logo} alt="Fotographiya Logo" className="logo-img" />
          </Link>
        </div>

        <ul className={`navbar-menu-01 ${menuOpen ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={scrollToTop}>Home</Link>
          </li>
          <li>
            <Link to="/about" onClick={scrollToTop}>About Us</Link>
          </li>

          <li>
            <Link to="/portfolio" onClick={scrollToTop}>Portfolio</Link>
          </li>
          <li>
            <Link to="/contact" onClick={scrollToTop}>Contact Us</Link>
          </li>
          {/* <li>
            <Link to="/photography-career" onClick={scrollToTop}>Career</Link>
          </li> */}
          <li>
            <Link to="/fotographiya-academy" onClick={scrollToTop}>Academy</Link>
          </li>
          <li
  className="services-dropdown"
  onMouseEnter={() => setMenuOpen(false)}
>
  {/* Clickable main link */}
  <Link to="/services" onClick={scrollToTop}>Services</Link>

  {/* Dropdown */}
   <ul className="dropdown-menu">
    {/* <li>
      <Link to="/services/roka-photography" onClick={scrollToTop}>Roka</Link>
    </li> */}
    <li>
      <Link to="/services/wedding-photography" onClick={scrollToTop}>Wedding</Link>
    </li>
    <li>
      <Link to="/services/prewedding-photography" onClick={scrollToTop}>Pre Wedding</Link>
    </li>
    <li>
      <Link to="/services/corporate-photography" onClick={scrollToTop}>Corporate</Link>
    </li>
    
      {/* <li>
      <Link to="/services/anniversary-photography" onClick={scrollToTop}>Anniversary</Link>
    </li>
 
      <li>
      <Link to="/services/birthday-photography" onClick={scrollToTop}>Birthday</Link>
    </li> */}
  </ul> 
</li>
          
        </ul>
<div className="navbar-right">

  <a href="https://www.instagram.com/fotographiya_official/" target="_blank" rel="noreferrer" className="nav-social-link">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
    </svg>
  </a>

  <a href="https://www.facebook.com/profile.php?id=100092454265642" target="_blank" rel="noreferrer" className="nav-social-link">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  </a>

  <a href="https://www.youtube.com/@Fotographiya_official" target="_blank" rel="noreferrer" className="nav-social-link">
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" stroke="none"/>
    </svg>
  </a>

  <div className="navbar-cta-01">Get Your Photo</div>
  <div className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</div>

</div>
      </nav>

      {menuOpen && (
        <div className="nav-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
