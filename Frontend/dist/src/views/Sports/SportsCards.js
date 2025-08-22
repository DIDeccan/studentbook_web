import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardText,
  Button, Badge, Progress, Input
} from "reactstrap";
import { Star, Clock } from "react-feather";

const SportsCards = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setVideos([
        { id: 1, title: "Football Skills Training", category: "Football", rating: 4.8, reviews: 200, description: "Improve dribbling, passing, and ball control.", duration: "20 min", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 2, title: "Cricket Batting Basics", category: "Cricket", rating: 4.7, reviews: 150, description: "Master stance, grip, and perfect shots.", duration: "25 min", progress: 40, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 3, title: "Basketball Shooting Guide", category: "Basketball", rating: 4.9, reviews: 180, description: "Sharpen your free throws and jump shots.", duration: "15 min", progress: 70, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 4, title: "Tennis Serve Mastery", category: "Tennis", rating: 4.6, reviews: 95, description: "Serve with precision and power.", duration: "18 min", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 5, title: "Swimming Techniques", category: "Swimming", rating: 4.8, reviews: 120, description: "Improve freestyle, backstroke, and breathing.", duration: "12 min", progress: 25, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 6, title: "Volleyball Spiking Drills", category: "Volleyball", rating: 4.9, reviews: 110, description: "Jump higher and spike stronger.", duration: "22 min", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 7, title: "Hockey Stick Control", category: "Hockey", rating: 4.7, reviews: 80, description: "Better puck handling and accuracy.", duration: "16 min", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 8, title: "Badminton Smash Training", category: "Badminton", rating: 4.8, reviews: 140, description: "Smash faster and with better timing.", duration: "14 min", progress: 10, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" }
      ]);
    }, 500);
  }, []);

  return (
    <Container className="my-5">
      <div className="p-4 rounded shadow-sm" style={{ backgroundColor: "#fff" }}>
        
        {/* Header */}
        <Row className="align-items-center mb-4">
          <Col md="6">
            <h4 className="fw-bold">Sports Classes</h4>
            <p className="text-muted mb-0">
              Total {videos.length} sports training videos available
            </p>
          </Col>
          <Col md="6" className="d-flex justify-content-end align-items-center">
            <Input type="select" className="me-3" style={{ width: "180px" }}>
              <option>All Sports</option>
              <option>Football</option>
              <option>Cricket</option>
              <option>Basketball</option>
              <option>Tennis</option>
              <option>Swimming</option>
              <option>Volleyball</option>
              <option>Hockey</option>
              <option>Badminton</option>
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
              <Card className="h-100 shadow-sm border-0">
                <video width="100%" height="180" controls>
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge color="primary">{video.category}</Badge>
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

export default SportsCards;
