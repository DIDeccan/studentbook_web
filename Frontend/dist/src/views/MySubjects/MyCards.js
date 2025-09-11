import React, { Fragment, useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardText,
  Button, Badge, Input
} from "reactstrap";
import { BookOpen } from "react-feather";
import { useNavigate } from "react-router-dom";

const MySubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setSubjects([
        { id: 1, name: "Hindi", category: "Language", level: "Class 6", description: "Learn Hindi grammar, vocabulary, and literature with interactive lessons.", chapters: 12, progress: 40, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 2, name: "Telugu", category: "Language", level: "Class 6", description: "Master Telugu language skills with reading and writing practice.", chapters: 10, progress: 20, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 3, name: "Mathematics", category: "STEM", level: "Class 6", description: "Covers arithmetic, geometry, and basic algebra concepts.", chapters: 15, progress: 60, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 4, name: "Science", category: "STEM", level: "Class 6", description: "Explore physics, chemistry, and biology through engaging activities.", chapters: 14, progress: 50, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 5, name: "English", category: "Language", level: "Class 6", description: "Improve reading, writing, grammar, and communication skills.", chapters: 11, progress: 30, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 6, name: "Social Studies", category: "Humanities", level: "Class 6", description: "Learn about history, geography, and civics in an interactive way.", chapters: 13, progress: 70, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" },
      ]);
    }, 500);
  }, []);

  const handleCardClick = (subject) => {
    navigate(`/coursedetails/${subject.id}`, { state: { subject } });
  };

  // Emoji helper for subjects
  const getEmoji = (name) => {
    switch (name) {
      case "Mathematics": return "🧮";
      case "Science": return "🔬";
      case "English": return "📘";
      case "Hindi": return "✍";
      case "Telugu": return "📖";
      case "Social Studies": return "🌍";
      default: return "📚";
    }
  };

  return (
    <Fragment>
    <div className="p-4 rounded shadow-sm">
      <Row className="align-items-center mb-4">
        <Col md="6">
          <h4 className="fw-bold">Subjects</h4>
          <p className="text-muted mb-0">
            Total {subjects.length} subjects available
          </p>
        </Col>
        <Col md="6" className="d-flex justify-content-end align-items-center">
          <Input type="select" className="me-3" style={{ width: "180px" }}>
            <option>All Courses</option>
            <option>Telugu</option>
            <option>Hindi</option>
            <option>English</option>
            <option>Mathematics</option>
            <option>Science</option>
            <option>Social Studies</option>
          </Input>
        </Col>
      </Row>

      <Row>
        {subjects.map((subj) => (
          <Col md="4" sm="6" xs="12" className="mb-4 d-flex" key={subj.id}>
            <Card
              className="h-100 shadow-lg border-0"
              style={{
                cursor: "pointer",
                borderRadius: "20px",
                // background: "linear-gradient(135deg, #ffecd2, #fcb69f)"
              }}
              onClick={() => handleCardClick(subj)}
            >
              <div style={{ position: "relative" }}>
                <video
                  width="100%"
                  height="180"
                  style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
                >
                  <source src={subj.videoUrl} type="video/mp4" />
                </video>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "30px",
                    fontWeight: "600"
                  }}
                >
                  ▶ Play Now
                </div>
              </div>

              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Badge color="primary" pill>
                    {subj.category}
                  </Badge>
                  <small className="text-muted">{subj.level}</small>
                </div>

                <CardTitle tag="h5" className="fw-bold">
                  {getEmoji(subj.name)} {subj.name}
                </CardTitle>

                <CardText className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                  {subj.description}
                </CardText>

                {/* Progress bar */}
                <div className="mb-3">
                  <div
                    style={{
                      background: "#e6e6fa",
                      borderRadius: "10px",
                      height: "8px",
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        width: `${subj.progress}%`,
                        background: "#4f46e5",
                        height: "100%"
                      }}
                    ></div>
                  </div>
                  <small className="text-muted">{subj.progress}% Complete</small>
                </div>

                <div className="d-flex justify-content-between">
                  <Button
                    size="sm"
                    style={{
                      borderRadius: "20px",
                      fontWeight: "600",
                      background: "linear-gradient(45deg, #ff6a00, #ffcc70)", // 🌟 Bright orange-yellow
                      border: "none",
                      color: "#fff",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.2)"
                    }}
                  >
                    👀 Review
                  </Button>

                  <Button
                    size="sm"
                    style={{
                      borderRadius: "20px",
                      fontWeight: "600",
                      background: "linear-gradient(45deg, #00c6ff, #0072ff)", // 🌟 Bright blue
                      border: "none",
                      color: "#fff",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.2)"
                    }}
                  >
                    ▶ {subj.progress > 0 ? "Continue" : "Start"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
    </Fragment>
  );
};

export default MySubjects;
