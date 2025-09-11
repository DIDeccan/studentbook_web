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
    <Container className="py-5">
      <h2 className="mb-5 text-center fw-bold text-primary">
        🌟 Explore Our Categories
      </h2>
      <Row className="justify-content-center">
        {cardData.map((card, index) => (
          <Col sm="12" md="6" lg="4" xl="3" className="mb-4 d-flex" key={index}>
            <Link
              to={`/${card.id}`}
              style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
            >
              <Card
                className="h-100 shadow-lg border-0"
                style={{
                  borderRadius: '15px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
                }}
              >
                <CardImg
                  top
                  src={card.img}
                  alt={card.title}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px'
                  }}
                />
                <CardBody className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <CardTitle tag="h5" className="fw-bold text-dark">
                      {card.title}
                    </CardTitle>
                    <Badge color={card.tagColor} pill>
                      {card.tag}
                    </Badge>
                  </div>
                  <CardText className="text-muted mb-3">
                    {card.desc}
                  </CardText>
                  <div className="mt-auto text-end">
                    <span className="text-primary fw-semibold">
                      ➜ Learn More
                    </span>
                  </div>
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
