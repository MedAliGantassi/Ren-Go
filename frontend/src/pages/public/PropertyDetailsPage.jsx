import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';

const fallbackProperty = {
  title: 'Property Details',
  location: 'Tunisia',
  price: 0,
  beds: 0,
  baths: 0,
  guests: 0,
  rating: 0,
  status: 'DISPONIBLE',
  images: ['https://placehold.co/1200x700?text=Property+Image'],
};

const PropertyDetailsPage = () => {
  const { propertyId } = useParams();
  const location = useLocation();
  const property = location.state?.property ?? fallbackProperty;

  return (
    <Container className="py-4 py-md-5">
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Img src={property.images?.[0]} alt={property.title} />
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                <h2 className="h4 mb-0">{property.title}</h2>
                <Badge bg="success">{property.status}</Badge>
              </div>
              <p className="text-muted mb-3">{property.location}</p>
              <p className="mb-2">Reference: #{propertyId}</p>
              <p className="mb-0">Rating: {property.rating}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h3 className="h5 mb-3">Key information</h3>
              <p className="mb-2">Price: {property.price} DT / night</p>
              <p className="mb-2">Beds: {property.beds}</p>
              <p className="mb-2">Baths: {property.baths}</p>
              <p className="mb-0">Guests: {property.guests}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PropertyDetailsPage;