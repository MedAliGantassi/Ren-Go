import { useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion, useInView } from 'framer-motion';
import './TestimonialsSection.css';

const MOCK_TESTIMONIALS = [
  {
    id: 1,
    rating: 5,
    text: "Une expérience incroyable avec Ren&Go. La villa à Sidi Bou Saïd était exactement comme sur les photos. Le service client a été exceptionnel du début à la fin.",
    name: 'Sarah Mansour',
    role: 'Client vérifié · Tunis',
    initials: 'SM',
    color: '#075545',
  },
  {
    id: 2,
    rating: 5,
    text: "Plateforme très professionnelle avec un excellent choix de propriétés. La réservation était simple et rapide. Je recommande vivement Ren&Go !",
    name: 'Karim Hadded',
    role: 'Client vérifié · Sousse',
    initials: 'KH',
    color: '#FF5300',
  },
];

function Stars({ count = 5 }) {
  return (
    <div className="testimonial-stars">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="star">★</span>
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonials = MOCK_TESTIMONIALS }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="testimonials-section" ref={ref}>
      <Container>

        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <span className="testimonials-eyebrow">TÉMOIGNAGES</span>
          <h2 className="testimonials-title">Ce que disent nos clients</h2>
        </motion.div>

        <Row className="g-4 justify-content-center">
          {testimonials.map((t, i) => (
            <Col key={t.id} md={6} lg={5}>
              <motion.div
                className="testimonial-card"
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(0,0,0,0.1)' }}
              >
                <span className="testimonial-quote">&ldquo;</span>
                <Stars count={t.rating} />
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div
                    className="testimonial-avatar"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

      </Container>
    </section>
  );
}
