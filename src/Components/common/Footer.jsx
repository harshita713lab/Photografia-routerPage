import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Footer.css";
// import logo from "../../assets/hero.png";


export default function Footer() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const el = marqueeRef.current;
    const width = el.scrollWidth / 2;

    gsap.set(el, { x: 0 });

    gsap.to(el, {
      x: -width,
      duration: 25,
      ease: "linear",
      repeat: -1,
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      {/* ===== TOP ===== */}
      <div className="footer-top">
        <div className="footer-logo">
          <img src={logo} alt="Fotgraphiya" />
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <p>Contact Us</p>
            <Link to="/"   onClick={scrollToTop} >Home</Link>
            <Link to="/about" onClick={scrollToTop}  >About Us</Link>
            <Link to="/contact"  onClick={scrollToTop} >Contact Us</Link>
          </div>

          <div className="footer-col">
            <p>Work</p>
            <Link to="/portfolio"   onClick={scrollToTop} >Portfolio </Link>
            <Link to="/services" onClick={scrollToTop} >Services</Link>
          </div>

          <div className="footer-col">
            <p>Socials</p>
            <Link to="/services" onClick={scrollToTop}   >Single QR</Link>
            <a
              href="https://www.instagram.com/fotographiya_official/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/fotographiya-the-wedding-photography/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Linkedin
            </a>
              <a href="https://www.facebook.com/profile.php?id=100092454265642" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://www.youtube.com/@Fotographiya_official" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
            < a href="https://www.pexels.com/@fotographiya-wedding-photography-823737813/" target="_blank" rel="noopener noreferrer">
              Pexels
            </a>
            <a href="https://www.reddit.com/user/Foreign-Barracuda340/" target="_blank" rel="noopener noreferrer">
              Reddit
            </a>
            <a href="https://medium.com/@fotographiyaworld" target="_blank" rel="noopener noreferrer">
              Medium
            </a>
          </div>
        </div>
      </div>

      {/* ===== GSAP MARQUEE ===== */}
      <div className="footer-marquee">
        <div className="marquee-track" ref={marqueeRef}>
          <span>ENTER THE NEW AGE OF WEDDING PHOTOGRAPHY</span>
          <span className="dot"></span>
          <span>ENTER THE NEW AGE OF WEDDING PHOTOGRAPHY</span>
          <span className="dot"></span>
          <span>ENTER THE NEW AGE OF WEDDING PHOTOGRAPHY</span>
          <span className="dot"></span>
          <span>ENTER THE NEW AGE OF WEDDING PHOTOGRAPHY</span>
        </div>
      </div>

      {/* ===== BOTTOM ===== */}
      <div className="footer-bottom">
        <button onClick={scrollToTop} className="back-to-top">
          <span>Back to top</span>
          <div className="arrow">↑</div>
        </button>
      </div>
    </footer>
  );
}

