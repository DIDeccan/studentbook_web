import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardText,
  Button, Badge, Progress, Input
} from "reactstrap";
import { Star, Clock } from "react-feather";

const HealthCards = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setVideos([
        { id: 1, title: "Morning Yoga Routine", category: "Yoga", rating: 4.9, reviews: 210, description: "Start your day with energy and flexibility.", duration: "15 min", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 2, title: "Healthy Breakfast Ideas", category: "Nutrition", rating: 4.7, reviews: 180, description: "Quick and tasty breakfast recipes.", duration: "10 min", progress: 40, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 3, title: "Meditation for Focus", category: "Mental Health", rating: 4.8, reviews: 150, description: "Enhance focus and reduce stress.", duration: "12 min", progress: 70, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 4, title: "Healthy Snack Options", category: "Nutrition", rating: 4.6, reviews: 95, description: "Nutritious and easy-to-make snacks.", duration: "8 min", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 5, title: "Desk Stretches", category: "Exercise", rating: 4.9, reviews: 130, description: "Relieve tension during work hours.", duration: "6 min", progress: 25, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 6, title: "Hydration Tips", category: "Wellness", rating: 4.7, reviews: 100, description: "Stay hydrated for better health.", duration: "5 min", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
      ]);
    }, 500);
  }, []);

  return (
    <Container className="my-5">
      <div className="p-4 rounded shadow-sm" style={{ backgroundColor: "#fff" }}>
        
        {/* Header */}
        <Row className="align-items-center mb-4">
          <Col md="6">
            <h4 className="fw-bold">Healthy Living</h4>
            <p className="text-muted mb-0">
              Total {videos.length} wellness and health videos available
            </p>
          </Col>
          <Col md="6" className="d-flex justify-content-end align-items-center">
            <Input type="select" className="me-3" style={{ width: "200px" }}>
              <option>All Topics</option>
              <option>Yoga</option>
              <option>Nutrition</option>
              <option>Mental Health</option>
              <option>Exercise</option>
              <option>Wellness</option>
            </Input>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="hideCompleted" />
              <label className="form-check-label ms-2" htmlFor="hideCompleted">
                Hide completed
              </label>
            </div>
          </Col>
        </Row>

        {/* Cards */}
        <Row>
          {videos.map((video) => (
            <Col md="4" sm="6" xs="12" className="mb-4 d-flex" key={video.id}>
              <Card className="h-100 shadow-sm border-0 d-flex flex-column">
                <video width="100%" height="180" controls>
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
                <CardBody className="d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge color="success">{video.category}</Badge>
                    <div className="d-flex align-items-center">
                      <span className="me-1">{video.rating}</span>
                      <Star size={16} color="orange" />
                      <small className="text-muted ms-1">({video.reviews})</small>
                    </div>
                  </div>

                  <CardTitle tag="h5" className="fw-bold">{video.title}</CardTitle>
                  <CardText className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {video.description}
                  </CardText>

                  <div className="d-flex align-items-center mb-2 mt-auto">
                    <Clock size={16} className="me-1" />
                    <small className="text-muted">{video.duration}</small>
                  </div>
                  <Progress value={video.progress} color="success" className="mb-3" />

                  <div className="d-flex justify-content-between">
                    <Button outline color="secondary" size="sm">
                      Start Over
                    </Button>
                    <Button color="primary" size="sm">
                      {video.progress > 0 ? "Continue" : "Start Now"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default HealthCards;
