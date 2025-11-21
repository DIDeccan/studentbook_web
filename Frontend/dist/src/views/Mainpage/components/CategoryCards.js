import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchContentData } from "../../../redux/contentSlice";
import { BASE_URL } from "../../../apis/endpoints";

const CategoryCards = () => {

  return (
    <Container className="py-5">
      <h2 className="mb-5 text-center fw-bold text-primary">
        🌟 Explore Our Categories
      </h2>

      {loading && (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      )}
      {error && <p className="text-danger text-center">{error}</p>}

      <Row className="justify-content-center">
        {data?.content?.map((card, index) => {
          console.log("Image path:", card.image, "Final URL:", getImageUrl(card.image));
return (
    <Col sm="12" md="6" lg="4" xl="3" className="mb-4 d-flex" key={index}>
            <Link
              to={`/${card.name.toLowerCase().replace(/\s+/g, "")}`}
              style={{ textDecoration: "none", color: "inherit", width: "100%" }}
            >
              <Card
                className="h-100 shadow-lg border-0"
                style={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 12px rgba(0,0,0,0.1)";
                }}
              >
                <CardImg
                  top
                  src={getImageUrl(card.image)}
                  alt={card.name}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                />
                <CardBody className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <CardTitle tag="h5" className="fw-bold text-dark">
                      {card.name}
                    </CardTitle>
                 <Badge color={card.tagColor} pill>
    {card.sub_title}
  </Badge>
                  </div>
                  <CardText className="text-muted"
                    style={{
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}>
                    {card.description}
                  </CardText>
                  <div className="mt-auto text-end">
                    <span className="text-primary fw-semibold">
                      ➜ Learn More
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </Col>
)
        
})}
      </Row>
    </Container>
  );
};

export default CategoryCards;
