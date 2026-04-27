import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '../../../components/common/PropertyCard/PropertyCard';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import './PropertyListingPage.css';

// Property Type Icons
import maisonIcon from '../../../assets/icons/maison.png';
import maisonHoteIcon from '../../../assets/icons/maison-hote.png';
import villaIcon from '../../../assets/icons/villa.png';
import appartementIcon from '../../../assets/icons/appartement.png';

// Mock Data matching the screenshot
const MOCK_PROPERTIES = [
  { id: 1, type: 'Villa', title: 'Villa Méditerranéenne Premium', location: 'La Marsa', price: 450, rating: 4.9, isFavorite: false, images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'], beds: 4, baths: 3, guests: 8, status: 'POPULAIRE' },
  { id: 2, type: 'Maison d\'hôtes', title: 'Maison d\'Hôtes Moderne Sousse', location: 'Sousse', price: 320, rating: 4.7, isFavorite: false, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'], beds: 3, baths: 2, guests: 6, status: 'DISPONIBLE' },
  { id: 3, type: 'Appartement', title: 'Appartement Vue Mer Gammarth', location: 'Gammarth', price: 280, rating: 4.6, isFavorite: false, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'], beds: 2, baths: 1, guests: 4, status: 'DISPONIBLE' },
  { id: 4, type: 'Villa', title: 'Villa Côtière avec Piscine', location: 'Hammamet', price: 550, rating: 4.8, isFavorite: false, images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80'], beds: 4, baths: 3, guests: 8, status: 'POPULAIRE' },
  { id: 5, type: 'Maison', title: 'Maison Traditionnelle Sidi Bou', location: 'Sidi Bou Said', price: 720, rating: 5.0, isFavorite: false, images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80'], beds: 5, baths: 4, guests: 10, status: 'POPULAIRE' },
  { id: 6, type: 'Appartement', title: 'Appartement Centre Ville', location: 'Tunis', price: 200, rating: 4.4, isFavorite: false, images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'], beds: 2, baths: 1, guests: 4, status: 'DISPONIBLE' },
  { id: 7, type: 'Villa', title: 'Villa Luxueuse Bord de Mer', location: 'Bizerte', price: 650, rating: 4.9, isFavorite: false, images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'], beds: 5, baths: 4, guests: 10, status: 'POPULAIRE' },
  { id: 8, type: 'Maison d\'hôtes', title: 'Maison d\'Hôtes Authentique', location: 'Nabeul', price: 380, rating: 4.7, isFavorite: false, images: ['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=80'], beds: 3, baths: 2, guests: 6, status: 'DISPONIBLE' },
  { id: 9, type: 'Appartement', title: 'Appartement Moderne avec Vue', location: 'La Marsa', price: 350, rating: 4.5, isFavorite: false, images: ['https://images.unsplash.com/photo-1502672260266-1c1e525044c7?w=600&q=80'], beds: 2, baths: 2, guests: 5, status: 'DISPONIBLE' }
];

export default function PropertyListingPage() {
  const [searchParams] = useSearchParams();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 50, max: 800 });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [guests, setGuests] = useState(4);
  const [minRating, setMinRating] = useState(0);
  
  // View State
  const [filteredProperties, setFilteredProperties] = useState(MOCK_PROPERTIES);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const propertiesPerPage = 9;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const dateDebut = searchParams.get('dateDebut');
    const dateFin = searchParams.get('dateFin');
    
    let result = MOCK_PROPERTIES;
    // Simulate filtering for dates if provided
    if (dateDebut || dateFin) {
      // Mock logic: randomly filter properties or just show all for now since mock data lacks dates,
      // but showing we act on it by e.g. displaying a 'dates filtered' state or simply maintaining them
      // We will filter out ones with even IDs randomly as mock
      result = result.filter(p => p.id % 2 !== 0); 
    }
    
    setFilteredProperties(result);
  }, [searchParams]);

  // Handlers
  const handleTypeToggle = (type) => {
    setPropertyTypes((prev) => 
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleApplyFilters = () => {
    let result = MOCK_PROPERTIES;

    // Filter by search
    if (searchTerm) {
      result = result.filter(p => 
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Filter by property type
    if (propertyTypes.length > 0) {
      result = result.filter(p => propertyTypes.includes(p.type));
    }

    // Filter by guests
    result = result.filter(p => p.guests >= guests);

    // Filter by rating
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating_desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProperties(result);
    setCurrentPage(1); // Reset to first page
    
    // Scroll to top of results smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: 50, max: 800 });
    setPropertyTypes([]);
    setGuests(4);
    setMinRating(0);
    setFilteredProperties(MOCK_PROPERTIES);
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="plp-page">
      <Navbar />
      <main className="plp-main">
        {/* PAGE HEADER */}
        <header className="plp-header">
          <div>
            <h1 className="plp-title">Toutes nos maisons</h1>
            <p className="plp-subtitle">{filteredProperties.length} maisons disponibles en Tunisie</p>
          </div>
          
          <div className="plp-header-actions">
            <div className="plp-view-toggles">
              <button className="plp-view-btn plp-view-btn--active">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </button>
              <button className="plp-view-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </button>
            </div>
          </div>
        </header>

        <div className="plp-content-wrapper">
          {/* LEFT SIDEBAR (FILTERS) */}
          <motion.aside 
            className="plp-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="plp-filter-header">
              <h2>Filtres</h2>
              <button className="plp-reset-btn" onClick={handleResetFilters}>Réinitialiser</button>
            </div>

            <div className="plp-filter-group">
              <label>Recherche rapide</label>
              <div className="plp-search-input-wrapper">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  placeholder="Ville, région..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="plp-filter-group">
              <div className="plp-filter-row">
                <label>Prix par nuit</label>
              </div>
              <div className="plp-price-range-displays">
                <span className="plp-price-min">{priceRange.min} DT</span>
                <span className="plp-price-sep">—</span>
                <span className="plp-price-max">{priceRange.max} DT</span>
              </div>
              
              <div className="plp-slider-container">
                 <input 
                   type="range"
                   min="50"
                   max="800"
                   value={priceRange.max}
                   className="plp-range-slider"
                   onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                   style={{ background: `linear-gradient(to right, #075545 ${(priceRange.max - 50) / 750 * 100}%, #ddd ${(priceRange.max - 50) / 750 * 100}%)` }}
                 />
              </div>

              <div className="plp-price-inputs">
                <input 
                  type="number" 
                  value={priceRange.min}
                  readOnly
                />
                <input 
                  type="number" 
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="plp-filter-group">
              <label>Type de propriété</label>
              <div className="plp-property-types-grid">
                {[
                  { id: 'Maison', icon: maisonIcon, label: 'Maison' },
                  { id: 'Maison d\'hôtes', icon: maisonHoteIcon, label: 'Maison d\'hôtes' },
                  { id: 'Villa', icon: villaIcon, label: 'Villa' },
                  { id: 'Appartement', icon: appartementIcon, label: 'Appartement' }
                ].map(pt => (
                  <button 
                    key={pt.id}
                    className={`plp-type-btn ${propertyTypes.includes(pt.id) ? 'active' : ''}`}
                    onClick={() => handleTypeToggle(pt.id)}
                  >
                    <img src={pt.icon} alt={pt.label} />
                    <span>{pt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="plp-filter-group plp-guests-group">
              <label>Nombre de personnes</label>
              <div className="plp-guests-counter">
                <button 
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="plp-counter-btn"
                >-</button>
                <span className="plp-counter-value">{guests}</span>
                <button 
                  onClick={() => setGuests(guests + 1)}
                  className="plp-counter-btn plus"
                >+</button>
              </div>
            </div>

            <div className="plp-filter-group">
              <label>Note minimale</label>
              <div className="plp-rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                   <button 
                    key={star} 
                    className={`plp-star-btn ${star <= minRating ? 'active' : ''}`}
                    onClick={() => setMinRating(star)}
                   >
                     ★
                   </button>
                ))}
              </div>
            </div>

            <button className="plp-apply-btn" onClick={handleApplyFilters}>
              Appliquer
            </button>
          </motion.aside>

          {/* RIGHT CONTENT */}
          <section className="plp-results">
            <div className="plp-results-toolbar">
              <span>{filteredProperties.length} résultats trouvés</span>
              <div className="plp-sort">
                <label>Trier par</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="">Recommandé</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="rating_desc">Mieux notés</option>
                </select>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="plp-no-results">
                <h3>Aucune propriété ne correspond à vos critères.</h3>
                <button onClick={handleResetFilters}>Réinitialiser les filtres</button>
              </div>
            ) : (
              <motion.div 
                className="plp-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {currentProperties.map(property => (
                    <motion.div key={property.id} variants={itemVariants} layoutId={`prop-${property.id}`}>
                      <PropertyCard 
                        property={property}
                        onViewDetails={(id) => console.log('View property', id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="plp-pagination">
                <button 
                  className="plp-page-btn arrow"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                
                {[...Array(totalPages)].map((_, idx) => (
                  <button 
                    key={idx}
                    className={`plp-page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button 
                  className="plp-page-btn arrow"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
                <p className="plp-page-info">Affichage {indexOfFirstProperty + 1}-{Math.min(indexOfLastProperty, filteredProperties.length)} sur {filteredProperties.length} résultats</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
