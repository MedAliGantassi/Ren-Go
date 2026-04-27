import { useState, useContext } from 'react';
import { Navbar as BsNavbar, Nav, Container, Button, Offcanvas, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth/AuthContext';
import './Navbar.css';
import logo from '../../assets/images/logo.png';

export default function Navbar() {
  const [show, setShow] = useState(false);
  const { user, isAuthenticated, logout, switchRole, openAuthModal } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRoleSwitch = async () => {
    const isClient = user?.currentRole === 'CLIENT';
    const targetRole = isClient ? 'PROPRIETAIRE' : 'CLIENT';
    const success = await switchRole(targetRole);
    if (success) {
      if (targetRole === 'CLIENT') {
        navigate('/dashboard-client');
      } else {
        navigate('/dashboard-proprietaire');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BsNavbar bg="white" expand="lg" className="rengo-navbar shadow-sm" sticky="top">
      <Container fluid="xl">

        {/* ── Logo ── */}
        <BsNavbar.Brand as={Link} to="/" className="rengo-logo me-auto me-lg-0">
          <img src={logo} alt="Ren&Go" className="logo-img navbar-logo-img" />
        </BsNavbar.Brand>

        {/* ── Auth buttons / User Profile ── */}
        <div className="rengo-auth-buttons d-flex align-items-center gap-2 order-lg-3">
          {!isAuthenticated ? (
            <>
              <Button variant="outline-dark" className="btn-connexion" onClick={() => openAuthModal('connexion')}>
                Connexion
              </Button>
              <Button className="btn-inscrire" onClick={() => openAuthModal('inscription')}>
                S'inscrire
              </Button>
            </>
          ) : (
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center gap-2">
                <div style={{width: 32, height: 32, borderRadius: '50%', background: '#FF5A00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                {user?.name}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={user?.currentRole === 'CLIENT' ? '/dashboard-client' : '/dashboard-proprietaire'}>
                  Mon Dashboard
                </Dropdown.Item>
                <Dropdown.Item onClick={handleRoleSwitch}>
                  Switch to {user?.currentRole === 'CLIENT' ? 'Propriétaire' : 'Client'}
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  Déconnexion
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
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
            <Nav.Link as={Link} to="/" className="rengo-nav-link">Accueil</Nav.Link>
            <Nav.Link as={Link} to="/properties" className="rengo-nav-link">Propriétaire</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="rengo-nav-link">Contact</Nav.Link>
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
            <Nav.Link as={Link} to="/" className="rengo-nav-link mobile-link" onClick={handleClose}>
              Accueil
            </Nav.Link>
            <Nav.Link as={Link} to="/properties" className="rengo-nav-link mobile-link" onClick={handleClose}>
              Propriétaire
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="rengo-nav-link mobile-link" onClick={handleClose}>
              Contact
            </Nav.Link>
          </Offcanvas.Body>
        </Offcanvas>

      </Container>
    </BsNavbar>
  );
}
