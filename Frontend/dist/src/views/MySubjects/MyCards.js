import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardText,
  Button, Badge, Input
} from "reactstrap";
import { BookOpen } from "react-feather";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "react-feather";
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
        { id: 6, name: "Social Studies", category: "Humanities", level: "Class 6", description: "Learn about history, geography, and civics in an interactive way.", chapters: 13, progress: 70, videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"  },
      ]);
    }, 500);
  }, []);

  const handleCardClick = (subject) => {
    navigate(`/coursedetails/${subject.id}`, { state: { subject } });
  };

  return (
    <Container className="my-5">
      <div className="p-4 rounded shadow-sm" style={{ backgroundColor: "#fff" }}>
        <Row className="align-items-center mb-4">
          <Col md="6">
            <h4 className="fw-bold">My Subjects</h4>
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
                className="h-100 shadow-sm border-0"
                style={{ cursor: "pointer" }}
                onClick={() => handleCardClick(subj)}
              >
                <video width="100%" height="180" controls>
                  <source src={subj.videoUrl} type="video/mp4" />
                </video>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge color="primary">{subj.category}</Badge>
                    <small className="text-muted">{subj.level}</small>
                  </div>
                  <CardTitle tag="h5" className="fw-bold">{subj.name}</CardTitle>
                  <CardText className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {subj.description}
                  </CardText>
                  <div className="d-flex align-items-center mb-2">
                    <BookOpen size={16} className="me-1" />
                    <small className="text-muted">{subj.chapters} Chapters</small>
                  </div>


<div className="d-flex gap-3">
  <Button
    outline
    color="secondary"
    size="sm"
    className="d-flex align-items-center px-1 py-1"
    style={{
      backgroundColor: '#f5f5f5',
      color: '#6c757d',
      fontWeight: '500',
      boxShadow: 'none',
    }}
  >
   Review Course
  </Button>

  <Button
    color="primary"
    size="sm"
    className="d-flex align-items-center px-1 py-1"
    style={{
      backgroundColor: '#f0f0ff',
      color: '#4f46e5',
      border: 'none',
      fontWeight: '500',
    }}
  >
    {subj.progress > 0 ? "Start Course" : "Continue"}
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

export default MySubjects;
