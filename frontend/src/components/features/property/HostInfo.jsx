import React from 'react';
import './HostInfo.css';

const HostInfo = ({ 
  name = 'Maria González', 
  avatar = null, 
  rating = '4.8', 
  yearsOnPlatform = 5, 
  totalProperties = 8, 
  responseRate = '98%' 
}) => {
  // Extract first letter for avatar fallback
  const getInitial = (nameStr) => {
    return nameStr ? nameStr.charAt(0).toUpperCase() : 'H';
  };

  return (
    <div className="host-info-card">
      <div className="host-info-content">
        <div className="host-avatar-wrapper">
          {avatar ? (
            <img src={avatar} alt={`Avatar of host ${name}`} className="host-avatar-image" />
          ) : (
            <div className="host-avatar-placeholder" aria-label={`Avatar of host ${name}`}>
              {getInitial(name)}
            </div>
          )}
        </div>

        <div className="host-details-wrapper">
          <h2 className="host-info-title">Hosted by {name}</h2>
          
          <div className="host-badges">
            <div className="host-badge">
              <svg 
                className="host-icon star-icon" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="badge-text"><strong className="badge-highlight">{rating}</strong> Owner Rating</span>
            </div>
            
            <span className="badge-separator">·</span>
            
            <div className="host-badge">
              <svg 
                className="host-icon ribbon-icon" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="6"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
              <span className="badge-text">{yearsOnPlatform} years on Ren&Go</span>
            </div>
          </div>

          <div className="host-stats-grid">
            <div className="host-stat-card">
              <span className="stat-label">Total Properties</span>
              <span className="stat-value">{totalProperties}</span>
            </div>
            <div className="host-stat-card">
              <span className="stat-label">Response Rate</span>
              <span className="stat-value">{responseRate}</span>
            </div>
          </div>
          
          <button className="contact-host-btn">Contact host</button>
        </div>
      </div>
    </div>
  );
};

export default HostInfo;
