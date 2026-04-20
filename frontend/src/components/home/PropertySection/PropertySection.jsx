import { useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import PropertyCard from '../../common/PropertyCard/PropertyCard';
import './PropertySection.css';

const TABS = ['Toutes', 'Maisons', "Maisons d'hôtes", 'Villas'];

const MOCK_PROPERTIES = [
  {
    id: 1, title: 'Villa Méditerranéenne Luxueuse', location: 'Sidi Bou Saïd',
    rating: 4.9, price: 350, beds: 4, baths: 3, guests: 8,
    status: 'DISPONIBLE', type: 'Villas',
    images: ['https://images.unsplash.com/photo-1580237072617-9f786aeb8e6f?w=600&q=80'],
  },
  {
    id: 2, title: 'Maison Moderne avec Piscine', location: 'Hammamet',
    rating: 4.8, price: 280, beds: 3, baths: 2, guests: 6,
    status: 'DISPONIBLE', type: 'Maisons',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'],
  },
  {
    id: 3, title: 'Villa Côtière de Luxe', location: 'Sousse',
    rating: 4.7, price: 420, beds: 5, baths: 4, guests: 10,
    status: 'POPULAIRE', type: 'Villas',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'],
  },
  {
    id: 4, title: "Maison d'Hôtes Traditionnelle", location: 'Tunis',
    rating: 4.6, price: 180, beds: 4, baths: 2, guests: 7,
    status: 'NOUVEAU', type: "Maisons d'hôtes",
    images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80'],
  },
  {
    id: 5, title: 'Villa Vue Mer', location: 'Djerba',
    rating: 4.8, price: 320, beds: 4, baths: 3, guests: 7,
    status: 'POPULAIRE', type: 'Villas',
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80'],
  },
  {
    id: 6, title: 'Guesthouse Moderne', location: 'Nabeul',
    rating: 4.5, price: 220, beds: 3, baths: 2, guests: 5,
    status: 'DISPONIBLE', type: "Maisons d'hôtes",
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80'],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function PropertySection({
  properties = MOCK_PROPERTIES,
  onViewDetails,
}) {
  const [activeTab, setActiveTab] = useState('Toutes');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const filtered = activeTab === 'Toutes'
    ? properties
    : properties.filter(p => p.type === activeTab);

  return (
    <section className="property-section" ref={ref}>
      <Container>

        {/* Header */}
        <motion.div
          className="property-header"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <div>
            <span className="property-eyebrow">NOS PROPRIÉTÉS</span>
            <h2 className="property-title">Dernières maisons<br />disponibles</h2>
          </div>
          <a href="/search" className="property-see-all">Voir tout ›</a>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="property-tabs"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {TABS.map(tab => (
            <button
              key={tab}
              className={`property-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Cards grid */}
        <Row className="g-4">
          {filtered.map((property, i) => (
            <Col key={property.id} xs={12} sm={6} lg={4}>
              <motion.div
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                <PropertyCard
                  property={property}
                  onViewDetails={onViewDetails}
                />
              </motion.div>
            </Col>
          ))}
        </Row>

      </Container>
    </section>
  );
}
