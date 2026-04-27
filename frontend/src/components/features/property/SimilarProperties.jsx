import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCardSecondary from '@/components/Propertyseconday/propertysecondary';
import './SimilarProperties.css';

const SimilarProperties = ({ similarProperties = [] }) => {
  const navigate = useNavigate();

  const normalizedProperties = similarProperties.map((property) => ({
    ...property,
    id: property.id,
    title: property.title || '',
    location: property.location || '',
    image: property.image || property.images?.[0] || '',
    price: property.price ?? 0,
    rating: property.rating ?? 0,
  }));

  return (
    <section className="similar-properties">
      <h2 
        className="similar-title"
        onClick={() => navigate('/properties')}
      >
        Propriétés similaires <span className="arrow">→</span>
      </h2>
      <div className="similar-grid">
        {normalizedProperties.map((property) => (
          <PropertyCardSecondary 
            key={property.id}
            property={property}
            isAuthenticated={true}
            userRole="client"
          />
        ))}
      </div>
    </section>
  );
};

export default SimilarProperties;
