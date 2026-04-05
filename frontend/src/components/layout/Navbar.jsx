import { Link, NavLink } from 'react-router-dom';
import { Container, Nav, Navbar as BsNavbar } from 'react-bootstrap';
import './Navbar.css';

const Navbar = () => {
  return (
    <BsNavbar bg="white" expand="lg" className="navbar-custom shadow-sm">
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="fw-bold">
          Ren&Go
        </BsNavbar.Brand>
        
        <BsNavbar.Toggle aria-controls="main-navbar" />
        
        <BsNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            {/* Add more nav links here */}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
