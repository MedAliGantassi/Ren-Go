import React, { useState, useEffect, useRef } from 'react';
import './BookingCard.css';

const BookingCard = ({ 
  pricePerNight = 450, 
  rating = 4.9, 
  reviewsCount = 120,
  selectedDates = null,
  onDateChange,
  unavailableDates = [],
  onBookingSubmit 
}) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState('');
  const [isPriceAnimating, setIsPriceAnimating] = useState(false);
  const cardRef = useRef(null);

  // Helper to format date cleanly
  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Sync props to local state if provided
  useEffect(() => {
    if (selectedDates) {
      if (selectedDates.start) {
        const offsetStart = new Date(selectedDates.start.getTime() - (selectedDates.start.getTimezoneOffset() * 60000));
        setCheckIn(offsetStart.toISOString().split('T')[0]);
      } else {
        setCheckIn('');
      }
      
      if (selectedDates.end) {
        const offsetEnd = new Date(selectedDates.end.getTime() - (selectedDates.end.getTimezoneOffset() * 60000));
        setCheckOut(offsetEnd.toISOString().split('T')[0]);
      } else {
        setCheckOut('');
      }
    }
  }, [selectedDates]);

  const [totalNights, setTotalNights] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const serviceFee = 40; // Flat fee example
  const [totalPrice, setTotalPrice] = useState(0);

  const triggerPriceAnimation = () => {
    setIsPriceAnimating(true);
    setTimeout(() => setIsPriceAnimating(false), 500);
  };

  useEffect(() => {
    setDateError('');
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      
      // Calculate start of day in UTC to avoid timezone/DST shifting issues
      const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
      const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
      
      if (utcEnd <= utcStart) {
        setDateError('Check-out must be after check-in');
        setTotalNights(0);
        return;
      }
      
      // Overlap check
      let hasOverlap = false;
      const getFormatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const unavailableSet = new Set(unavailableDates.map(d => typeof d === 'string' ? d : getFormatDate(new Date(d))));
      
      let tempDate = new Date(utcStart);
      while (tempDate <= new Date(utcEnd)) {
        if (unavailableSet.has(getFormatDate(tempDate))) {
          hasOverlap = true;
          break;
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }

      if (hasOverlap) {
        setDateError('Selected dates overlap with unavailable dates');
        setTotalNights(0);
        return;
      }

      const timeDiff = utcEnd - utcStart;
      const nights = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      // Prevent same day booking
      if (nights < 1) {
        setDateError('Check-out must be after check-in');
        setTotalNights(0);
        return;
      }

      setTotalNights(nights);
      
      const calculatedBase = pricePerNight * nights;
      const newTotal = calculatedBase + serviceFee;
      
      if (totalPrice !== newTotal && nights > 0) {
          triggerPriceAnimation();
          setTimeout(() => {
              cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 150);
      }
      
      setBasePrice(calculatedBase);
      setTotalPrice(newTotal);

      // Optionally notify parent if input changed manually
      if (onDateChange && (!selectedDates || new Date(checkIn).getTime() !== selectedDates.start?.getTime() || new Date(checkOut).getTime() !== selectedDates.end?.getTime())) {
          onDateChange({ start: new Date(checkIn), end: new Date(checkOut) });
      }

    } else {
      setTotalNights(0);
      if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
          setDateError('Check-out must be after check-in');
      }
    }
  }, [checkIn, checkOut, pricePerNight, serviceFee, unavailableDates, onDateChange]);

  const handleGuestChange = (increment) => {
    setGuests(prev => {
      const newGuests = prev + increment;
      return newGuests >= 1 ? newGuests : 1;
    });
  };

  const handleBookNow = () => {
    if (!checkIn || !checkOut) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (onBookingSubmit) {
        onBookingSubmit({ checkIn, checkOut, guests, totalPrice });
      }
    }, 1500);
  };

  const hasDates = totalNights > 0;

  return (
    <div className="booking-card-container" ref={cardRef}>
      <div className="booking-card-header">
        <div className="booking-price">
          <span className="price-amount">${pricePerNight}</span>
          <span className="price-label">per night</span>
        </div>
      </div>

      <div className={`booking-selectors ${dateError ? 'has-error' : ''}`}>
        <div className="date-selectors">
          <div className="date-input-group check-in-group">
            <label>Check-in</label>
            <div className="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <input 
                type="date" 
                value={checkIn} 
                onChange={(e) => setCheckIn(e.target.value)} 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div className="date-input-group check-out-group">
            <label>Check-out</label>
            <div className="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <input 
                type="date" 
                value={checkOut} 
                onChange={(e) => setCheckOut(e.target.value)} 
                min={checkIn || new Date().toISOString().split('T')[0]}
                disabled={!checkIn}
              />
            </div>
          </div>
        </div>
        
        <div className="guests-selector-container">
          <label>Guests</label>
          <div className="guests-input-wrapper">
             <div className="guests-display">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>{guests} guest{guests > 1 ? 's' : ''}</span>
             </div>
             <div className="guests-controls">
                <button 
                  className="guest-btn" 
                  onClick={() => handleGuestChange(-1)}
                  disabled={guests <= 1}
                >
                  -
                </button>
                <span className="guests-number">{guests}</span>
                <button 
                  className="guest-btn" 
                  onClick={() => handleGuestChange(1)}
                >
                  +
                </button>
             </div>
          </div>
        </div>
      </div>

      {dateError && <div className="date-error-msg">{dateError}</div>}
      {totalNights > 0 && !dateError && (
        <div className="nights-display">
          <svg className="nights-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          {formatDateShort(checkIn)} &rarr; {formatDateShort(checkOut)} &middot; {totalNights} night{totalNights > 1 ? 's' : ''}
        </div>
      )}

      <div className="booking-action-bar">
        <button 
          className={`book-now-btn ${isLoading ? 'loading' : ''} ${!hasDates || dateError ? 'disabled' : ''}`}
          onClick={handleBookNow}
          disabled={!hasDates || isLoading || !!dateError}
        >
          {isLoading ? (
            <>
              <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="4" strokeOpacity="0.3"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" strokeLinecap="round"></path>
              </svg>
              Processing...
            </>
          ) : 'Reserve'}
        </button>

        <div className="trust-text">
          You won't be charged yet
        </div>
      </div>

      {hasDates && !dateError && (
        <div className="price-breakdown">
          <div className="price-row">
            <span>${pricePerNight} x {totalNights} nights</span>
            <span>${basePrice}</span>
          </div>
          <div className="price-row">
            <span>Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="price-divider"></div>
          <div className={`price-row total-row ${isPriceAnimating ? 'price-animate' : ''}`}>
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}

      <div className="trust-badges">
        <div className="trust-badge">
          <svg className="trust-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Secure payment
        </div>
        <div className="trust-badge">
          <svg className="trust-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Free cancellation
        </div>
      </div>
    </div>
  );
};

export default BookingCard;