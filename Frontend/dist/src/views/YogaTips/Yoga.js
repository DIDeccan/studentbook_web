import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardText,
  Button, Badge, Progress, Input
} from "reactstrap";
import { Star, Clock } from "react-feather";

const Yoga = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setVideos([
        { id: 1, title: "Morning Yoga Flow", category: "Beginner", rating: 4.8, reviews: 120, description: "Start your day with this 15-minute energizing yoga sequence.", duration: "15 min", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 2, title: "Yoga for Flexibility", category: "Intermediate", rating: 4.7, reviews: 95, description: "Improve your flexibility with this gentle stretching routine.", duration: "20 min", progress: 50, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 3, title: "Stress Relief Yoga", category: "Wellness", rating: 4.9, reviews: 210, description: "Calming poses to release tension and relax your mind.", duration: "25 min", progress: 70, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 4, title: "Power Yoga Workout", category: "Advanced", rating: 4.6, reviews: 88, description: "Build strength and stamina with this high-energy yoga class.", duration: "30 min", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 5, title: "Bedtime Yoga", category: "Relaxation", rating: 4.8, reviews: 150, description: "Wind down before sleep with these gentle, soothing poses.", duration: "10 min", progress: 30, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 6, title: "Yoga for Back Pain", category: "Therapy", rating: 4.9, reviews: 175, description: "Poses designed to strengthen your back and improve posture.", duration: "18 min", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 7, title: "Sun Salutation Mastery", category: "Technique", rating: 4.7, reviews: 60, description: "Perfect your Surya Namaskar with step-by-step guidance.", duration: "15 min", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 8, title: "Chair Yoga", category: "Accessible", rating: 4.8, reviews: 80, description: "Gentle seated yoga for seniors or office breaks.", duration: "12 min", progress: 10, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" }
      ]);
    }, 500);
  }, []);

  return (
    <Container className="my-5">
      <div className="p-4 rounded shadow-sm" style={{ backgroundColor: "#fff" }}>
        
        <Row className="align-items-center mb-4">
          <Col md="6">
            <h4 className="fw-bold">Yoga Classes</h4>
            <p className="text-muted mb-0">
              Total {videos.length} yoga sessions available
            </p>
          </Col>
          <Col md="6" className="d-flex justify-content-end align-items-center">
            <Input type="select" className="me-3" style={{ width: "180px" }}>
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Wellness</option>
              <option>Therapy</option>
            </Input>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="hideCompleted" />
              <label className="form-check-label ms-2" htmlFor="hideCompleted">
                Hide completed
              </label>
            </div>
          </Col>
        </Row>

        <Row>
          {videos.map((video) => (
            <Col md="4" sm="6" xs="12" className="mb-4 d-flex" key={video.id}>
              <Card className="h-100 shadow-sm border-0">
                <video width="100%" height="180" controls>
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
                <CardBody>
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

                  <div className="d-flex align-items-center mb-2">
                    <Clock size={16} className="me-1" />
                    <small className="text-muted">{video.duration}</small>
                  </div>
                  <Progress value={video.progress} color="primary" className="mb-3" />

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

export default Yoga;
