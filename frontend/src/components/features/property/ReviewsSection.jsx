import React, { useState } from 'react';
import './ReviewsSection.css';

const defaultReviews = [
  {
    name: 'Sarah Johnson',
    date: 'March 2026',
    comment: 'Absolutely incredible villa! The views were stunning and the host was very responsive. Would definitely come back!',
    rating: '5'
  },
  {
    name: 'Michael Chen',
    date: 'February 2026',
    comment: 'Great location and beautiful property. The pool was amazing and the house had everything we needed.',
    rating: '4.8'
  },
  {
    name: 'Emma Rodriguez',
    date: 'January 2026',
    comment: 'Perfect for our family vacation. Clean, spacious, and the kitchen was well-equipped. Highly recommend!',
    rating: '5'
  }
];

const ReviewsSection = ({ reviews = defaultReviews }) => {
  const [visibleCount, setVisibleCount] = useState(2);

  if (!reviews || reviews.length === 0) return null;

  const displayedReviews = reviews.slice(0, visibleCount);

  return (
    <div className="reviews-section-container">
      <h2 className="reviews-section-title">Reviews</h2>
      
      <div className="reviews-list">
        {displayedReviews.map((review, index) => (
          <React.Fragment key={index}>
            <div className="review-item">
              <div className="review-content-left">
                <h3 className="review-author">{review.name}</h3>
                <span className="review-date">{review.date}</span>
                <p className="review-comment">{review.comment}</p>
              </div>
              
              <div className="review-rating-right">
                <svg 
                  className="review-star-icon" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="review-rating-value">{review.rating}</span>
              </div>
            </div>
            
            {index < displayedReviews.length - 1 && (
              <div className="review-divider"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {reviews.length > visibleCount && (
        <button 
          className="see-more-btn"
          onClick={() => setVisibleCount(reviews.length)}
        >
          Voir plus d’avis
        </button>
      )}
    </div>
  );
};

export default ReviewsSection;