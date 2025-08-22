import React from 'react';
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';

const cardData = [
  {
    id: "mysubjects",
    title: "My Subjects",
    tag: "Class 6",
    tagColor: "primary",
    desc: "Explore all subjects including Maths, Science, and English designed for Class 6 students.",
    img: "https://img.freepik.com/free-photo/high-angle-letters-spelling-education_23-2148756611.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    id: "yogatips",
    title: "Yoga Tips",
    tag: "Wellness",
    tagColor: "success",
    desc: "Learn beginner-friendly yoga postures to stay active and improve flexibility and focus.",
    img: "https://images.squarespace-cdn.com/content/v1/5f452eb9193e515746f7ee8c/1602422851628-GQAD8EPWMCP0FNBK6G95/160315-childyogaclass-stock.jpg"
  },
  {
    id: "sports",
    title: "Sports",
    tag: "Activity",
    tagColor: "warning",
    desc: "Get the latest updates and training tips for various indoor and outdoor sports.",
    img: "https://cdn.cdnparenting.com/articles/2018/03/72136312-H.jpg"
  },
  {
    id: "health",
    title: "Healthy Living",
    tag: "Health",
    tagColor: "danger",
    desc: "Tips on nutrition, hygiene, and staying physically and mentally healthy for students.",
    img: "https://d3mw6k1m1fi1qr.cloudfront.net/5b6b7fe66decdFkm26-_S2yAjRrTfkxwYq-Y9eZTTG9DWDaKx1_600.jpg"
  },
  {
    id: "music",
    title: "Music",
    tag: "Music",
    tagColor: "info",
    desc: "Discover the world of rhythm, melody, and instruments in a fun and engaging way.",
    img: "https://t3.ftcdn.net/jpg/05/01/12/94/360_F_501129482_14dkvP2JdU9iQs2f8lXScvzLDwmWCA0p.jpg"
  }
];

const CategoryCards = () => {
  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Categories</h2>
      <Row>
        {cardData.map((card, index) => (
          <Col sm="12" md="6" lg="3" className="mb-4" key={index}>
            <Link to={`/${card.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card 
                className="h-100 shadow-sm hover-shadow"   
                style={{
                  maxWidth: '280px', 
                  width: '100%' 
                }}
              >
                <CardImg 
                  top 
                  width="100%" 
                  src={card.img} 
                  alt={card.title} 
                  style={{ height: '180px', objectFit: 'cover' }} 
                />
                <CardBody>
                  <CardTitle tag="h5">{card.title}</CardTitle>
                  <Badge color={card.tagColor} className="mb-2">{card.tag}</Badge>
                  <CardText>{card.desc}</CardText>
                </CardBody>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoryCards;
