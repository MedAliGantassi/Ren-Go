import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './AboutSection.css';

const FEATURES = [
  {
    title: 'Maisons uniques',
    desc: 'Des propriétés soigneusement sélectionnées dans toute la Tunisie',
  },
  {
    title: 'Paiement sécurisé',
    desc: 'Transactions 100% sécurisées et protégées',
  },
  {
    title: 'Support 24/7',
    desc: 'Une équipe disponible pour vous à tout moment',
  },
];

const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1580237072617-9f786aeb8e6f?w=500&q=80', label: 'Tunis' },
  { src: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=500&q=80', label: 'Tunis' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80', label: 'Hammamet' },
  { src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80', label: 'Hammamet' },
];

export default function AboutSection({ features = FEATURES, images = GALLERY_IMAGES }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="about-section" ref={ref}>
      <Container>
        <Row className="align-items-center g-5">

          {/* Left column */}
          <Col lg={5}>
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="about-eyebrow">À PROPOS DE REN&amp;GO</span>
              <h2 className="about-title">
                Trouvez votre maison<br />
                <span className="about-title-green">Parfaite aujourd'hui</span>
              </h2>
              <p className="about-desc">
                Ren&amp;Go est la première plateforme tunisienne dédiée à la location de maisons
                et villas de luxe. Nous connectons les voyageurs avec des propriétés
                exceptionnelles à travers tout le pays.
              </p>

              <ul className="about-features">
                {features.map((f, i) => (
                  <motion.li
                    key={f.title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  >
                    <span className="about-dot" />
                    <div>
                      <strong>{f.title}</strong>
                      <p>{f.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <motion.a
                href="/about"
                className="about-btn"
                whileHover={{ scale: 1.03, boxShadow: '0 6px 24px rgba(7,85,69,0.3)' }}
                whileTap={{ scale: 0.97 }}
              >
                En savoir plus &nbsp;›
              </motion.a>
            </motion.div>
          </Col>

          {/* Right column — image grid */}
          <Col lg={7}>
            <motion.div
              className="about-grid"
              initial={{ opacity: 0, x: 32 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {images.map((img, i) => (
                <div key={i} className="about-img-wrap">
                  <img src={img.src} alt={img.label} className="about-img" />
                  <span className="about-img-label">{img.label}</span>
                </div>
              ))}
            </motion.div>
          </Col>

        </Row>
      </Container>
    </section>
  );
}
