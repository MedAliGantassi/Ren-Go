import React, { useState, useMemo } from 'react';
import './BookingCalendar.css';

const BookingCalendar = ({ 
  unavailableDates = [], 
  selectedDates = { start: null, end: null }, 
  onDateChange 
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignore time part exactly as requested

  // Context date is reference: April 26, 2026. Taking current month.
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [hoverDate, setHoverDate] = useState(null);

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Date formatting helpers
  const getFormatDate = (date) => {
    if (!date) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const unavailableSet = useMemo(() => {
    const set = new Set();
    unavailableDates.forEach(d => {
      const dateObj = typeof d === 'string' ? new Date(d) : d;
      set.add(getFormatDate(dateObj));
    });
    return set;
  }, [unavailableDates]);

  // Calendar properties
  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();
  
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const generateDays = () => {
    const days = [];
    
    // Empty slots
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDayDate = new Date(year, monthIndex, day);
      const formattedDay = getFormatDate(currentDayDate);
      
      const isPast = currentDayDate < today;
      const isBooked = unavailableSet.has(formattedDay);
      
      let isSelected = false;
      let isInRange = false;
      let isHoverRange = false;

      if (selectedDates.start) {
        if (formattedDay === getFormatDate(selectedDates.start)) isSelected = true;
        if (selectedDates.end) {
          if (formattedDay === getFormatDate(selectedDates.end)) isSelected = true;
          if (currentDayDate > selectedDates.start && currentDayDate < selectedDates.end) {
            isInRange = true; 
          }
        } else if (hoverDate && currentDayDate > selectedDates.start && currentDayDate <= hoverDate) {
          isHoverRange = true;
        }
      }

      let statusClass = 'available';
      if (isPast) {
        statusClass = 'past';
      } else if (isBooked) {
          statusClass = 'booked';
      } else if (isSelected) {
          statusClass = 'selected';
      } else if (isInRange) {
          statusClass = 'in-range';
      } else if (isHoverRange) {
          statusClass = 'hover-range';
      }

      const normalize = (d) => {
        const newDate = new Date(d);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
      };

      const handleDayClick = () => {
        if (isPast || isBooked) return;

        const clicked = normalize(currentDayDate);

        if (!selectedDates.start || selectedDates.end) {
          onDateChange({ start: clicked, end: null });
          return;
        }

        const start = normalize(selectedDates.start);

        if (clicked <= start) {
          onDateChange({ start: clicked, end: null });
          return;
        }

        onDateChange({ start, end: clicked });
      };

      const handleMouseEnter = () => {
        if (!isPast && !isBooked) {
          setHoverDate(currentDayDate);
        }
      };

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${statusClass}`}
          onClick={handleDayClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setHoverDate(null)}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="booking-calendar-container">
      <div className="booking-calendar-header">
        <h2 className="calendar-title">Availability</h2>
        <div className="calendar-controls">
          <button className="calendar-nav-btn" onClick={prevMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span className="calendar-month-year">{monthNames[monthIndex]} {year}</span>
          <button className="calendar-nav-btn" onClick={nextMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        {generateDays()}
      </div>

      <div className="calendar-legend-divider"></div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color available-color"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color booked-color"></span>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected-color"></span>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
