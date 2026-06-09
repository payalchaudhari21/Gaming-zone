import React, { useState, useEffect } from 'react';
import { 
  Tv, Cpu, Eye, Compass, Trophy, User, Calendar, Clock, 
  Users, CheckCircle, ChevronRight, ChevronLeft, CreditCard, 
  Download, Printer, Plus, Minus, ArrowRight 
} from 'lucide-react';

const BookingStepper = ({ zones, selectedZoneId, onBookingComplete, addToast }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    zoneId: selectedZoneId || '',
    date: new Date().toISOString().split('T')[0],
    slot: '',
    duration: 2,
    players: 1,
    addons: [],
    name: '',
    email: '',
    phone: '',
  });

  const [bookingConfirmedData, setBookingConfirmedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available addons
  const addonsList = [
    { id: 'headset', name: 'SteelSeries Arctis Nova Pro Upgrade', price: 99, type: 'per_hour', desc: 'Active ANC and Hi-Res audio' },
    { id: 'peripherals', name: 'Elite Mechanical Keyboard & Mouse Bundle', price: 79, type: 'per_hour', desc: 'Razer Huntsman V3 & Basilisk V3 Pro' },
    { id: 'haptic', name: 'TactSuit VR Haptic Vest', price: 199, type: 'flat', desc: 'Feel the action directly (VR zone only)' },
    { id: 'refreshments', name: 'Gamer Fuel & Snack Pack', price: 249, type: 'flat', desc: '1x Monster Energy + 1x Ultimate Nachos' },
  ];

  // Dynamic slot availability generator
  const slotsList = [
    "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", 
    "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", 
    "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"
  ];

  // Simple deterministic hash to simulate random booked slots based on date + zone
  const getSlotStatus = (timeSlot) => {
    if (!bookingData.zoneId) return 'available';
    const str = `${bookingData.date}-${bookingData.zoneId}-${timeSlot}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const absHash = Math.abs(hash);
    
    // 25% slots booked
    if (absHash % 4 === 0) return 'booked';
    return 'available';
  };

  useEffect(() => {
    if (selectedZoneId) {
      setBookingData(prev => ({ ...prev, zoneId: selectedZoneId }));
    }
  }, [selectedZoneId]);

  // Adjust step logic
  const nextStep = () => {
    if (currentStep === 1 && !bookingData.zoneId) {
      addToast('Error', 'Please select a Gaming Zone to continue.', 'error');
      return;
    }
    if (currentStep === 2 && !bookingData.slot) {
      addToast('Error', 'Please select a time slot to continue.', 'error');
      return;
    }
    if (currentStep === 4) {
      handleFinalSubmit();
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleZoneSelect = (zoneId) => {
    setBookingData(prev => ({ ...prev, zoneId, slot: '' })); // reset slot when zone changes
    setCurrentStep(2);
  };

  const handleDateChange = (e) => {
    setBookingData(prev => ({ ...prev, date: e.target.value, slot: '' }));
  };

  const handleSlotSelect = (timeSlot) => {
    if (getSlotStatus(timeSlot) === 'booked') return;
    setBookingData(prev => ({ ...prev, slot: timeSlot }));
  };

  const handleNumberChange = (field, delta, min, max) => {
    setBookingData(prev => {
      const newVal = prev[field] + delta;
      if (newVal >= min && newVal <= max) {
        return { ...prev, [field]: newVal };
      }
      return prev;
    });
  };

  const toggleAddon = (addonId) => {
    setBookingData(prev => {
      const exists = prev.addons.includes(addonId);
      if (exists) {
        return { ...prev, addons: prev.addons.filter(id => id !== addonId) };
      } else {
        return { ...prev, addons: [...prev.addons, addonId] };
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  // Calculating pricing totals
  const selectedZone = zones.find(z => z.id === bookingData.zoneId);
  const baseRate = selectedZone ? selectedZone.price : 0;
  const baseTotal = baseRate * bookingData.duration;
  
  const addonsTotal = bookingData.addons.reduce((acc, addonId) => {
    const addonObj = addonsList.find(a => a.id === addonId);
    if (!addonObj) return acc;
    if (addonObj.type === 'per_hour') {
      return acc + (addonObj.price * bookingData.duration);
    }
    return acc + addonObj.price;
  }, 0);

  const grandTotal = baseTotal + addonsTotal;

  // Save and submit
  const handleFinalSubmit = () => {
    // validation
    if (!bookingData.name.trim()) {
      addToast('Validation Error', 'Full Name is required.', 'error');
      return;
    }
    if (!bookingData.email.trim() || !bookingData.email.includes('@')) {
      addToast('Validation Error', 'A valid Email is required.', 'error');
      return;
    }
    if (!bookingData.phone.trim()) {
      addToast('Validation Error', 'Phone Number is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate booking submission
    setTimeout(() => {
      const generatedId = `NX-${Math.floor(100000 + Math.random() * 900000)}`;
      const completedBooking = {
        id: generatedId,
        ...bookingData,
        zoneName: selectedZone ? selectedZone.name : 'Unknown Zone',
        totalPrice: grandTotal,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      
      // Update global store
      onBookingComplete(completedBooking);
      setBookingConfirmedData(completedBooking);
      setIsSubmitting(false);
      setCurrentStep(5);
      addToast('Success!', 'Your gaming session is locked and loaded!', 'success');
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getZoneIcon = (id) => {
    switch (id) {
      case 'pc': return <Cpu size={20} />;
      case 'vr': return <Eye size={20} />;
      case 'racing': return <Compass size={20} />;
      case 'party': return <Users size={20} />;
      case 'tournament': return <Trophy size={20} />;
      default: return <Tv size={20} />;
    }
  };

  return (
    <div className="booking-panel glass glass-glow-cyan">
      
      {/* Stepper Node Header */}
      {currentStep < 5 && (
        <div className="stepper-header">
          <div className="stepper-line"></div>
          <div 
            className="stepper-line-progress" 
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>
          
          {[
            { step: 1, label: 'Arena' },
            { step: 2, label: 'Schedule' },
            { step: 3, label: 'Customs' },
            { step: 4, label: 'Checkout' }
          ].map((item) => (
            <div 
              key={item.step} 
              className={`step-node ${currentStep === item.step ? 'active' : ''} ${currentStep > item.step ? 'completed' : ''}`}
              onClick={() => {
                if (item.step < currentStep) setCurrentStep(item.step);
              }}
            >
              <div className="step-circle">{item.step}</div>
              <span className="step-label">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Steps Main Box */}
      <div className="step-content-container">
        {isSubmitting ? (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center', alignItems: 'center', minHeight: '400px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: '4px solid rgba(0, 242, 254, 0.1)',
                borderTop: '4px solid var(--accent-cyan)',
                borderRight: '4px solid var(--accent-purple)',
                borderRadius: '50%',
                animation: 'spinAbsolute 1s linear infinite'
              }}></div>
              <Cpu size={32} className="text-glow-cyan" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'var(--accent-cyan)',
                animation: 'pulseNeon 1.5s infinite ease-in-out'
              }} />
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Securing Arena Station
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: '300px', marginInline: 'auto' }}>
                Allotting PC chassis, locking time coordinates, and generating digital pass keys...
              </p>
            </div>

            <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <div className="skeleton" style={{ height: '16px', width: '80%', marginInline: 'auto' }}></div>
              <div className="skeleton" style={{ height: '12px', width: '50%', marginInline: 'auto' }}></div>
              <div className="skeleton" style={{ height: '12px', width: '60%', marginInline: 'auto' }}></div>
            </div>
          </div>
        ) : (
          <>
            
            {/* STEP 1: SELECT ZONE */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h3 className="section-tag" style={{ textAlign: 'center' }}>Step 1</h3>
            <h2 className="section-title" style={{ display: 'block', textAlign: 'center', marginBottom: '2.5rem', fontSize: '1.75rem' }}>
              Select Your Battle Station
            </h2>
            <div className="zone-picker-grid">
              {zones.map((zone) => (
                <div 
                  key={zone.id}
                  className={`zone-selector-card glass glow-hover ${bookingData.zoneId === zone.id ? 'selected' : ''}`}
                  onClick={() => handleZoneSelect(zone.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="text-glow-cyan" style={{ color: bookingData.zoneId === zone.id ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
                      {getZoneIcon(zone.id)}
                    </div>
                    <h4 style={{ textTransform: 'uppercase', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>
                      {zone.name}
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', flexGrow: 1, marginBottom: '1.5rem' }}>
                    {zone.desc}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                      ₹{zone.price}<span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>/hr</span>
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-neon-green)' }}>
                      {zone.availableSlots} Slots Live
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DATE & TIME SLOT */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <h3 className="section-tag" style={{ textAlign: 'center' }}>Step 2</h3>
            <h2 className="section-title" style={{ display: 'block', textAlign: 'center', marginBottom: '2.5rem', fontSize: '1.75rem' }}>
              Pick Your Schedule
            </h2>
            
            <div className="booking-grid-2col">
              <div>
                <div className="booking-form-group">
                  <label className="booking-label">Select Date</label>
                  <input 
                    type="date" 
                    className="datepicker-input" 
                    value={bookingData.date}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="booking-form-group">
                  <label className="booking-label">Available Time Slots</label>
                  <div className="slots-grid">
                    {slotsList.map((slotOption) => {
                      const status = getSlotStatus(slotOption);
                      const isSelected = bookingData.slot === slotOption;
                      return (
                        <div
                          key={slotOption}
                          className={`slot-chip ${status} ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSlotSelect(slotOption)}
                        >
                          {slotOption}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="slot-legend">
                    <div className="slot-legend-item">
                      <div className="legend-dot available"></div>
                      <span>Available</span>
                    </div>
                    <div className="slot-legend-item">
                      <div className="legend-dot selected"></div>
                      <span>Selected</span>
                    </div>
                    <div className="slot-legend-item">
                      <div className="legend-dot booked"></div>
                      <span>Fully Booked</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <BookingSummarySidebar 
                  selectedZone={selectedZone}
                  bookingData={bookingData}
                  baseTotal={baseTotal}
                  addonsTotal={addonsTotal}
                  grandTotal={grandTotal}
                  addonsList={addonsList}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PLAYERS & UPGRADES */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <h3 className="section-tag" style={{ textAlign: 'center' }}>Step 3</h3>
            <h2 className="section-title" style={{ display: 'block', textAlign: 'center', marginBottom: '2.5rem', fontSize: '1.75rem' }}>
              Customize Your Experience
            </h2>
            
            <div className="booking-grid-2col">
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div className="booking-form-group">
                    <label className="booking-label">Hours to Book</label>
                    <div className="input-number-group">
                      <button 
                        type="button" 
                        className="input-number-btn" 
                        onClick={() => handleNumberChange('duration', -1, 1, 12)}
                      >
                        <Minus size={16} />
                      </button>
                      <div className="input-number-val">{bookingData.duration} hrs</div>
                      <button 
                        type="button" 
                        className="input-number-btn" 
                        onClick={() => handleNumberChange('duration', 1, 1, 12)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="booking-form-group">
                    <label className="booking-label">Players</label>
                    <div className="input-number-group">
                      <button 
                        type="button" 
                        className="input-number-btn" 
                        onClick={() => handleNumberChange('players', -1, 1, 10)}
                      >
                        <Minus size={16} />
                      </button>
                      <div className="input-number-val">{bookingData.players}</div>
                      <button 
                        type="button" 
                        className="input-number-btn" 
                        onClick={() => handleNumberChange('players', 1, 1, 10)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="booking-form-group">
                  <label className="booking-label">Tactical Gear & Food Upgrades</label>
                  <div className="addons-grid">
                    {addonsList.map((addon) => {
                      // disable VR haptic vest if not in VR zone
                      const isVrZone = bookingData.zoneId === 'vr';
                      const isDisabled = addon.id === 'haptic' && !isVrZone;
                      const isSelected = bookingData.addons.includes(addon.id);

                      return (
                        <div
                          key={addon.id}
                          className={`addon-card glass ${isSelected ? 'selected' : ''}`}
                          style={{ 
                            opacity: isDisabled ? 0.35 : 1, 
                            cursor: isDisabled ? 'not-allowed' : 'pointer' 
                          }}
                          onClick={() => {
                            if (!isDisabled) toggleAddon(addon.id);
                          }}
                        >
                          <div className="addon-info">
                            <div className="addon-checkbox">
                              {isSelected && <CheckCircle size={14} style={{ fill: 'var(--accent-purple)' }} />}
                            </div>
                            <div>
                              <div className="addon-name">{addon.name}</div>
                              <div className="addon-desc">{addon.desc}</div>
                            </div>
                          </div>
                          <div className="addon-price">
                            +₹{addon.price} 
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>
                              {addon.type === 'per_hour' ? '/hr' : ' flat'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div>
                <BookingSummarySidebar 
                  selectedZone={selectedZone}
                  bookingData={bookingData}
                  baseTotal={baseTotal}
                  addonsTotal={addonsTotal}
                  grandTotal={grandTotal}
                  addonsList={addonsList}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CUSTOMER DETAILS & CHECKOUT */}
        {currentStep === 4 && (
          <div className="animate-fade-in">
            <h3 className="section-tag" style={{ textAlign: 'center' }}>Step 4</h3>
            <h2 className="section-title" style={{ display: 'block', textAlign: 'center', marginBottom: '2.5rem', fontSize: '1.75rem' }}>
              Finalize Reservation
            </h2>
            
            <div className="booking-grid-2col">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="booking-label">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Master Chief" 
                    className="datepicker-input" 
                    value={bookingData.name} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="booking-label">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="chief@unsc.mil" 
                    className="datepicker-input" 
                    value={bookingData.email} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="booking-label">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="+1 (555) 343-117" 
                    className="datepicker-input" 
                    value={bookingData.phone} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className="glass" style={{ borderRadius: 'var(--border-radius-md)', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', border: '1px solid rgba(0, 242, 254, 0.15)' }}>
                  <CreditCard className="text-glow-cyan" style={{ color: 'var(--accent-cyan)' }} />
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    <strong style={{ color: '#fff' }}>Instant Reservation Booking</strong><br />
                    No prepayment required today. Card holds slot. Pay at the esports lounge desk.
                  </div>
                </div>
              </div>
              
              <div>
                <BookingSummarySidebar 
                  selectedZone={selectedZone}
                  bookingData={bookingData}
                  baseTotal={baseTotal}
                  addonsTotal={addonsTotal}
                  grandTotal={grandTotal}
                  addonsList={addonsList}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION RECEIPT */}
        {currentStep === 5 && bookingConfirmedData && (
          <div className="animate-scale-up receipt-pulse receipt-container glass glass-glow-cyan">
            <div className="receipt-header">
              <div className="success-icon-container">
                <CheckCircle size={36} />
              </div>
              <span className="receipt-badge">Booking ID: {bookingConfirmedData.id}</span>
              <h2 className="receipt-title">Session Locked In!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Show this digital receipt at the front desk when arriving.
              </p>
            </div>
            
            <div className="receipt-body">
              <h4 className="receipt-section-title">Details</h4>
              <div className="receipt-row">
                <span className="receipt-label">Arena Station</span>
                <span className="receipt-val" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  {bookingConfirmedData.zoneName}
                </span>
              </div>
              
              <div className="receipt-row">
                <span className="receipt-label">Date</span>
                <span className="receipt-val">{bookingConfirmedData.date}</span>
              </div>
              
              <div className="receipt-row">
                <span className="receipt-label">Start Time</span>
                <span className="receipt-val">{bookingConfirmedData.slot}</span>
              </div>
              
              <div className="receipt-row">
                <span className="receipt-label">Duration</span>
                <span className="receipt-val">{bookingConfirmedData.duration} Hours</span>
              </div>

              <div className="receipt-row">
                <span className="receipt-label">Players Count</span>
                <span className="receipt-val">{bookingConfirmedData.players} Player(s)</span>
              </div>

              {bookingConfirmedData.addons.length > 0 && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                  <h4 className="receipt-section-title">Upgrades Enabled</h4>
                  {bookingConfirmedData.addons.map(aid => {
                    const add = addonsList.find(a => a.id === aid);
                    return (
                      <div key={aid} className="receipt-row" style={{ fontSize: '0.8rem' }}>
                        <span className="receipt-label" style={{ color: 'var(--text-secondary)' }}>• {add?.name}</span>
                        <span className="receipt-val">₹{add?.price}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <div className="receipt-row" style={{ fontSize: '1.15rem' }}>
                  <span className="receipt-label" style={{ color: '#fff', fontWeight: 700 }}>Total Charge</span>
                  <span className="receipt-val" style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>
                    ₹{bookingConfirmedData.totalPrice}.00
                  </span>
                </div>
              </div>
            </div>

            <div className="receipt-body" style={{ background: 'rgba(0,0,0,0.1)' }}>
              <h4 className="receipt-section-title">Customer Details</h4>
              <div className="receipt-row">
                <span className="receipt-label">Gamer Profile</span>
                <span className="receipt-val">{bookingConfirmedData.name}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Email</span>
                <span className="receipt-val">{bookingConfirmedData.email}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Contact Link</span>
                <span className="receipt-val">{bookingConfirmedData.phone}</span>
              </div>
            </div>
            
            <div className="receipt-footer">
              <div className="barcode-mock"></div>
              
              <div className="receipt-actions">
                <button className="btn-secondary" onClick={handlePrint}>
                  <Printer size={16} />
                  Print
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    // Reset booking flow
                    setBookingConfirmedData(null);
                    setBookingData({
                      zoneId: '',
                      date: new Date().toISOString().split('T')[0],
                      slot: '',
                      duration: 2,
                      players: 1,
                      addons: [],
                      name: '',
                      email: '',
                      phone: '',
                    });
                    setCurrentStep(1);
                  }}
                >
                  Book Another
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )}

  </div>

      {/* Stepper Footer Controls */}
      {currentStep < 5 && (
        <div className="stepper-nav">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={prevStep}
            style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
          >
            <ChevronLeft size={16} />
            Back
          </button>
          
          <button 
            type="button" 
            className="btn-primary" 
            onClick={nextStep}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading-spinner">Confirming...</span>
            ) : (
              <>
                {currentStep === 4 ? 'Confirm & Lock Slot' : 'Next Step'}
                {currentStep !== 4 && <ArrowRight size={16} />}
              </>
            )}
          </button>
        </div>
      )}

    </div>
  );
};

// Internal component for displaying current booking summary
const BookingSummarySidebar = ({ selectedZone, bookingData, baseTotal, addonsTotal, grandTotal, addonsList }) => {
  return (
    <div className="booking-summary-sidebar glass">
      <h4 className="summary-title">Summary</h4>
      
      {selectedZone ? (
        <>
          <div className="summary-row">
            <span className="summary-label">Selected Zone</span>
            <span className="summary-val">{selectedZone.name}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Hourly Rate</span>
            <span className="summary-val">₹{selectedZone.price}/hr</span>
          </div>
        </>
      ) : (
        <div className="summary-row" style={{ color: 'var(--text-tertiary)' }}>No zone selected yet.</div>
      )}

      <div className="summary-row">
        <span className="summary-label">Date Selected</span>
        <span className="summary-val">{bookingData.date || '—'}</span>
      </div>

      <div className="summary-row">
        <span className="summary-label">Session Slot</span>
        <span className="summary-val">{bookingData.slot ? bookingData.slot : '—'}</span>
      </div>

      <div className="summary-row">
        <span className="summary-label">Duration</span>
        <span className="summary-val">{bookingData.duration} hour(s)</span>
      </div>

      <div className="summary-row">
        <span className="summary-label">Players count</span>
        <span className="summary-val">{bookingData.players} player(s)</span>
      </div>

      {bookingData.addons.length > 0 && (
        <div style={{ margin: '1rem 0', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
          <span className="booking-label" style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}>Upgrades Selected</span>
          {bookingData.addons.map(aid => {
            const add = addonsList.find(a => a.id === aid);
            return (
              <div key={aid} className="summary-row" style={{ fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                <span className="summary-label">• {add?.name}</span>
                <span className="summary-val">₹{add?.price}</span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
        <div className="summary-row" style={{ marginBottom: 0 }}>
          <span className="summary-label" style={{ color: '#fff', fontWeight: 700 }}>Grand Total</span>
          <span className="summary-val total">₹{grandTotal}.00</span>
        </div>
      </div>
    </div>
  );
};

export default BookingStepper;
