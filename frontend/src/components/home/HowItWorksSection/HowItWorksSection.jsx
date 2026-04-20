import { useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion, useInView } from 'framer-motion';
import './HowItWorksSection.css';

const STEPS = [
  {
    number: 1,
    title: 'Recherchez',
    desc: 'Parcourez nos propriétés et trouvez celle qui correspond à vos besoins et préférences.',
  },
  {
    number: 2,
    title: 'Réservez',
    desc: 'Choisissez vos dates, complétez votre réservation en ligne de manière sécurisée.',
  },
  {
    number: 3,
    title: 'Profitez',
    desc: 'Détendez-vous et profitez de votre séjour dans votre maison de rêve en Tunisie.',
  },
];

export default function HowItWorksSection({ steps = STEPS }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="how-section" ref={ref}>
      <Container>

        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <span className="how-eyebrow">PROCESSUS</span>
          <h2 className="how-title">Comment ça marche ?</h2>
        </motion.div>

        <Row className="g-4 justify-content-center">
          {steps.map((step, i) => (
            <Col key={step.number} md={4}>
              <motion.div
                className="how-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                whileHover={{ y: -4, boxShadow: '0 10px 32px rgba(0,0,0,0.15)' }}
              >
                <motion.div
                  className="how-number"
                  whileHover={{ scale: 1.08 }}
                >
                  {step.number}
                </motion.div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.desc}</p>
              </motion.div>
            </Col>
          ))}
        </Row>

      </Container>
    </section>
  );
}
