import { useState } from 'react';
import './PropertyCard.css';

// ── Dynamic badge config ──────────────────────────────────────────
const BADGE_CONFIG = {
  DISPONIBLE: { label: 'Disponible', className: 'badge-disponible' },
  POPULAIRE:  { label: 'Populaire',  className: 'badge-populaire'  },
  NOUVEAU:    { label: 'Nouveau',    className: 'badge-nouveau'     },
};

// ── Icon paths ────────────────────────────────────────────────────
const ICONS = {
  star:     '/src/assets/icons/star.png',
  favorite: '/src/assets/icons/favoris.png',
  bed:      '/src/assets/icons/bed.png',
  bath:     '/src/assets/icons/bath.png',
  guests:   '/src/assets/icons/perso.png',
  map:      '/src/assets/icons/map.png',
};

// ─────────────────────────────────────────────────────────────────
export default function PropertyCard({ property, onViewDetails }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    title,
    location,
    rating,
    price,
    beds,
    baths,
    guests,
    status = 'DISPONIBLE',
    images = [],
  } = property;

  const badge = BADGE_CONFIG[status] ?? BADGE_CONFIG.DISPONIBLE;
  const image = images[0] ?? 'https://placehold.co/480x280?text=No+Image';

  return (
    <article className="property-card">

      {/* ── Image wrapper ── */}
      <div className="pc-image-wrapper">
        <img src={image} alt={title} className="pc-image" loading="lazy" />

        {/* Top-left: dynamic status badge */}
        <span className={`pc-badge ${badge.className}`}>
          {badge.label}
        </span>

        {/* Top-right: rating */}
        <div className="pc-rating">
          <img src={ICONS.star} alt="rating" className="pc-star-icon" />
          <span>{rating}</span>
        </div>

        {/* Bottom-right: favorite button */}
        <button
          className={`pc-favorite ${isFavorite ? 'pc-favorite--active' : ''}`}
          onClick={() => setIsFavorite(f => !f)}
          aria-label="Ajouter aux favoris"
        >
          <img src={ICONS.favorite} alt="favorite" className="pc-fav-icon" />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="pc-body">

        {/* Title */}
        <h3 className="pc-title">{title}</h3>

        {/* Location */}
        <div className="pc-location">
          <img src={ICONS.map} alt="location" className="pc-loc-icon" />
          <span>{location}</span>
        </div>

        {/* Features row */}
        <div className="pc-features">
          <div className="pc-feature">
            <img src={ICONS.bed}    alt="Chambres" />
            <span>{beds}</span>
          </div>
          <div className="pc-feature">
            <img src={ICONS.bath}   alt="Salles de bain" />
            <span>{baths}</span>
          </div>
          <div className="pc-feature">
            <img src={ICONS.guests} alt="Personnes" />
            <span>{guests}</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="pc-footer">
          <div className="pc-price">
            <span className="pc-price-amount">{price} DT</span>
            <span className="pc-price-unit"> /nuit</span>
          </div>
          <button
            className="pc-cta"
            onClick={() => onViewDetails?.(property)}
          >
            Voir détails
          </button>
        </div>

      </div>
    </article>
  );
}
