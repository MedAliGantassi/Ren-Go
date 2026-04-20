import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Footer.css';
import logo from '../../assets/images/logo.png';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: connect to newsletter service
    console.log('Subscribe:', email);
  };

  return (
    <footer className="rengo-footer">

      {/* ── Main footer content ── */}
      <Container fluid="xl">
        <Row className="footer-main py-5 gy-4">

          {/* Column 1 — Brand */}
          <Col xs={12} md={4} lg={3}>
            <div className="footer-brand mb-3">
              <img src={logo} alt="Ren&Go" className="logo-img footer-logo-img" />
            </div>
            <p className="footer-tagline">
              La première plateforme de location de maisons en
              Tunisie. Trouvez votre maison idéale aujourd'hui.
            </p>
          </Col>

          {/* Column 2 — Liens utiles */}
          <Col xs={6} md={2} lg={2} className="offset-lg-1">
            <h6 className="footer-heading">Liens utiles</h6>
            <ul className="footer-links">
              <li><a href="/about">À propos</a></li>
              <li><a href="/how-it-works">Comment ça marche</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </Col>

          {/* Column 3 — Pour les fournisseurs */}
          <Col xs={6} md={3} lg={3}>
            <h6 className="footer-heading">Pour les fournisseurs</h6>
            <ul className="footer-links">
              <li><a href="/devenir-proprietaire">Devenir fournisseur</a></li>
              <li><a href="/aide">Centre d'aide</a></li>
              <li><a href="/tarifs">Tarifs</a></li>
            </ul>
          </Col>

          {/* Column 4 — Newsletter */}
          <Col xs={12} md={5} lg={3}>
            <h6 className="footer-heading">Restez informé</h6>
            <p className="footer-tagline mb-3">
              Recevez nos dernières offres et actualités
            </p>
            <Form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-wrapper">
                <Form.Control
                  type="email"
                  placeholder="Votre email"
                  className="newsletter-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="newsletter-btn">
                  S'abonner
                </Button>
              </div>
            </Form>
          </Col>

        </Row>
      </Container>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <Container fluid="xl">
          <div className="footer-bottom-inner">
            <span className="footer-copy">
              © 2026 Ren&amp;Go. Tous droits réservés.
            </span>
            <div className="footer-legal-links">
              <a href="/conditions">Conditions d'utilisation</a>
              <a href="/confidentialite">Confidentialité</a>
              <a href="/cookies">Cookies</a>
            </div>
          </div>
        </Container>
      </div>

    </footer>
  );
}
