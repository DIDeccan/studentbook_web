import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Badge,
  Progress,
  ListGroup,
  ListGroupItem,
  UncontrolledCollapse
} from "reactstrap";

const Cdetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const subject = location.state?.subject;

  if (!subject) {
    return <p className="text-center mt-5">No course data found.</p>;
  }

  const chapterData = {
    "Chapter 1": {
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      desc: "Chapter 1 covers the basics of English grammar and sentence formation."
    },
    "Chapter 2": {
      video: "https://www.w3schools.com/html/movie.mp4",
      desc: "Chapter 2 focuses on vocabulary building and common usage."
    },
    "Chapter 3": {
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      desc: "Chapter 3 introduces reading comprehension techniques."
    },
    "Chapter 4": {
      video: "https://www.w3schools.com/html/movie.mp4",
      desc: "Chapter 4 is about advanced grammar concepts."
    },
    "Chapter 5": {
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      desc: "Chapter 5 teaches writing skills for essays and letters."
    },
    "Chapter 6": {
      video: "https://www.w3schools.com/html/movie.mp4",
      desc: "Chapter 6 focuses on creative writing and storytelling."
    },
    "Chapter 7": {
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      desc: "Chapter 7 covers public speaking and oral communication."
    },
    "Chapter 8": {
      video: "https://www.w3schools.com/html/movie.mp4",
      desc: "Chapter 8 focuses on listening skills and comprehension."
    },
    "Chapter 9": {
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      desc: "Chapter 9 explains idioms and figurative language."
    },
    "Chapter 10": {
      video: "https://www.w3schools.com/html/movie.mp4",
      desc: "Chapter 10 is about formal letter writing and reports."
    },
    "Chapter 11": {
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      desc: "Chapter 11 covers exam preparation tips."
    }
  };

  const units = [
    { id: 1, name: "Unit 1", chapters: ["Chapter 1", "Chapter 2", "Chapter 3"] },
    { id: 2, name: "Unit 2", chapters: ["Chapter 4", "Chapter 5", "Chapter 6"] },
    { id: 3, name: "Unit 3", chapters: ["Chapter 7", "Chapter 8", "Chapter 9"] },
    { id: 4, name: "Unit 4", chapters: ["Chapter 10", "Chapter 11"] }
  ];

  const [currentVideo, setCurrentVideo] = useState(subject.videoUrl);
  const [currentDesc, setCurrentDesc] = useState(subject.description);
  const [currentChapter, setCurrentChapter] = useState("Course Overview");

  const handleChapterClick = (chapter) => {
    setCurrentVideo(chapterData[chapter].video);
    setCurrentDesc(chapterData[chapter].desc);
    setCurrentChapter(chapter);
  };

  return (
    <Container
      fluid
      className="py-4"
      style={{
        background: "linear-gradient(135deg, #ffecd2, #fcb69f, #a1c4fd, #c2e9fb)",
        minHeight: "100vh"
      }}
    >
      <Row>
        {/* Left Side - Video & Description */}
        <Col md="8" className="mb-4">
          <div
            className="p-3 rounded-4 shadow-lg"
            style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
          >
            <video
              width="100%"
              height="400"
              controls
              key={currentVideo}
              style={{ borderRadius: "15px" }}
            >
              <source src={currentVideo} type="video/mp4" />
            </video>
            <h2 className="mt-3 text-primary fw-bold">🎓 {subject.name}</h2>
            <p className="text-muted">
              {subject.category} - {subject.level}
            </p>
            <Badge color="warning" pill>
              {subject.category}
            </Badge>

            <h5 className="mt-4 text-success fw-bold">📖 {currentChapter}</h5>
            <p className="mt-2 text-dark">{currentDesc}</p>
          </div>
        </Col>

        {/* Right Side - Course Content */}
        <Col md="4">
          <div
            className="p-3 rounded-4 shadow-lg"
            style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
          >
            <h4 className="fw-bold text-primary">📚 Course Content</h4>
            <Progress
              value={subject.progress}
              className="mb-2"
              color="info"
              style={{ height: "15px", borderRadius: "10px" }}
            />
            <small className="fw-bold text-success">
              {subject.progress}% completed 🎯
            </small>

            <ListGroup className="mt-3">
              {units.map((unit) => (
                <div key={unit.id} className="mb-2">
                  <ListGroupItem
                    id={`toggle${unit.id}`}
                    action
                    tag="button"
                    className="text-start fw-bold rounded-3"
                    style={{
                      background:
                        "linear-gradient(45deg, #89f7fe, #66a6ff)",
                      color: "#fff",
                      border: "none"
                    }}
                  >
                    📦 {unit.name}
                  </ListGroupItem>

                  <UncontrolledCollapse toggler={`#toggle${unit.id}`}>
                    <ListGroup flush>
                      {unit.chapters.map((chapter, idx) => (
                        <ListGroupItem
                          key={idx}
                          className="ps-4 rounded-2 my-1"
                          action
                          tag="button"
                          style={{
                            background: "#f0f9ff",
                            color: "#0072ff",
                            fontWeight: "500"
                          }}
                          onClick={() => handleChapterClick(chapter)}
                        >
                          📖 {chapter}
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </UncontrolledCollapse>
                </div>
              ))}
            </ListGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cdetails;
