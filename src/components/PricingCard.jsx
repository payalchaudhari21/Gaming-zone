import React from 'react';
import { Check } from 'lucide-react';

const PricingCard = ({ plan, onSelect }) => {
  return (
    <div className={`pricing-card glass ${plan.popular ? 'popular' : 'glow-hover'}`}>
      <h3 className="pricing-title">{plan.name}</h3>
      
      <div className="pricing-amount">
        ₹{plan.price}
        <span> / {plan.period}</span>
      </div>
      
      <p className="pricing-desc">{plan.desc}</p>
      
      <ul className="pricing-features">
        {plan.features.map((feature, index) => (
          <li key={index} className="pricing-feature-item">
            <Check size={16} />
            {feature}
          </li>
        ))}
      </ul>
      
      <button 
        className={plan.popular ? 'btn-primary' : 'btn-secondary'}
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={onSelect}
      >
        Select Package
      </button>
    </div>
  );
};

export default PricingCard;
