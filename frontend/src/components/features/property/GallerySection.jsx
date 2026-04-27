import React, { useState, useEffect } from 'react';
import './GallerySection.css';

const GallerySection = ({ images = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="gallery-empty">No images available</div>;
  }

  const mainImage = images[0];
  const gridImages = images.slice(1, 5); // Take up to 4 images for the grid

  const handleImageClick = (index) => {
    setActiveImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (modalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  return (
    <div className="gallery-section-container">
      <div className="gallery-grid">
        {/* Main Image */}
        <div 
          className="gallery-main-image-wrapper" 
          onClick={() => handleImageClick(0)}
        >
          <img src={mainImage} alt="Main" className="gallery-image" />
        </div>

        {/* Smaller Images Grid */}
        <div className="gallery-small-images-container">
          {gridImages.map((img, index) => {
            const isLastOfGrid = index === 3;
            const remainingCount = images.length - 5;
            const hasMoreImages = isLastOfGrid && remainingCount > 0;

            return (
              <div 
                key={index} 
                className="gallery-small-image-wrapper"
                onClick={() => handleImageClick(index + 1)}
              >
                <img src={img} alt={`Gallery ${index + 1}`} className="gallery-image" />
                {hasMoreImages && (
                  <div className="gallery-more-overlay">
                    <span>+{remainingCount} photos</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Screen Modal Placeholder */}
      {modalOpen && (
        <div className="gallery-modal-overlay" onClick={closeModal}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={closeModal}>
              &times;
            </button>
            <img 
              src={images[activeImageIndex]} 
              alt="Full Screen" 
              className="gallery-modal-image" 
            />
            {/* Optional: Navigation buttons could go here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection;
