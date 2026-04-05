import { Container } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container className="text-center">
        <p className="mb-0">
          © {new Date().getFullYear()} Ren&Go. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
