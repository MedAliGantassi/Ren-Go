import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GallerySection from '../../components/features/property/GallerySection';
import PropertyInfo from '../../components/features/property/PropertyInfo';
import HostInfo from '../../components/features/property/HostInfo';
import BookingCalendar from '../../components/features/property/BookingCalendar';
import ReviewsSection from '../../components/features/property/ReviewsSection';
import BookingCard from '../../components/features/property/BookingCard';
import SimilarProperties from '../../components/features/property/SimilarProperties';
import './PropertyDetailsPage.css';

const MOCK_PROPERTIES = [
  { id: 1, type: 'Villa', title: 'Villa Méditerranéenne Premium', location: 'La Marsa', price: 450, rating: 4.9, isFavorite: false, images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80'], beds: 4, baths: 3, guests: 8, status: 'POPULAIRE', description: "Experience luxury living in this stunning Mediterranean villa.", owner: { name: 'Maria González', rating: '4.8', yearsOnPlatform: 5, totalProperties: 8, responseRate: '98%' }, reviews: [] },
  { id: 2, type: 'Maison d\'hôtes', title: 'Maison d\'Hôtes Moderne Sousse', location: 'Sousse', price: 320, rating: 4.7, isFavorite: false, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80'], beds: 3, baths: 2, guests: 6, status: 'DISPONIBLE', description: "Modern guest house with amazing pool.", owner: { name: 'Adam Smith', rating: '4.7', yearsOnPlatform: 3, totalProperties: 4, responseRate: '100%' }, reviews: [] },
  { id: 3, type: 'Appartement', title: 'Appartement Vue Mer Gammarth', location: 'Gammarth', price: 280, rating: 4.6, isFavorite: false, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'], beds: 2, baths: 1, guests: 4, status: 'DISPONIBLE', description: "Sea view apartment in Gammarth.", owner: { name: 'Sara OConnor', rating: '4.9', yearsOnPlatform: 7, totalProperties: 12, responseRate: '95%' }, reviews: [] },
  { id: 4, type: 'Villa', title: 'Villa Côtière avec Piscine', location: 'Hammamet', price: 550, rating: 4.8, isFavorite: false, images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80'], beds: 4, baths: 3, guests: 8, status: 'POPULAIRE', description: "Beautiful coastal villa with a large private pool.", owner: { name: 'Lina Ben', rating: '4.8', yearsOnPlatform: 4, totalProperties: 2, responseRate: '100%' }, reviews: [] },
  { id: 5, type: 'Maison', title: 'Maison Traditionnelle Sidi Bou', location: 'Sidi Bou Said', price: 720, rating: 5.0, isFavorite: false, images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80'], beds: 5, baths: 4, guests: 10, status: 'POPULAIRE', description: "Authentic traditional house in Sidi Bou Said.", owner: { name: 'Mehdi Trabelsi', rating: '5.0', yearsOnPlatform: 10, totalProperties: 5, responseRate: '99%' }, reviews: [] },
  { id: 6, type: 'Appartement', title: 'Appartement Centre Ville', location: 'Tunis', price: 200, rating: 4.4, isFavorite: false, images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'], beds: 2, baths: 1, guests: 4, status: 'DISPONIBLE', description: "Downtown apartment close to all amenities.", owner: { name: 'Amine J', rating: '4.5', yearsOnPlatform: 1, totalProperties: 1, responseRate: '90%' }, reviews: [] },
  { id: 7, type: 'Villa', title: 'Villa Luxueuse Bord de Mer', location: 'Bizerte', price: 650, rating: 4.9, isFavorite: false, images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'], beds: 5, baths: 4, guests: 10, status: 'POPULAIRE', description: "Luxury seaside villa perfect for large groups.", owner: { name: 'Sami K', rating: '4.9', yearsOnPlatform: 6, totalProperties: 3, responseRate: '100%' }, reviews: [] },
  { id: 8, type: 'Maison d\'hôtes', title: 'Maison d\'Hôtes Authentique', location: 'Nabeul', price: 380, rating: 4.7, isFavorite: false, images: ['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=80'], beds: 3, baths: 2, guests: 6, status: 'DISPONIBLE', description: "Authentic guest house in the heart of Nabeul.", owner: { name: 'Yasmine S', rating: '4.8', yearsOnPlatform: 2, totalProperties: 2, responseRate: '96%' }, reviews: [] },
  { id: 9, type: 'Appartement', title: 'Appartement Moderne avec Vue', location: 'La Marsa', price: 350, rating: 4.5, isFavorite: false, images: ['https://images.unsplash.com/photo-1502672260266-1c1e525044c7?w=600&q=80'], beds: 2, baths: 2, guests: 5, status: 'DISPONIBLE', description: "Modern apartment with a great view in La Marsa.", owner: { name: 'Omar B', rating: '4.6', yearsOnPlatform: 4, totalProperties: 4, responseRate: '98%' }, reviews: [] }
];

const PropertyDetailsPage = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const { id } = useParams();
  console.log("PropertyDetailsPage loaded - ID:", id);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });

  useEffect(() => {
    console.log("Fetching property with ID:", id);
    setLoading(true);
    setTimeout(() => {
      // Find property carefully verifying string/number matching
      const foundProperty = MOCK_PROPERTIES.find(p => String(p.id) === String(id));
      console.log("Found Property Data:", foundProperty);
      
      setProperty(foundProperty);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="property-details-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <h2>Loading property details...</h2>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-details-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <h2>Property not found</h2>
      </div>
    );
  }

  // Ensure minimum 5 images for the Gallery layout
  const propertyImages = property.images && property.images.length >= 5 
    ? property.images 
    : [
        property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80'
      ];

  const similarProperties = MOCK_PROPERTIES
    .filter(p => String(p.id) !== String(property.id))
    .slice(0, 6); // Show 6 similar properties.

  return (
    <div className="property-details-page">
      <div className="property-container">
        
        {/* Top: Gallery Section */}
        <section className="property-details-top">
          <GallerySection images={propertyImages} />
        </section>

        {/* Middle: 2-Column Grid */}
        <div className="property-layout">
          
          {/* Left Column */}
          <div className="left-column">
            <PropertyInfo 
              title={property.title}
              location={property.location}
              rating={`${property.rating} (${property.reviews?.length || 15} reviews)`}
              guests={property.guests}
              bedrooms={property.beds}
              bathrooms={property.baths}
              description={property.description || "Beautiful property available for booking."}
            />
            <div className="page-divider" />
            
            <HostInfo 
              name={property.owner?.name || "Host Name"}
              rating={property.owner?.rating || "5.0"}
              yearsOnPlatform={property.owner?.yearsOnPlatform || 1}
              totalProperties={property.owner?.totalProperties || 1}
              responseRate={property.owner?.responseRate || "100%"}
            />
            <div className="page-divider" />

            <BookingCalendar 
              selectedDates={selectedDates}
              onDateChange={setSelectedDates}
              unavailableDates={property.unavailableDates || []}
            />
            <div className="page-divider" />

            <ReviewsSection reviews={property.reviews?.length ? property.reviews : undefined} />
          </div>

          {/* Right Column (Sticky) */}
          <div className="right-column">
            <div className="sticky-sidebar-wrapper">
              <BookingCard 
                pricePerNight={property.price}
                selectedDates={selectedDates}
                onDateChange={setSelectedDates}
              />
            </div>
          </div>

        </div>

        {/* Bottom: Similar Properties */}
        <section className="property-details-bottom">
          <div className="page-divider" />
          <SimilarProperties similarProperties={similarProperties} />
        </section>

      </div>
    </div>
  );
};

export default PropertyDetailsPage;