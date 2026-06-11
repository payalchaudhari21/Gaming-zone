import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Gamepad2, ArrowRight, UserCheck, 
  MapPin, ShieldCheck, Mail, Phone, Clock, 
  Award, Sparkles, Terminal
} from 'lucide-react';
import './App.css';

import ZoneCard from './components/ZoneCard';
import PricingCard from './components/PricingCard';
import BookingStepper from './components/BookingStepper';
import AdminDashboard from './components/AdminDashboard';
import CursorTail from './components/CursorTail';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Admin credentials state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Toasts notification system
  const [toasts, setToasts] = useState([]);

  const addToast = (title, desc, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, desc, type }]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  // Base Arenas Data
  const zones = [
    {
      id: 'pc',
      name: 'PC Gaming Elite Zone',
      desc: 'Shatter latency thresholds. Outfitted with tournament-grade specs, ergonomic chairs, and ultra-high-refresh displays.',
      price: 299,
      availableSlots: 12,
      capacity: '1 player per station',
      tag: 'RTX 4090 / 240Hz',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop',
      specs: ['RTX 4090 GPU', 'Intel Core i9-14900K', '360Hz ROG Monitor', 'Herman Miller Embody']
    },
    {
      id: 'ps5',
      name: 'PS5 Lounge Pods',
      desc: 'Relax in ultimate luxury. Custom audio-insulated booths featuring giant 4K displays and double dual-sense seating.',
      price: 199,
      availableSlots: 16,
      capacity: 'Up to 2 players',
      tag: '4K OLED / Dolby Atmos',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop',
      specs: ['PS5 Pro Console', '85" LG C3 OLED TV', 'Pulse 3D Wireless Audio', 'Luxury Leather Recliner']
    },
    {
      id: 'vr',
      name: 'Omniverse VR Arenas',
      desc: 'Step inside the screen. Full motion tracking, haptic feedback suits, and physical omni-directional walking pads.',
      price: 399,
      availableSlots: 8,
      capacity: '1 player per portal',
      tag: 'Valve Index / Full Body',
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop',
      specs: ['Valve Index Headset', 'KAT Walk Omni Treadmill', 'bhaptics Haptic Suit', 'RTX 4080 Rig']
    },
    {
      id: 'racing',
      name: 'F1 Racing Simulators',
      desc: 'Feel every curb. Professional-grade direct drive wheelbases, hydraulic pedal racks, and full motion-simulator chassis.',
      price: 499,
      availableSlots: 6,
      capacity: '1 driver per cockpit',
      tag: 'Fanatec DD2 / Motion',
      image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=800&auto=format&fit=crop',
      specs: ['Fanatec DD2 Podium', 'Heusinkveld Sprint Pedals', 'Triple 32" Curved QHD', 'Next Level Motion V3']
    },
    {
      id: 'party',
      name: 'Private Party Dome',
      desc: 'Host your crew. Insulated room with multiple consoles, massive projector screen, food-and-beverage station.',
      price: 1499,
      availableSlots: 4,
      capacity: '10-15 players',
      tag: 'Private Room / Catering',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
      specs: ['4x PS5 + 4x Xbox Series X', '150" Laser Projector', 'Custom Arcade Cabinets', 'Minibar & Snack Lounge']
    },
    {
      id: 'tournament',
      name: 'Esports Championship Arena',
      desc: 'The ultimate stage. 5v5 soundproof pods, team communication hubs, observer desk, and broadcast station.',
      price: 2499,
      availableSlots: 2,
      capacity: 'Up to 10 players',
      tag: '5v5 Stage Pods / Live Feed',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
      specs: ['10x Pro Esports Rigs', 'Soundproof Glass Pods', 'HyperX Esports Headsets', 'Live Stream Control Desk']
    }
  ];

  // Pricing plans list
  const pricingPlans = [
    {
      name: 'Casual Pass',
      price: '249',
      period: 'hour',
      desc: 'Perfect for quick sessions and checking out the setups.',
      features: ['Access to any PS5 Lounge Pod', 'Tournament peripheral use', 'Free high-speed fiber Wi-Fi', 'Complimentary energy water'],
      popular: false
    },
    {
      name: 'Overnight Marathon',
      price: '999',
      period: 'session',
      desc: 'Dominate the dark hours. From 11:00 PM to 7:00 AM non-stop.',
      features: ['8 Hours of continuous gaming', 'Access to PC or PS5 Zones', '1x Premium Energy Drink + Nachos', 'SteelSeries headset upgrade included'],
      popular: true
    },
    {
      name: 'Elite VIP Pass',
      price: '1999',
      period: 'month',
      desc: 'For the hardcore gamers. Unlocks the best slots and rates.',
      features: ['20% off all bookings anytime', '3x Free hours every month', 'Priority booking (30 days in advance)', 'Exclusive access to VR & Racing Sim setups'],
      popular: false
    }
  ];

  // Gallery grid data
  const galleryItems = [
    { image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500&auto=format&fit=crop', title: 'Battle Station Pods', desc: 'Sleek RGB PC arrays tailored for esports matches.' },
    { image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=500&auto=format&fit=crop', title: 'Lounge Zones', desc: 'Chill sections for multiplayer console sessions.' },
    { image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=500&auto=format&fit=crop', title: 'Omniverse Portal', desc: 'KAT Walk omni-directional VR tracking setups.' },
    { image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=500&auto=format&fit=crop', title: 'Audiophile Gear', desc: 'Hyper-refresh curved layouts with mechanical inputs.' },
    { image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=500&auto=format&fit=crop', title: 'Racing Sim Rig', desc: 'Full motion chassis for ultra-realistic F1 simulations.' },
    { image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=500&auto=format&fit=crop', title: 'Esports Championship Stage', desc: 'Our dual 5v5 staging grounds for tournament events.' }
  ];

  // Bookings database state loaded from localStorage
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('nexus_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse bookings", e);
      }
    }
    
    // Default mock bookings to make dashboard look alive
    const mockBookings = [
      {
        id: 'NX-942851',
        zoneId: 'pc',
        zoneName: 'PC Gaming Elite Zone',
        date: new Date().toISOString().split('T')[0],
        slot: '02:00 PM',
        duration: 3,
        players: 1,
        addons: ['headset', 'refreshments'],
        name: 'Alex Mercer',
        email: 'alex@prototype.com',
        phone: '+1 (555) 101-3829',
        totalPrice: 1443,
        status: 'confirmed',
        paymentMethod: 'card',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'NX-419827',
        zoneId: 'vr',
        zoneName: 'Omniverse VR Arenas',
        date: new Date().toISOString().split('T')[0],
        slot: '06:00 PM',
        duration: 2,
        players: 2,
        addons: ['haptic'],
        name: 'Sarah Connor',
        email: 'sarah@skynet.net',
        phone: '+1 (555) 800-1991',
        totalPrice: 997,
        status: 'confirmed',
        paymentMethod: 'upi',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'NX-739185',
        zoneId: 'racing',
        zoneName: 'F1 Racing Simulators',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
        slot: '04:00 PM',
        duration: 1,
        players: 1,
        addons: [],
        name: 'Lewis Hamilton',
        email: 'lewis@mercedes-f1.com',
        phone: '+44 7911 123456',
        totalPrice: 499,
        status: 'confirmed',
        paymentMethod: 'lounge',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'NX-283471',
        zoneId: 'party',
        zoneName: 'Private Party Dome',
        date: new Date().toISOString().split('T')[0],
        slot: '12:00 PM',
        duration: 4,
        players: 12,
        addons: ['refreshments'],
        name: 'Bruce Wayne',
        email: 'bruce@waynecorp.com',
        phone: '+1 (555) 000-0000',
        totalPrice: 6245,
        status: 'completed',
        paymentMethod: 'card',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];
    localStorage.setItem('nexus_bookings', JSON.stringify(mockBookings));
    return mockBookings;
  });

  // Keep localStorage updated when bookings state alters
  useEffect(() => {
    localStorage.setItem('nexus_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Navbar scrolling behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update specific booking status in database
  const handleUpdateBookingStatus = (id, newStatus) => {
    setBookings((prev) => 
      prev.map((b) => b.id === id ? { ...b, status: newStatus } : b)
    );
  };

  // Delete a booking record
  const handleDeleteBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // Create new booking from client UI
  const handleAddBooking = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Book button trigger from cards
  const triggerBookingForZone = (zoneId) => {
    setSelectedZoneId(zoneId);
    setCurrentView('booking');
    
    // Smooth scroll to booking section
    setTimeout(() => {
      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle Admin Password Verification
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin') {
      setIsAdminLoggedIn(true);
      setAdminError('');
      addToast('Dashboard Access', 'Admin login successful. Access granted.', 'success');
    } else {
      setAdminError('Access Denied. Passcode incorrect.');
      addToast('Login Failure', 'Invalid admin password.', 'error');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminPassword('');
    addToast('Admin Session', 'Logged out of admin console.', 'success');
  };

  return (
    <>
      {/* Cyberpunk Scanlines for retro premium arcade vibe */}
      <div className="scanlines"></div>
      
      {/* Custom Cursor Tail glow effect */}
      <CursorTail />

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === 'success' ? (
              <ShieldCheck className="toast-success-icon" size={24} />
            ) : (
              <X className="toast-error-icon" size={24} />
            )}
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              <div className="toast-desc">{t.desc}</div>
            </div>
            <button 
              style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
              onClick={() => removeToast(t.id)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Header Sticky Navbar */}
      <nav className={`navbar ${isScrolled || currentView !== 'home' ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#" className="logo" onClick={() => setCurrentView('home')}>
            <Gamepad2 size={24} className="text-glow-cyan" style={{ color: 'var(--accent-cyan)' }} />
            NEXUS<span>DOME</span>
          </a>
          
          <ul className="nav-links">
            <li>
              <span 
                className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentView('home')}
              >
                Home
              </span>
            </li>
            <li>
              <span 
                className={`nav-link ${currentView === 'arenas' ? 'active' : ''}`}
                onClick={() => setCurrentView('arenas')}
              >
                Arenas
              </span>
            </li>
            <li>
              <span 
                className={`nav-link ${currentView === 'pricing' ? 'active' : ''}`}
                onClick={() => setCurrentView('pricing')}
              >
                Pricing
              </span>
            </li>
            <li>
              <span 
                className={`nav-link ${currentView === 'gallery' ? 'active' : ''}`}
                onClick={() => setCurrentView('gallery')}
              >
                Gallery
              </span>
            </li>
            <li>
              <span 
                className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentView('admin')}
              >
                Admin Control
              </span>
            </li>
          </ul>

          <button 
            className="nav-btn nav-btn-desktop"
            onClick={() => triggerBookingForZone('')}
          >
            Book Session
          </button>

          <button 
            className="nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Collapse Menu */}
      <div className={`mobile-nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-links">
          {['home', 'arenas', 'pricing', 'gallery', 'admin'].map((view) => (
            <li key={view}>
              <a 
                href={`#${view}`}
                className={`mobile-nav-link ${currentView === view ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView(view);
                  setMobileMenuOpen(false);
                }}
              >
                {view === 'admin' ? 'Admin Control' : view}
              </a>
            </li>
          ))}
          <li>
            <button 
              className="nav-btn"
              style={{ width: '200px', marginTop: '1rem' }}
              onClick={() => {
                triggerBookingForZone('');
                setMobileMenuOpen(false);
              }}
            >
              Book Session
            </button>
          </li>
        </ul>
      </div>

      {/* Main View Router */}
      <main style={{ flexGrow: 1 }}>
        {currentView === 'home' && (
          <>
            {/* HERO SECTION */}
            <section className="hero">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop" 
                alt="Cyber Esports lounge background" 
                className="hero-bg-media"
              />
              <div className="hero-overlay"></div>
              
              <div className="hero-content">
                <div className="hero-badge animate-fade-in-up">
                  <Sparkles size={14} className="text-glow-cyan" />
                  Luxury Esports & Gaming Lounge
                </div>
                
                <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  Lock & Load Your <span>Ultimate Session</span>
                </h1>
                
                <p className="hero-desc animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Immerse yourself in a top 1% luxury gaming arena. Play on championship esports rigs, F1 simulators, Meta VR suites, and private PlayStation 5 lounges. 
                </p>
                
                <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <button 
                    className="btn-primary"
                    onClick={() => triggerBookingForZone('')}
                  >
                    Book Seat Now
                    <ArrowRight size={18} />
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => setCurrentView('arenas')}
                  >
                    Explore Arenas
                  </button>
                </div>
              </div>
            </section>

            {/* QUICK HIGHLIGHTS CARD ROW */}
            <section className="section" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div className="glass" style={{ borderRadius: 'var(--border-radius-md)', padding: '2rem', display: 'flex', gap: '1.25rem' }}>
                  <div className="text-glow-cyan" style={{ color: 'var(--accent-cyan)' }}><Award size={32} /></div>
                  <div>
                    <h3 style={{ textTransform: 'uppercase', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>Zero Latency Specs</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>Play with top hardware configurations (RTX 4090, 360Hz refresh rates) on esports servers.</p>
                  </div>
                </div>
                <div className="glass" style={{ borderRadius: 'var(--border-radius-md)', padding: '2rem', display: 'flex', gap: '1.25rem' }}>
                  <div className="text-glow-purple" style={{ color: 'var(--accent-purple)' }}><MapPin size={32} /></div>
                  <div>
                    <h3 style={{ textTransform: 'uppercase', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>Premium Lounge Lounge</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>Ergonomic leather seating, customizable lighting, and integrated beverage/food delivery.</p>
                  </div>
                </div>
                <div className="glass" style={{ borderRadius: 'var(--border-radius-md)', padding: '2rem', display: 'flex', gap: '1.25rem' }}>
                  <div className="text-glow-pink" style={{ color: 'var(--accent-pink)' }}><Clock size={32} /></div>
                  <div>
                    <h3 style={{ textTransform: 'uppercase', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>Live Slot Calendar</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>Select precise dates and slots, customize mechanical peripherals, and lock slots in seconds.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ARENAS VIEW */}
        {(currentView === 'arenas' || currentView === 'home') && (
          <section className="section" id="arenas-section">
            <div className="section-header">
              <span className="section-tag">Cyber Arenas</span>
              <h2 className="section-title">Explore Gaming Setup Zones</h2>
            </div>
            
            <div className="arenas-grid">
              {zones.map((zone, index) => (
                <div 
                  key={zone.id} 
                  className="animate-scale-up" 
                  style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
                >
                  <ZoneCard 
                    zone={zone} 
                    onBookClick={triggerBookingForZone} 
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BOOKING ENGINE VIEW */}
        {currentView === 'booking' && (
          <section className="section" id="booking-section">
            <div className="section-header">
              <span className="section-tag">Booking Engine</span>
              <h2 className="section-title">Lock In Your Session</h2>
            </div>
            
            <BookingStepper 
              zones={zones} 
              selectedZoneId={selectedZoneId}
              onBookingComplete={handleAddBooking}
              addToast={addToast}
            />
          </section>
        )}

        {/* PRICING VIEW */}
        {(currentView === 'pricing' || currentView === 'home') && (
          <section className="section">
            <div className="section-header">
              <span className="section-tag">Pricing Modules</span>
              <h2 className="section-title">Flexible Elite Packages</h2>
            </div>
            
            <div className="pricing-grid">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className="animate-scale-up" 
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                >
                  <PricingCard 
                    plan={plan} 
                    onSelect={() => triggerBookingForZone('')} 
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GALLERY VIEW */}
        {(currentView === 'gallery' || currentView === 'home') && (
          <section className="section">
            <div className="section-header">
              <span className="section-tag">Digital Gallery</span>
              <h2 className="section-title">Nexus Dome Spaces</h2>
            </div>
            
            <div className="gallery-grid">
              {galleryItems.map((item, index) => (
                <div 
                  key={index} 
                  className="gallery-item animate-scale-up"
                  style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}
                >
                  <img src={item.image} alt={item.title} className="gallery-img" />
                  <div className="gallery-hover-overlay">
                    <h4 className="gallery-caption-title">{item.title}</h4>
                    <p className="gallery-caption-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ADMIN CONTROL PANEL PANEL */}
        {currentView === 'admin' && (
          <section className="section">
            {!isAdminLoggedIn ? (
              /* Admin Password Verification Panel */
              <div className="glass animate-fade-in" style={{ maxWidth: '400px', margin: '4rem auto', borderRadius: 'var(--border-radius-md)', padding: '2.5rem', border: '1px solid rgba(121, 40, 202, 0.25)', boxShadow: 'var(--glow-purple)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <Terminal size={40} className="text-glow-purple" style={{ color: 'var(--accent-purple)', marginBottom: '1rem' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', textTransform: 'uppercase', color: '#fff' }}>Admin Access Only</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Enter system passcode to load statistics.</p>
                </div>
                
                <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="booking-label" style={{ fontSize: '0.75rem' }}>Passcode</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="datepicker-input"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                  {adminError && (
                    <div style={{ color: 'var(--accent-red)', fontSize: '0.8rem', fontWeight: 600 }}>{adminError}</div>
                  )}
                  
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: '1.4' }}>
                    * Tip: Use mock credentials <strong>admin</strong> to bypass authorization gate.
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Authenticate Key
                  </button>
                </form>
              </div>
            ) : (
              /* Verified Admin Dashboard Component */
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                  <button className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }} onClick={handleAdminLogout}>
                    Logout admin session
                  </button>
                </div>
                <AdminDashboard 
                  bookings={bookings} 
                  onUpdateBookingStatus={handleUpdateBookingStatus}
                  onDeleteBooking={handleDeleteBooking}
                  addToast={addToast}
                />
              </div>
            )}
          </section>
        )}
      </main>

      {/* Global Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo" onClick={() => setCurrentView('home')}>
              <Gamepad2 size={24} className="text-glow-cyan" style={{ color: 'var(--accent-cyan)' }} />
              NEXUS<span>DOME</span>
            </a>
            <p className="footer-desc">
              Unleash ultimate gaming potential in a luxury cyber esports lounge. Play on state-of-the-art platforms and book slots.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.525 3.545 12 3.545 12 3.545s-7.525 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.025 0 12 0 12s0 3.975.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.475 20.455 12 20.455 12 20.455s7.525 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.975 24 12 24 12s0-3.975-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('home')}>Home</span></li>
              <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('arenas')}>Setup Arenas</span></li>
              <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('pricing')}>Flexible Pricing</span></li>
              <li><span className="footer-link" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('gallery')}>Dome Gallery</span></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Hours of Operation</h4>
            <ul className="footer-links" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: 0 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span>Mon - Thu:</span> <span>10:00 AM - 12:00 AM</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span>Fri - Sat:</span> <span>10:00 AM - 04:00 AM</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span>Sunday:</span> <span>11:00 AM - 11:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Arena Location</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                <span>742 Cyberpunk Boulevard, Esports City, EC 90421</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Mail size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                <span>support@nexusdome.com</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Phone size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                <span>+1 (555) 900-DOME</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NEXUS DOME Lounge. All Rights Reserved. Simulated Demonstration UI.</p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-link" style={{ fontSize: '0.8rem' }}>Privacy Agreement</a>
            <a href="#" className="footer-link" style={{ fontSize: '0.8rem' }}>Terms of Use</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
