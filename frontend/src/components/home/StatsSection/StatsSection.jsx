import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './StatsSection.css';

const STATS = [
  { value: '500+',  label: 'Propriétés disponibles', color: '#075545' },
  { value: '1500+', label: 'Clients satisfaits',      color: '#FF5300' },
  { value: '98%',   label: 'Taux de satisfaction',    color: '#075545' },
  { value: '24/7',  label: 'Support client',           color: '#FF5300' },
];

function StatItem({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <Col xs={6} md={3}>
      <motion.div
        ref={ref}
        className="stat-item"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
        <span className="stat-label">{stat.label}</span>
      </motion.div>
    </Col>
  );
}

export default function StatsSection({ stats = STATS }) {
  return (
    <section className="stats-section">
      <Container>
        <Row className="justify-content-center g-4">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
        </Row>
      </Container>
    </section>
  );
}
