import React, { useState } from 'react';
import { 
  DollarSign, Calendar, Clock, Activity, Search, 
  Check, X, Award, RotateCcw, AlertTriangle, Eye, ShieldAlert 
} from 'lucide-react';

const AdminDashboard = ({ bookings, onUpdateBookingStatus, onDeleteBooking, addToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date().toISOString().split('T')[0]);

  // Pricing constants & zones
  const zonesList = [
    { id: 'ps5', name: 'PS5 Lounge Zone' },
    { id: 'pc', name: 'PC Gaming Zone' },
    { id: 'vr', name: 'VR Zone' },
    { id: 'racing', name: 'Racing Simulator Zone' },
    { id: 'party', name: 'Private Party Room' },
    { id: 'tournament', name: 'Tournament Arena' }
  ];

  const slotsList = [
    "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", 
    "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", 
    "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"
  ];

  // Calculate stats based on bookings array
  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const activeBookingsCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  
  // Occupancy rate calculation (booked slots relative to total available daily slots across all zones)
  const totalDailySlotsPossible = zonesList.length * slotsList.length;
  const bookingsOnSelectedDate = bookings.filter(b => b.date === selectedCalendarDate && b.status !== 'cancelled');
  const slotsBookedOnSelectedDate = bookingsOnSelectedDate.reduce((sum, b) => sum + (b.duration || 1), 0);
  const occupancyRate = totalDailySlotsPossible > 0 
    ? Math.min(Math.round((slotsBookedOnSelectedDate / totalDailySlotsPossible) * 100), 100)
    : 0;

  // Filtered bookings list
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.zoneName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Check which gamer booked a specific zone and hour slot (for calendar visualization)
  const getBookingForSlot = (zoneId, slotTime) => {
    return bookings.find(b => {
      if (b.status === 'cancelled') return false;
      if (b.date !== selectedCalendarDate) return false;
      if (b.zoneId !== zoneId) return false;
      
      // Calculate start hour and end hour
      const getHourNumber = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours;
      };

      const startHour = getHourNumber(b.slot);
      const slotHour = getHourNumber(slotTime);
      const endHour = startHour + b.duration;
      
      return slotHour >= startHour && slotHour < endHour;
    });
  };

  return (
    <div className="admin-container animate-fade-in">
      <div className="admin-header">
        <div>
          <h2 className="section-title" style={{ fontSize: '2rem', margin: 0 }}>Command Cockpit</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Real-time management console for bookings, setups, and revenues.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className="badge confirmed" style={{ gap: '0.35rem' }}>
            <Activity size={12} className="text-glow-cyan" />
            System Live
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card cyan glass">
          <div className="stat-header">
            <span className="stat-title">Total Revenue</span>
            <DollarSign size={20} className="stat-icon" />
          </div>
          <div className="stat-value">₹{totalRevenue}.00</div>
          <div className="stat-change up">↑ +14.2% from yesterday</div>
        </div>

        <div className="stat-card purple glass">
          <div className="stat-header">
            <span className="stat-title">Active Bookings</span>
            <Calendar size={20} className="stat-icon" />
          </div>
          <div className="stat-value">{activeBookingsCount} Sessions</div>
          <div className="stat-change up">↑ +8.3% this week</div>
        </div>

        <div className="stat-card pink glass">
          <div className="stat-header">
            <span className="stat-title">Completed Sessions</span>
            <Award size={20} className="stat-icon" />
          </div>
          <div className="stat-value">{completedCount} Players</div>
          <div className="stat-change" style={{ color: 'var(--text-secondary)' }}>Total logs archived</div>
        </div>

        <div className="stat-card green glass">
          <div className="stat-header">
            <span className="stat-title">Daily Occupancy</span>
            <Clock size={20} className="stat-icon" />
          </div>
          <div className="stat-value">{occupancyRate}%</div>
          <div className="stat-change up">Target: 75% peak load</div>
        </div>
      </div>

      {/* Interactive Time Slot Calendar Grid */}
      <div className="glass" style={{ borderRadius: 'var(--border-radius-md)', padding: '2rem', border: '1px solid rgba(121, 40, 202, 0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: '#fff' }}>
              Setup Schedule Grid
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
              Visual scheduler chart showing booked slots per setup.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="booking-label" style={{ fontSize: '0.75rem' }}>Select Grid Date:</span>
            <input 
              type="date" 
              className="datepicker-input" 
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
              value={selectedCalendarDate}
              onChange={(e) => setSelectedCalendarDate(e.target.value)}
            />
          </div>
        </div>

        {/* Schedule grid layout */}
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '850px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* Hour headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px repeat(14, 1fr)', textAlign: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Setup / Time</div>
              {slotsList.map(slot => (
                <div key={slot} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {slot.replace(':00', '')}
                </div>
              ))}
            </div>

            {/* Rows for each setup */}
            {zonesList.map(zone => (
              <div key={zone.id} style={{ display: 'grid', gridTemplateColumns: '180px repeat(14, 1fr)', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{zone.name}</div>
                {slotsList.map(slot => {
                  const activeBooking = getBookingForSlot(zone.id, slot);
                  return (
                    <div 
                      key={slot} 
                      style={{ 
                        margin: '0 2px',
                        height: '24px', 
                        borderRadius: '3px',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        transition: 'var(--transition-fast)',
                        ...(activeBooking ? {
                          background: 'rgba(121, 40, 202, 0.15)',
                          border: '1px solid var(--accent-purple)',
                          color: '#e9d5ff',
                          cursor: 'pointer',
                        } : {
                          background: 'rgba(57, 255, 20, 0.03)',
                          border: '1px solid rgba(57, 255, 20, 0.15)',
                          color: 'var(--accent-neon-green)',
                        })
                      }}
                      title={activeBooking ? `Booked by ${activeBooking.name} (${activeBooking.id})` : 'Slot Available'}
                    >
                      {activeBooking ? '•' : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Manager Table */}
      <div className="glass" style={{ borderRadius: 'var(--border-radius-md)', padding: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: '#fff', marginBottom: '1.5rem' }}>
          Bookings Repository
        </h3>
        
        <div className="admin-table-controls">
          <div className="search-input-container">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-btn-group">
            {[
              { id: 'all', label: 'All Sessions' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' }
            ].map(btn => (
              <button
                key={btn.id}
                className={`filter-btn ${statusFilter === btn.id ? 'active' : ''}`}
                onClick={() => setStatusFilter(btn.id)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="table-container">
          {filteredBookings.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Gamer Profile</th>
                  <th>Gaming Setup</th>
                  <th>Date & Time</th>
                  <th>Players</th>
                  <th>Bill Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{b.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{b.email}</div>
                    </td>
                    <td>{b.zoneName}</td>
                    <td>
                      <div>{b.date}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {b.slot} ({b.duration}h)
                      </div>
                    </td>
                    <td>{b.players}</td>
                    <td style={{ fontWeight: 700, color: '#fff' }}>₹{b.totalPrice}.00</td>
                    <td>
                      <span className={`badge ${b.status}`}>{b.status}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {b.status === 'confirmed' && (
                          <>
                            <button 
                              className="table-action-btn" 
                              title="Mark as Completed"
                              onClick={() => {
                                onUpdateBookingStatus(b.id, 'completed');
                                addToast('Updated', `Booking ${b.id} completed.`, 'success');
                              }}
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              className="table-action-btn cancel" 
                              title="Cancel Session"
                              onClick={() => {
                                onUpdateBookingStatus(b.id, 'cancelled');
                                addToast('Cancelled', `Booking ${b.id} cancelled.`, 'error');
                              }}
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        {b.status === 'cancelled' && (
                          <button 
                            className="table-action-btn" 
                            title="Re-activate Booking"
                            onClick={() => {
                              onUpdateBookingStatus(b.id, 'confirmed');
                              addToast('Restored', `Booking ${b.id} reactivated.`, 'success');
                            }}
                          >
                            <RotateCcw size={14} />
                          </button>
                        )}
                        <button 
                          className="table-action-btn cancel" 
                          title="Purge Record"
                          onClick={() => {
                            if (window.confirm(`Permanently purge booking ${b.id}?`)) {
                              onDeleteBooking(b.id);
                              addToast('Purged', `Booking record ${b.id} deleted.`, 'error');
                            }
                          }}
                        >
                          <ShieldAlert size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <AlertTriangle className="empty-state-icon" size={40} style={{ color: 'var(--text-tertiary)' }} />
              <p style={{ fontWeight: 600 }}>No bookings match the filter criteria</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                Try adjusting your search terms or status selections.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
