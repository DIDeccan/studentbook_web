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
    <Container className="my-4">
      <Row>
        <Col md="8">
          <video width="100%" height="400" controls key={currentVideo}>
            <source src={currentVideo} type="video/mp4" />
          </video>
          <h2 className="mt-3">{subject.name}</h2>
          <p className="text-muted">
            {subject.category} - {subject.level}
          </p>
          <Badge color="danger" pill>
            {subject.category}
          </Badge>

          <h5 className="mt-4 text-primary">{currentChapter}</h5>
          <p className="mt-2">{currentDesc}</p>
        </Col>

        <Col md="4">
          <div className="border rounded p-3 shadow-sm">
            <h5>Course Content</h5>
            <Progress value={subject.progress} className="mb-2" />
            <small>{subject.progress}% completed</small>

            <ListGroup className="mt-3">
              {units.map((unit) => (
                <div key={unit.id} className="mb-2">
                  <ListGroupItem
                    id={`toggle${unit.id}`}
                    action
                    tag="button"
                    className="text-start fw-bold"
                  >
                    {unit.name}
                  </ListGroupItem>

                  <UncontrolledCollapse toggler={`#toggle${unit.id}`}>
                    <ListGroup flush>
                      {unit.chapters.map((chapter, idx) => (
                        <ListGroupItem
                          key={idx}
                          className="ps-4"
                          action
                          tag="button"
                          onClick={() => handleChapterClick(chapter)}
                        >
                          {chapter}
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
