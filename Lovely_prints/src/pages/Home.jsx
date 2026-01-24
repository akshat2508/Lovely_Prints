
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Upload, Store, CheckCircle, MapPin, Star, ArrowRight, Clock, Shield, TrendingUp, Zap, DollarSign, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import "./Home.css"
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [orderCount, setOrderCount] = useState(0);
  const [shopCount, setShopCount] = useState(0);
  const [avgTime, setAvgTime] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const sectionRefs = {
    hero: useRef(null),
    howItWorks: useRef(null),
    features: useRef(null),
    coverage: useRef(null),
    testimonials: useRef(null),
    stats: useRef(null),
    cta: useRef(null)
  };

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '-50px' }
    );

    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Counter animations
  useEffect(() => {
    if (visibleSections.has('stats')) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        setOrderCount(Math.floor((97 / steps) * step));
        setShopCount(Math.floor((12 / steps) * step));
        setAvgTime(Math.floor((15 / steps) * step));

        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [visibleSections]);

  // Testimonial carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    { name: "Priya Sharma", year: "3rd Year CSE", text: "Saved me before my exam. Fast and reliable. No more running to print shops.", rating: 5 },
    { name: "Rahul Kumar", year: "2nd Year ECE", text: "So much easier than WhatsApp groups. Price comparison is a game changer.", rating: 5 },
    { name: "Ananya Singh", year: "4th Year MBA", text: "Track my order live? This is exactly what we needed on campus.", rating: 5 },
    { name: "Arjun Patel", year: "1st Year ME", text: "Got my assignment printed in 10 minutes. Lifesaver during deadline week.", rating: 5 }
  ];

  const features = [
    { icon: Zap, title: "Fast Delivery", desc: "Get your prints in 15 mins or less" },
    { icon: DollarSign, title: "Fair Pricing", desc: "Compare prices across all shops" },
    { icon: MapPin, title: "Near Campus", desc: "12+ shop partners across campus" },
    { icon: Shield, title: "Secure Payment", desc: "Safe online payment with Razorpay" },
    { icon: TrendingUp, title: "Track Orders", desc: "Live order tracking and updates" },
    { icon: Smartphone, title: "Easy Payment", desc: "Pay online, collect hassle-free" }
  ];

  const shops = [
    { name: "Central Library Shop", location: "Main Campus" },
    { name: "Engineering Block Prints", location: "Block-A" },
    { name: "Hostel Zone Prints", location: "Zone-1" },
    { name: "Quick Print Corner", location: "Cafeteria Area" }
  ];

  return (
    <div className="homepage">
      
  {/* Navbar */}
  <nav className="navbar">
    <div className="nav-container">
      <div className="logo">
        <div className="logo-icon">
          <Upload size={18} />
        </div>
        Lovely Prints
      </div>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#coverage">Coverage</a>
      </div>
      <div className="nav-cta">
        <button className="btn btn-secondary">
              <Link to="/login" >
                Login
              </Link></button>
        <button href="#signup" className="btn btn-primary">
          <Link to="/signup" >
                Get Started
              </Link> <ChevronRight size={18} />
        </button>
      </div>
      <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  </nav>

  {/* Hero Section */}
  <section id="hero" ref={sectionRefs.hero} className="hero">
    <div className="hero-container">
      <div className="hero-content">
        <h1>
          Print Your Documents<br />
          Across Campus—<br />
          Delivered in <span className="highlight">Minutes</span>
        </h1>
        <p className="hero-subtitle">
          Upload. Select Shop. Collect.<br />
          No hassle, no waiting.
        </p>
        <div className="hero-cta">
          <a href="#signup" className="btn btn-primary">
            Find Print Shops Near You <ArrowRight size={20} />
          </a>
        </div>
        <div className="hero-badges">
          <div className="badge">
            <CheckCircle size={20} />
            12+ Campus Shops
          </div>
          <div className="badge">
            <CheckCircle size={20} />
            Pay Online
          </div>
          <div className="badge">
            <CheckCircle size={20} />
            Track Orders Live
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="floating-cards">
          <div className="document-card">
            <div className="doc-header">
              <div className="doc-status ready">Ready</div>
            </div>
            <div className="doc-title">Assignment_3.pdf</div>
            <div className="doc-details">10 pages • B&W • A4</div>
          </div>
          <div className="document-card">
            <div className="doc-header">
              <div className="doc-status printing">Printing</div>
            </div>
            <div className="doc-title">Notes_Chapter5.pdf</div>
            <div className="doc-details">25 pages • Color • A4</div>
          </div>
          <div className="document-card">
            <div className="doc-header">
              <div className="doc-status ready">Ready</div>
            </div>
            <div className="doc-title">Project_Report.pdf</div>
            <div className="doc-details">45 pages • B&W • Spiral</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* How It Works */}
  <section id="howItWorks" ref={sectionRefs.howItWorks} className="how-it-works">
    <div className={`section-header ${visibleSections.has('howItWorks') ? 'visible' : ''}`}>
      <h2 className="section-title">How Lovely Prints Works</h2>
      <p className="section-subtitle">Simple. Fast. Reliable.</p>
    </div>
    <div className="steps-container">
      <div className={`step ${visibleSections.has('howItWorks') ? 'visible' : ''}`}>
        <div className="step-icon" style={{ position: 'relative' }}>
          <Upload size={40} color="white" strokeWidth={2} />
          <div className="step-number">1</div>
        </div>
        <h3>Upload Document</h3>
        <p>Drop your PDF, select print options, and get instant pricing across all campus shops.</p>
      </div>
      <div className={`step ${visibleSections.has('howItWorks') ? 'visible' : ''}`}>
        <div className="step-icon" style={{ position: 'relative' }}>
          <Store size={40} color="white" strokeWidth={2} />
          <div className="step-number">2</div>
        </div>
        <h3>Choose Shop</h3>
        <p>Pick your nearest campus shop, compare prices, and pay securely online with Razorpay.</p>
      </div>
      <div className={`step ${visibleSections.has('howItWorks') ? 'visible' : ''}`}>
        <div className="step-icon" style={{ position: 'relative' }}>
          <CheckCircle size={40} color="white" strokeWidth={2} />
          <div className="step-number">3</div>
        </div>
        <h3>Collect Print</h3>
        <p>Get notified when ready, track your order live, and collect hassle-free.</p>
      </div>
    </div>
  </section>

  {/* Features */}
  <section id="features" ref={sectionRefs.features} className="features">
    <div className={`section-header ${visibleSections.has('features') ? 'visible' : ''}`}>
      <h2 className="section-title">Why Students Love Lovely Prints</h2>
    </div>
    <div className="features-grid">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div
            key={index}
            className={`feature-card ${visibleSections.has('features') ? 'visible' : ''}`}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <div className="feature-icon">
              <IconComponent size={28} strokeWidth={2} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        );
      })}
    </div>
  </section>

  {/* Coverage */}
  <section id="coverage" ref={sectionRefs.coverage} className="coverage">
    <div className="coverage-container">
      <div className={`section-header ${visibleSections.has('coverage') ? 'visible' : ''}`}>
        <h2 className="section-title">Print Shops Across Your Campus</h2>
        <p className="section-subtitle">Coverage you can count on</p>
      </div>
      <div className="shops-grid">
        {shops.map((shop, index) => (
          <div 
            key={index} 
            className={`shop-card ${visibleSections.has('coverage') ? 'visible' : ''}`}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <div className="shop-pin">
              <MapPin size={26} strokeWidth={2} />
            </div>
            <div className="shop-info">
              <h4>{shop.name}</h4>
              <p>{shop.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Testimonials */}
  <section id="testimonials" ref={sectionRefs.testimonials} className="testimonials">
    <div className={`section-header ${visibleSections.has('testimonials') ? 'visible' : ''}`}>
      <h2 className="section-title">Loved by  Students</h2>
      <p className="section-subtitle">See what students are saying</p>
    </div>
    <div className="testimonial-carousel">
      <div className="testimonial-track" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="stars">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={24} fill="#FF6B35" color="#FF6B35" />
              ))}
            </div>
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="testimonial-author">{testimonial.name}</div>
            <div className="testimonial-year">{testimonial.year}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="carousel-dots">
      {testimonials.map((_, index) => (
        <div 
          key={index} 
          className={`dot ${currentTestimonial === index ? 'active' : ''}`}
          onClick={() => setCurrentTestimonial(index)}
        />
      ))}
    </div>
  </section>

  {/* Stats */}
  <section id="stats" ref={sectionRefs.stats} className="stats">
    <div className="stats-grid">
      <div className={`stat-item ${visibleSections.has('stats') ? 'visible' : ''}`}>
        <span className="stat-number">{orderCount}+</span>
        <span className="stat-label">Orders Served</span>
      </div>
      <div className={`stat-item ${visibleSections.has('stats') ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
        <span className="stat-number">{shopCount}</span>
        <span className="stat-label">Shops Active</span>
      </div>
      <div className={`stat-item ${visibleSections.has('stats') ? 'visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
        <span className="stat-number">{avgTime}</span>
        <span className="stat-label">Min Avg Time</span>
      </div>
    </div>
  </section>

  {/* Final CTA */}
  <section id="cta" ref={sectionRefs.cta} className="final-cta">
    <h2>Ready to Print Smarter?</h2>
    <p>
      Join hundreds of students who never wait in line anymore.
    </p>
    <button  className="btn btn-primary">
       <Link to="/login" >
                Get Started - It's Free
              </Link><ArrowRight size={20} />
    </button>
  </section>

  {/* Footer */}
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <h3>Lovely Prints</h3>
        <p>Making campus printing effortless</p>
        <p><bold>support email</bold> : lovelyprintssprt@gmail.com</p>
      </div>
      <div className="footer-links">
        <h4>Product</h4>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#shops">For Shops</a></li>
        </ul>
      </div>
      <div className="footer-links">
        <h4>Support</h4>
        <ul>
          <li><a href="#help">Help Center</a></li>
          <li><a href="#contact">Contact Us</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </div>
      <div className="footer-links">
        <h4>Legal</h4>
        <ul>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#terms">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      © 2026 Lovely Prints
    </div>
  </footer>
</div>
);
};

export default Home;