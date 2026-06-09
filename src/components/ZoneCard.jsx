import React from 'react';
import { Shield, Users, Calendar, ArrowRight } from 'lucide-react';

const ZoneCard = ({ zone, onBookClick }) => {
  return (
    <div className="zone-card glass glow-hover">
      <div className="zone-img-container">
        <img src={zone.image} alt={zone.name} className="zone-img" />
        <div className="zone-img-overlay"></div>
        <span className="zone-tag">{zone.tag}</span>
      </div>
      
      <div className="zone-details">
        <h3 className="zone-name">{zone.name}</h3>
        <p className="zone-desc">{zone.desc}</p>
        
        <div className="zone-specs">
          {zone.specs.map((spec, index) => (
            <span key={index} className="zone-spec-pill">
              <Shield size={12} className="text-glow-cyan" />
              {spec}
            </span>
          ))}
        </div>
        
        <div className="zone-info-row">
          <div className="zone-price">
            ₹{zone.price}<span>/hr</span>
          </div>
          
          <div className="zone-meta">
            <span className="zone-meta-item available">
              <Calendar size={14} />
              {zone.availableSlots} Slots Available
            </span>
            <span className="zone-meta-item">
              <Users size={14} />
              Max: {zone.capacity}
            </span>
          </div>
        </div>
        
        <button 
          className="zone-card-btn"
          onClick={() => onBookClick(zone.id)}
        >
          Book Arena
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ZoneCard;
