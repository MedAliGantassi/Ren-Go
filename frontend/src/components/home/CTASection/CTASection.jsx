import { useRef } from 'react';
import { Container } from 'react-bootstrap';
import { motion, useInView } from 'framer-motion';
import './CTASection.css';

export default function CTASection({
  title = "Vous êtes propriétaire ?",
  subtitle = "Rejoignez notre réseau de fournisseurs et commencez à louer votre propriété dès aujourd'hui. Nous gérons tout pour vous.",
  btnLabel = "Devenir propriétaire",
  btnHref = "/devenir-proprietaire",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="cta-section" ref={ref}>
      <Container>
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="cta-content">
            <h2 className="cta-title">{title}</h2>
            <p className="cta-subtitle">{subtitle}</p>
          </div>
          <motion.a
            href={btnHref}
            className="cta-btn"
            whileHover={{ scale: 1.04, boxShadow: '0 6px 24px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.97 }}
          >
            {btnLabel} &rsaquo;
          </motion.a>
        </motion.div>
      </Container>
    </section>
  );
}
