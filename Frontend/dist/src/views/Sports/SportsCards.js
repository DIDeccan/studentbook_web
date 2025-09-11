import React, { Fragment, useEffect, useState } from "react";
import {
  Row, Col, Card, CardBody, CardTitle, CardText,
  Button, Badge, Progress, Input
} from "reactstrap";
import { Star, Clock } from "react-feather";

const Yoga = () => {
  const [videos, setVideos] = useState([]);

   useEffect(() => {
    setTimeout(() => {
    setVideos([
  { 
    id: 1, 
    title: "⚽ Football Skills Training", 
    category: "Football", 
    rating: 4.8, 
    reviews: 200, 
    description: "Improve dribbling, passing, and ball control. Learn how to move swiftly across the field, master teamwork drills, and practice goal-scoring tricks that make football fun and exciting for kids of all levels.", 
    duration: "20 min", 
    progress: 0, 
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
  },
  { 
    id: 2, 
    title: "🏏 Cricket Batting Basics", 
    category: "Cricket", 
    rating: 4.7, 
    reviews: 150, 
    description: "Master stance, grip, and perfect shots. This session also covers fun batting drills, hand-eye coordination games, and tips on building confidence while hitting the ball like a pro cricketer.", 
    duration: "25 min", 
    progress: 40, 
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
  },
  { 
    id: 3, 
    title: "🏀 Basketball Shooting Guide", 
    category: "Basketball", 
    rating: 4.9, 
    reviews: 180, 
    description: "Sharpen your free throws and jump shots. Kids will also practice balance, teamwork drills, and exciting challenges that make every session interactive and fun while boosting accuracy and confidence.", 
    duration: "15 min", 
    progress: 70, 
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
  },
  { 
    id: 4, 
    title: "🎾 Tennis Serve Mastery", 
    category: "Tennis", 
    rating: 4.6, 
    reviews: 95, 
    description: "Serve with precision and power. This class also teaches proper racket handling, playful reflex exercises, and fun mini-games to help kids build stamina and agility while enjoying tennis.", 
    duration: "18 min", 
    progress: 0, 
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
  },
  { 
    id: 5, 
    title: "🏊 Swimming Techniques", 
    category: "Swimming", 
    rating: 4.8, 
    reviews: 120, 
    description: "Improve freestyle, backstroke, and breathing. Kids will also learn safe water play activities, fun floating drills, and swimming games designed to build confidence in the pool.", 
    duration: "12 min", 
    progress: 25, 
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
  },
  { 
    id: 6, 
    title: "🏐 Volleyball Spiking Drills", 
    category: "Volleyball", 
    rating: 4.9, 
    reviews: 110, 
    description: "Jump higher and spike stronger. These sessions also focus on fun passing games, teamwork activities, and reaction exercises that help kids enjoy the game while building coordination.", 
    duration: "22 min", 
    progress: 0, 
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
  },
  { 
    id: 7, 
    title: "🏒 Hockey Stick Control", 
    category: "Hockey", 
    rating: 4.7, 
    reviews: 80, 
    description: "Better puck handling and accuracy. Kids will also enjoy stick-balancing games, speed drills, and fun exercises to improve reaction time and build confidence in their hockey skills.", 
    duration: "16 min", 
    progress: 0, 
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
  },
  { 
    id: 8, 
    title: "🏸 Badminton Smash Training", 
    category: "Badminton", 
    rating: 4.8, 
    reviews: 140, 
    description: "Smash faster and with better timing. The class also includes playful shuttle rallies, footwork drills, and fun challenges that make badminton exciting for kids to learn and master.", 
    duration: "14 min", 
    progress: 10, 
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
  }
]);

    }, 500);
  }, []);

  return (
    <Fragment>
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col md="6">
          <h2 className="fw-bold">🌈 Sports Classes for Kids</h2>
          <p className="text-blod mb-0">
            🎥 Join {videos.length} exciting yoga sessions designed to boost strength, flexibility, and fun!
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
          <div className="form-check form-switch text-white">
            <input className="form-check-input" type="checkbox" id="hideCompleted" />
            <label className="form-check-label ms-2" htmlFor="hideCompleted">
              Hide completed
            </label>
          </div>
        </Col>
      </Row>

      {/* Video Cards */}
      <Row>
        {videos.map((video) => (
          <Col md="4" sm="6" xs="12" className="mb-4 d-flex justify-content-center" key={video.id}>
            <Card
              className="h-100 shadow-lg border-0"
              style={{
                width: "450px",  // 🔹 fixed width for all cards
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
                <source src={video.videoUrl} type="video/mp4" />
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
                    {video.category}
                  </Badge>
                  <div className="d-flex align-items-center">
                    <span className="me-1 fw-bold">{video.rating}</span>
                    <Star size={16} color="gold" />
                    <small className="text-muted ms-1">({video.reviews})</small>
                  </div>
                </div>

                <CardTitle
                  tag="h5"
                  className="fw-bold text-dark text-truncate"
                  style={{ maxWidth: "250px" }} // 🔹 keeps long titles neat
                >
                  {video.title}
                </CardTitle>
                <CardText
                  className="text-muted"
                  style={{
                    fontSize: "0.9rem",
                    minHeight: "50px", // 🔹 keeps all card descriptions same height
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {video.description}
                </CardText>

                <div className="d-flex align-items-center mb-2">
                  <Clock size={16} className="me-1 text-primary" />
                  <small className="text-muted">{video.duration}</small>
                </div>

                <Progress
                  value={video.progress}
                  style={{ height: "8px", borderRadius: "10px" }}
                  className="mb-3"
                  color="warning"
                />

                <div className="d-flex justify-content-between">
                  <Button
                    style={{
                      background: "linear-gradient(to right, #00c6ff, #0072ff)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "5px 15px"
                    }}
                    size="sm"
                  >
                    Start Over
                  </Button>
                  <Button
                    style={{
                      background: "linear-gradient(to right, #ff512f, #dd2476)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "5px 15px"
                    }}
                    size="sm"
                  >
                    {video.progress > 0 ? "Continue 🚀" : "Start Now 🎉"}
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
