import { useState } from 'react';
import { Navbar as BsNavbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import './Navbar.css';
import logo from '../../assets/images/logo.png';

export default function Navbar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <BsNavbar bg="white" expand="lg" className="rengo-navbar shadow-sm" sticky="top">
      <Container fluid="xl">

        {/* ── Logo ── */}
        <BsNavbar.Brand href="/" className="rengo-logo me-auto me-lg-0">
          <img src={logo} alt="Ren&Go" className="logo-img navbar-logo-img" />
        </BsNavbar.Brand>

        {/* ── Auth buttons — always visible on the right ── */}
        <div className="rengo-auth-buttons d-flex align-items-center gap-2 order-lg-3">
          <Button variant="outline-dark" className="btn-connexion" href="/login">
            Connexion
          </Button>
          <Button className="btn-inscrire" href="/register">
            S'inscrire
          </Button>
        </div>

        {/* ── Hamburger — only toggles nav links, NOT auth buttons ── */}
        <button
          className="rengo-hamburger d-lg-none ms-2"
          onClick={handleShow}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* ── Desktop nav links — centered ── */}
        <div className="desktop-nav d-none d-lg-flex justify-content-center flex-grow-1 order-lg-2">
          <Nav className="gap-4">
            <Nav.Link href="/" className="rengo-nav-link">Accueil</Nav.Link>
            <Nav.Link href="/devenir-proprietaire" className="rengo-nav-link">Devenir Propriétaire</Nav.Link>
            <Nav.Link href="/contact" className="rengo-nav-link">Contact</Nav.Link>
          </Nav>
        </div>

        {/* ── Mobile Offcanvas — nav links only ── */}
        <Offcanvas show={show} onHide={handleClose} placement="end" className="rengo-offcanvas">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <img src={logo} alt="Ren&Go" className="logo-img navbar-logo-img" />
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column align-items-center justify-content-center gap-4">
            <Nav.Link href="/" className="rengo-nav-link mobile-link" onClick={handleClose}>
              Accueil
            </Nav.Link>
            <Nav.Link href="/devenir-proprietaire" className="rengo-nav-link mobile-link" onClick={handleClose}>
              Devenir Propriétaire
            </Nav.Link>
            <Nav.Link href="/contact" className="rengo-nav-link mobile-link" onClick={handleClose}>
              Contact
            </Nav.Link>
          </Offcanvas.Body>
        </Offcanvas>

      </Container>
    </BsNavbar>
  );
}
