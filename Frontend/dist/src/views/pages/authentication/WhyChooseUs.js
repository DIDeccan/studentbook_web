import React from 'react'
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap'
import { Users, BookOpen, Clock, Award } from 'react-feather'

const features = [
  {
    icon: <Users size={36} />,
    title: 'Trusted by Students',
    desc: 'Thousands of students trust our platform to level up their education.'
  },
  {
    icon: <BookOpen size={36} />,
    title: 'Expert Instructors',
    desc: 'Learn from experienced educators and industry professionals.'
  },
  {
    icon: <Clock size={36} />,
    title: 'Flexible Learning',
    desc: 'Access courses anytime, anywhere at your own pace.'
  },
  {
    icon: <Award size={36} />,
    title: 'Certification',
    desc: 'Receive recognized certificates upon course completion.'
  }
]

const WhyChooseUs = () => {
  return (
    <Container fluid className="py-5">
      <h2
        className="fw-bold text-white text-center mb-5"
         style={{
              background: "linear-gradient(90deg, #7db2ddff, #e52e71)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: '3rem', 
              letterSpacing: '2px'
            }}
      >
        Why Choose Us?
      </h2>
      <Row className="justify-content-center g-4 px-4">
        {features.map((item, index) => (
          <Col key={index} lg="3" md="6" sm="12">
            <Card
              className="border-0 h-100 text-center"
              style={{
                borderRadius: '20px',
                padding: '2rem 1rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                background: '#fff',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)'
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  margin: '0 auto 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: '#fff',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  transition: 'transform 0.3s'
                }}
              >
                {item.icon}
              </div>
              <CardBody className="p-0">
                <CardTitle
                  tag="h5"
                  className="fw-bold"
                  style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}
                >
                  {item.title}
                </CardTitle>
                <CardText className="text-muted small mb-0" style={{ lineHeight: '1.5' }}>
                  {item.desc}
                </CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default WhyChooseUs
