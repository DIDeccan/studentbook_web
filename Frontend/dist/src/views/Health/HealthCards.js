import React, { Fragment, useEffect, useState } from "react";
import {
  Row, Col, Card, CardBody, CardTitle, CardText,
  Button, Badge, Progress, Input
} from "reactstrap";
import { Star, Clock } from "react-feather";

const Yoga = () => {
  const [tips, setTips] = useState([]); // ✅ renamed state to tips

  useEffect(() => {
    setTimeout(() => {
      setTips([
        { id: 1, title: "Stay Hydrated", category: "Wellness", rating: 4.9, reviews: 180, description: "Drink at least 8 glasses of water a day to keep your body active and healthy.", duration: "2 min read", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 2, title: "Balanced Diet", category: "Nutrition", rating: 4.8, reviews: 150, description: "Include fruits, vegetables, and proteins in your daily meals.", duration: "3 min read", progress: 20, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 3, title: "Sleep Well", category: "Mental Health", rating: 4.7, reviews: 130, description: "Aim for 7-8 hours of sleep every night to stay refreshed.", duration: "2 min read", progress: 50, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 4, title: "Regular Exercise", category: "Fitness", rating: 4.9, reviews: 200, description: "Engage in at least 30 minutes of physical activity daily.", duration: "4 min read", progress: 0, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 5, title: "Mindful Breathing", category: "Relaxation", rating: 4.8, reviews: 95, description: "Practice deep breathing to reduce stress and improve focus.", duration: "2 min read", progress: 70, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"  },
        { id: 6, title: "Limit Screen Time", category: "Lifestyle", rating: 4.6, reviews: 85, description: "Take regular breaks from screens to protect your eyes and mind.", duration: "3 min read", progress: 10, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
      ]);
    }, 500);
  }, []);

  return (
    <Fragment>
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col md="6">
          <h2 className="fw-bold">🌿 Healthy Living Tips</h2>
          <p className="fw-bold mb-0">
            📘 Total {tips.length} tips to boost your health and lifestyle!
          </p>
        </Col>
        <Col md="6" className="d-flex justify-content-end align-items-center">
          <Input
            type="select"
            className="me-3 rounded-pill"
            style={{ width: "180px" }}
          >
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

      {/* Tip Cards */}
      <Row>
        {tips.map((tip) => (
          <Col md="4" sm="6" xs="12" className="mb-4 d-flex justify-content-center" key={tip.id}>
            <Card
              className="h-100 shadow-lg border-0"
              style={{
                width: "450px",
                borderRadius: "20px",
                backgroundColor: "#ffffff",
                transition: "transform 0.3s"
              }}
            >
              <video
                width="100%"
                height="180"
                controls
                style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
              >
                <source src={tip.videoUrl} type="video/mp4" />
              </video>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Badge
                    style={{
                      background: "linear-gradient(to right, #ff6a00, #ee0979)",
                      borderRadius: "10px",
                      fontSize: "0.75rem"
                    }}
                  >
                    {tip.category}
                  </Badge>
                  <div className="d-flex align-items-center">
                    <span className="me-1 fw-bold">{tip.rating}</span>
                    <Star size={16} color="gold" />
                    <small className="text-muted ms-1">({tip.reviews})</small>
                  </div>
                </div>

                <CardTitle tag="h5" className="fw-bold text-dark text-truncate" style={{ maxWidth: "250px" }}>
                  {tip.title}
                </CardTitle>
                <CardText className="text-muted" style={{ fontSize: "0.9rem", minHeight: "50px" }}>
                  {tip.description}
                </CardText>

                <div className="d-flex align-items-center mb-2">
                  <Clock size={16} className="me-1 text-primary" />
                  <small className="text-muted">{tip.duration}</small>
                </div>

                <Progress value={tip.progress} style={{ height: "8px", borderRadius: "10px" }} className="mb-3" color="warning" />

                <div className="d-flex justify-content-between">
                  <Button style={{ background: "linear-gradient(to right, #00c6ff, #0072ff)", border: "none", borderRadius: "20px", padding: "5px 15px" }} size="sm">
                    Start Over
                  </Button>
                  <Button style={{ background: "linear-gradient(to right, #ff512f, #dd2476)", border: "none", borderRadius: "20px", padding: "5px 15px" }} size="sm">
                    {tip.progress > 0 ? "Continue 🚀" : "Start Now 🎉"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Fragment>
  );
};

export default Yoga;
