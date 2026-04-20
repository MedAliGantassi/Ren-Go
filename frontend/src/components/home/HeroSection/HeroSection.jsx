import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './HeroSection.css';

const DESTINATIONS = ['Tunis', 'Sousse', 'Hammamet', 'Djerba', 'Monastir', 'Sfax'];
const GUESTS_OPTIONS = ['1 personne', '2 personnes', '3 personnes', '4 personnes', '5+ personnes'];

export default function HeroSection({ onSearch }) {
  const [form, setForm] = useState({
    destination: '',
    arrivee: '',
    depart: '',
    personnes: '2 personnes',
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSearch = () => onSearch?.(form);

  return (
    <section className="hero-section">
      {/* Background image */}
      <div className="hero-bg" style={{ backgroundImage: `url(/src/assets/images/header-img.jpg)` }} />
      <div className="hero-overlay" />

      <Container className="hero-content">
        {/* Headline */}
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="hero-title">
            Nous vous trouvons la meilleure<br />
            <em>Maison idéale</em>
          </h1>
          <p className="hero-subtitle">
            La plateforme de confiance pour trouver et réserver<br />
            votre maison de vacances idéale en Tunisie
          </p>
          <motion.a
            href="/devenir-proprietaire"
            className="hero-cta-btn"
            whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(255,83,0,0.45)' }}
            whileTap={{ scale: 0.97 }}
          >
            Devenir propriétaire
          </motion.a>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="search-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Destination */}
          <div className="search-field">
            <label className="search-label">DESTINATION</label>
            <div className="search-input-row">
              <img src="/src/assets/icons/map.png" alt="" className="search-icon" />
              <input
                type="text"
                placeholder="Tunis, Sousse, Hammamet"
                className="search-input"
                value={form.destination}
                onChange={e => handleChange('destination', e.target.value)}
                list="dest-list"
              />
              <datalist id="dest-list">
                {DESTINATIONS.map(d => <option key={d} value={d} />)}
              </datalist>
            </div>
          </div>

          <div className="search-divider" />

          {/* Arrivée */}
          <div className="search-field">
            <label className="search-label">ARRIVÉE</label>
            <div className="search-input-row">
              <img src="/src/assets/icons/select.png" alt="" className="search-icon" />
              <input
                type="date"
                className="search-input"
                value={form.arrivee}
                onChange={e => handleChange('arrivee', e.target.value)}
              />
            </div>
          </div>

          <div className="search-divider" />

          {/* Départ */}
          <div className="search-field">
            <label className="search-label">DÉPART</label>
            <div className="search-input-row">
              <img src="/src/assets/icons/select.png" alt="" className="search-icon" />
              <input
                type="date"
                className="search-input"
                value={form.depart}
                onChange={e => handleChange('depart', e.target.value)}
              />
            </div>
          </div>

          <div className="search-divider" />

          {/* Personnes */}
          <div className="search-field search-field--personnes">
            <label className="search-label">PERSONNES</label>
            <div className="search-input-row">
              <img src="/src/assets/icons/perso.png" alt="" className="search-icon" />
              <select
                className="search-input"
                value={form.personnes}
                onChange={e => handleChange('personnes', e.target.value)}
              >
                {GUESTS_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Rechercher button */}
          <motion.button
            className="search-btn"
            onClick={handleSearch}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Rechercher
          </motion.button>
        </motion.div>
      </Container>
    </section>
  );
}
