import React from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText
} from 'reactstrap'
import { Users, BookOpen, Clock, Award } from 'react-feather'

const features = [
  {
    icon: <Users size={32} color="#0d6efd" />,
    title: 'Trusted by Students',
    desc: 'Thousands of students trust our platform to level up their education.'
  },
  {
    icon: <BookOpen size={32} color="#0d6efd" />,
    title: 'Expert Instructors',
    desc: 'Learn from experienced educators and industry professionals.'
  },
  {
    icon: <Clock size={32} color="#0d6efd" />,
    title: 'Flexible Learning',
    desc: 'Access courses anytime, anywhere at your own pace.'
  },
  {
    icon: <Award size={32} color="#0d6efd" />,
    title: 'Certification',
    desc: 'Receive recognized certificates upon course completion.'
  }
]

const WhyChooseUs = () => {
  return (
    <Container fluid className="py-5 bg-light text-center">
      <h2 className="fw-bold mb-5">Why Choose Us?</h2>
      <Row className="justify-content-center g-4 px-4">
        {features.map((item, index) => (
          <Col key={index} lg="3" md="6" sm="12">
            <Card className="border-0 shadow-sm h-100">
              <CardBody className="p-4">
                <div className="mb-3">{item.icon}</div>
                <CardTitle tag="h5" className="fw-semibold">
                  {item.title}
                </CardTitle>
                <CardText className="text-muted small mb-0">{item.desc}</CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default WhyChooseUs
