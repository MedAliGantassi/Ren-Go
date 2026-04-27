import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './PropertyCardSecondary.css';

// ── Favorite logic constants ─────────────────────────────────────
const FAVORITE_MESSAGES = {
  unauthenticated: 'Veuillez vous connecter',
  wrongRole:       'Action réservée aux clients',
};

// ─────────────────────────────────────────────────────────────────
export default function PropertyCardSecondary({
  property,
  isAuthenticated = false,
  userRole        = null,
  onFavoriteToggle,   // (id, newState) => void — hook up to API later
  onToast,            // (message, type) => void — parent handles toast/snackbar
}) {
  const navigate = useNavigate();

  const { id, title, location, image, price, rating, isFavorite: initialFav = false } = property;

  const [isFavorite, setIsFavorite] = useState(initialFav);
  const [isHovered,  setIsHovered]  = useState(false);

  // ── Navigate to detail page ───────────────────────────────────
  const handleCardClick = () => navigate(`/properties/${id}`);

  // ── Favorite toggle with auth guard ──────────────────────────
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // ← critical: prevent card navigation

    if (!isAuthenticated) {
      onToast?.(FAVORITE_MESSAGES.unauthenticated, 'warning');
      return;
    }

    if (userRole !== 'client') {
      onToast?.(FAVORITE_MESSAGES.wrongRole, 'warning');
      return;
    }

    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavoriteToggle?.(id, newState); // ready for API call
  };

  return (
    <motion.article
      className="pcs-card"
      onClick={handleCardClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, boxShadow: '0 16px 48px rgba(7,85,69,0.2)' }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      role="button"
      tabIndex={0}
      aria-label={`Voir ${title}`}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {/* ── Image ── */}
      <div className="pcs-image-wrapper">
        <motion.img
          src={image}
          alt={title}
          className="pcs-image"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          loading="lazy"
        />

        {/* Favorite button */}
        <motion.button
          className={`pcs-fav-btn ${isFavorite ? 'pcs-fav-btn--active' : ''}`}
          onClick={handleFavoriteClick}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <motion.img
            key={isFavorite ? 'fav' : 'unfav'}
            src={
              isFavorite
                ? '/src/assets/icons/favorisred.png'
                : '/src/assets/icons/favoris.png'
            }
            alt=""
            className="pcs-fav-icon"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      </div>

      {/* ── Body ── */}
      <div className="pcs-body">
        <h3 className="pcs-title">{title}</h3>
        <p className="pcs-location">{location}</p>

        {/* Rating + Price row */}
        <div className="pcs-meta">
          <div className="pcs-rating">
            <img src="/src/assets/icons/star.png" alt="★" className="pcs-star" />
            <span>{rating}</span>
          </div>
          <div className="pcs-price">
            <span className="pcs-price-amount">${price}</span>
            <span className="pcs-price-unit"> /night</span>
          </div>
        </div>

        {/* CTA button */}
        <motion.button
          className="pcs-cta"
          onClick={handleCardClick}
          whileHover={{ backgroundColor: '#054035' }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          View
        </motion.button>
      </div>
    </motion.article>
  );
}