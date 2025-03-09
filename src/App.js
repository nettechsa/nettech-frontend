import React, { useState } from 'react'; // Added useState import
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import ClientPortal from './pages/ClientPortal';
import AdminPortal from './pages/AdminPortal';
import Questionnaire from './pages/Questionnaire';

// Images
import VngelLogo from './partnerGraphics/Vngel-logo.png';
import NineLivesLogo from './partnerGraphics/9LivesLogo.png';
import CRPLogo from './partnerGraphics/CRP-logo.png';
import NAPLandLogo from './partnerGraphics/NAPLand-logo.png';
import NocturnalLogo from './partnerGraphics/Nocturnal-logo.png';
import DAEHLogo from './partnerGraphics/Drakensberg-Adventure-Experience-Hike.png';

function App() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false); // State for hamburger menu

  const jwtDecode = (token) => {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  };

  const isAdmin = () => {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    return user && user.role === 'admin';
  };

  const toggleNav = () => setIsNavOpen(!isNavOpen); // Toggle function

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <header className="header">
                <h1 className="logo">NetTech</h1>
                <button className="nav-toggle" onClick={toggleNav}>
                  <span className="hamburger"></span> {/* CSS hamburger icon */}
                </button>
                <nav className={isNavOpen ? 'nav-open' : ''}>
                  <ul>
                    <li><Link to="/" className="nav-link" onClick={toggleNav}>Home</Link></li>
                    <li><a href="#services" className="nav-link" onClick={toggleNav}>Services</a></li>
                    <li><a href="#about" className="nav-link" onClick={toggleNav}>About</a></li>
                    <li><a href="#portfolio" className="nav-link" onClick={toggleNav}>Portfolio</a></li>
                    <li><Link to="/client-portal" className="nav-link" onClick={toggleNav}>Client Portal</Link></li>
                    <li><Link to="/admin-portal" className="nav-link" onClick={toggleNav}>Admin Portal</Link></li>
                    <li><a href="#contact" className="nav-link" onClick={toggleNav}>Contact</a></li>
                  </ul>
                </nav>
              </header>

              <section className="hero">
                <h2>Welcome to NetTech</h2>
                <p>Crafting cutting-edge web solutions with style and precision.</p>
                <button className="cta-button" onClick={() => navigate('/questionnaire')}>Get Started</button>
              </section>

              <section className="services" id="services">
                <h2>Our Services</h2>
                <div className="services-grid">
                  <div className="service-card">
                    <h3>Front End Web Development</h3>
                    <p>Pixel-perfect, responsive front-end designs that captivate and engage your audience.</p>
                  </div>
                  <div className="service-card">
                    <h3>Full Scale Development</h3>
                    <p>Comprehensive web solutions from concept to launch, tailored to your vision.</p>
                  </div>
                  <div className="service-card">
                    <h3>Ecommerce Solutions</h3>
                    <p>Robust online stores with secure payments and seamless user experiences.</p>
                  </div>
                  <div className="service-card">
                    <h3>Web App Development</h3>
                    <p>Dynamic web applications that deliver app-like experiences on any device.</p>
                  </div>
                  <div className="service-card">
                    <h3>SEO & Digital Marketing Setup</h3>
                    <p>Kickstart your online presence with SEO and marketing essentials.</p>
                  </div>
                  <div className="service-card">
                    <h3>Website Maintenance & Support</h3>
                    <p>Keep your site running smoothly with expert maintenance and support.</p>
                  </div>
                </div>
              </section>

              <section className="purchase" id="purchase">
                <h2>Purchase a Service</h2>
                <p>Get started with NetTech by selecting a service below.</p>
                <div className="services-grid">
                  <div className="service-card">
                    <h3>Front End Web Development</h3>
                    <p>Pixel-perfect, responsive front-end designs.</p>
                    <p><strong>Price:</strong> R3,500</p>
                    <button className="cta-button" onClick={() => navigate('/questionnaire')}>Purchase</button>
                  </div>
                  <div className="service-card">
                    <h3>Full Scale Development</h3>
                    <p>Complete website build from scratch.</p>
                    <p><strong>Price:</strong> R8,000</p>
                    <button className="cta-button" onClick={() => navigate('/questionnaire')}>Purchase</button>
                  </div>
                  <div className="service-card">
                    <h3>Ecommerce Solutions</h3>
                    <p>Full-featured online store setup.</p>
                    <p><strong>Price:</strong> R7,500</p>
                    <button className="cta-button" onClick={() => navigate('/questionnaire')}>Purchase</button>
                  </div>
                  <div className="service-card">
                    <h3>Website Maintenance & Support</h3>
                    <p>Ongoing updates and support (monthly).</p>
                    <p><strong>Price:</strong> R1,500/month</p>
                    <button className="cta-button" onClick={() => navigate('/questionnaire')}>Purchase</button>
                  </div>
                </div>
              </section>

              <section className="about" id="about">
                <h2>About Us</h2>
                <p className="about-text">
                  At NetTech, we’re a crew of relentless innovators—web developers, designers, and digital strategists—forging the future of the online world from the heart of South Africa. With over a decade of experience and a 100% client satisfaction streak, we transform ideas into cutting-edge digital realities. Whether it’s crafting pixel-perfect front ends, building full-scale web powerhouses, or launching ecommerce empires, we blend bold creativity with technical mastery to deliver solutions that don’t just work—they dominate. Fueled by a passion for pushing boundaries and a commitment to excellence, we’re here to make your digital vision unstoppable.
                </p>
                <div className="stats">
                  <div className="stat-item">
                    <h3>5 Star</h3>
                    <p>Quality Service</p>
                  </div>
                  <div className="stat-item">
                    <h3>3+</h3>
                    <p>Years of Experience</p>
                  </div>
                  <div className="stat-item">
                    <h3>100%</h3>
                    <p>Client Satisfaction</p>
                  </div>
                </div>
              </section>

              <section className="portfolio" id="portfolio">
                <h2>Portfolio</h2>
                <div className="portfolio-grid">
                  <div className="portfolio-card">
                    <h3>Project CRP</h3>
                    <img src={CRPLogo} alt="CRP Noctem" className="portfolio-images" />
                  </div>
                  <div className="portfolio-card">
                    <h3>Project NAP LAND</h3>
                    <img src={NAPLandLogo} alt="NAP LAND" className="portfolio-images" />
                  </div>
                  <div className="portfolio-card">
                    <h3>Project VNGEL</h3>
                    <img src={VngelLogo} alt="VNGEL" className="portfolio-images" />
                  </div>
                  <div className="portfolio-card">
                    <h3>Project 9 Lives</h3>
                    <img src={NineLivesLogo} alt="9Lives" className="portfolio-images" />
                  </div>
                  <div className="portfolio-card">
                    <h3>Project Nocturnal</h3>
                    <img src={NocturnalLogo} alt="Nocturnal" className="portfolio-images" />
                  </div>
                  <div className="portfolio-card">
                    <h3>Project DAEH</h3>
                    <img src={DAEHLogo} alt="DAEH" className="portfolio-images" />
                  </div>
                </div>
              </section>

              <section className="contact" id="contact">
                <h2>Get in Touch</h2>
                <p>Ready to start your next project? Let’s make it happen.</p>
                <form className="contact-form">
                  <input type="text" placeholder="Your Name" required />
                  <input type="email" placeholder="Your Email" required />
                  <textarea placeholder="Your Message" rows="5" required></textarea>
                  <button type="submit" className="cta-button">Send Message</button>
                </form>
              </section>
            </>
          }
        />
        <Route path="/client-portal" element={<ClientPortal />} />
        <Route
          path="/admin-portal"
          element={
            isAdmin() ? <AdminPortal /> : <ClientPortal /> // Redirect non-admins to Client Portal
          }
        />
        <Route path="/questionnaire" element={<Questionnaire />} />
      </Routes>
    </div>
  );
}

export default App;