import { Container, Row, Col, Button } from 'react-bootstrap';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h1 className="display-4 fw-bold mb-4">
              Welcome to Ren&Go
            </h1>
            <p className="lead text-muted mb-4">
              Your PFE project is ready to build!
            </p>
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
