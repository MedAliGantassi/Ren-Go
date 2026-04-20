import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './PropertyCardSecondary.css';

// icons (Vite correct way)
import favIcon from '@/assets/icons/favoris.png';
import favRedIcon from '@/assets/icons/favorisred.png';
import starIcon from '@/assets/icons/star.png';

const FAVORITE_MESSAGES = {
  unauthenticated: 'Veuillez vous connecter',
  wrongRole: 'Action réservée aux clients',
};

export default function PropertyCardSecondary({
  property,
  isAuthenticated = false,
  userRole = null,
  onFavoriteToggle,
  onToast,
}) {
  const navigate = useNavigate();

  const {
    id,
    title,
    location,
    image,
    price,
    rating,
    isFavorite: initialFav = false,
  } = property;

  const [isFavorite, setIsFavorite] = useState(initialFav);
  const [isHovered, setIsHovered] = useState(false);

  // ✅ sync with backend changes
  useEffect(() => {
    setIsFavorite(initialFav);
  }, [initialFav]);

  // navigate
  const handleCardClick = () => {
    navigate(`/properties/${id}`);
  };

  // CTA fix
  const handleCTA = (e) => {
    e.stopPropagation();
    handleCardClick();
  };

  // favorite logic
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      onToast?.(FAVORITE_MESSAGES.unauthenticated, 'warning');
      return;
    }

    if (userRole !== 'client') {
      onToast?.(FAVORITE_MESSAGES.wrongRole, 'warning');
      return;
    }

    const newState = !isFavorite;

    try {
      setIsFavorite(newState); // optimistic UI
      await onFavoriteToggle?.(id, newState);
    } catch (err) {
      setIsFavorite(!newState); // rollback
    }
  };

  return (
    <motion.article
      className="pcs-card"
      onClick={handleCardClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 16px 48px rgba(7,85,69,0.2)',
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      role="button"
      tabIndex={0}
      aria-label={`Voir ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
        if (e.key === ' ') e.preventDefault();
      }}
    >
      {/* IMAGE */}
      <div className="pcs-image-wrapper">
        <motion.img
          src={image}
          alt={title}
          className="pcs-image"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.45 }}
        />

        {/* FAVORITE */}
        <motion.button
          className={`pcs-fav-btn ${
            isFavorite ? 'pcs-fav-btn--active' : ''
          }`}
          onClick={handleFavoriteClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle favorite"
        >
          <motion.img
            key={isFavorite ? 'fav' : 'unfav'}
            src={isFavorite ? favRedIcon : favIcon}
            className="pcs-fav-icon"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      </div>

      {/* BODY */}
      <div className="pcs-body">
        <h3 className="pcs-title">{title}</h3>
        <p className="pcs-location">{location}</p>

        <div className="pcs-meta">
          <div className="pcs-rating">
            <img src={starIcon} alt="rating" className="pcs-star" />
            <span>{rating}</span>
          </div>

          <div className="pcs-price">
            <span className="pcs-price-amount">{price} DT</span>
            <span className="pcs-price-unit"> / nuit</span>
          </div>
        </div>

        <motion.button
          className="pcs-cta"
          onClick={handleCTA}
          whileHover={{ backgroundColor: '#054035' }}
          whileTap={{ scale: 0.97 }}
        >
          Voir
        </motion.button>
      </div>
    </motion.article>
  );
}