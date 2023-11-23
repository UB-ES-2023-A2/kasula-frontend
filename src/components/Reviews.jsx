import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import PostReview from "./PostReview";
import chefIcon from "../assets/icons/chef.png";
import { StarFill } from "react-bootstrap-icons";
import LikesReview from "./LikesReview";


function Reviews(props) {
  const { id, reloadReviews } = props;
  const [reviews, setReviews] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/review/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(">>DATA: ", data);
        setReviews(data);
      })
      .catch((error) => console.error("Error al obtener receta:", error));
  }, [id, reloadReviews]); 

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container className="flex-column justify-content-between align-items-center">
      <Row className="mt-2">
        <Button className="fs-6 mx-auto" onClick={handleOpenModal}>
          Post review
        </Button>
        <PostReview
          id={id}
          show={showModal}
          onHide={handleCloseModal}
          reloadReviews={reloadReviews}
        />
      </Row>

      <Col sm={12} className="mt-4 mx-auto">
        <Container>
          <ul className="list-unstyled">
            {reviews ? (
              reviews.map((review, index) => (
                <li key={index} className="mb-3 p-2 fs-6 bg-light box-shadow">
                  <Row>
                    <Col sm={3} className="fw-bold">
                      {review.username}:{" "}
                    </Col>
                    <Col sm={9}>{review.comment}</Col>
                    <Col sm={5} className="mt-2">
                      <Image
                        src={review.image}
                        alt={review.user}
                        style={{
                          width: "112px",
                          height: "96px",
                          borderRadius: "20%",
                        }}
                      />
                    </Col>
                    <Col sm={7}>
                      <Row>
                        <Col sm={12}>
                          <div className="d-flex align-items-center mt-3 mb-2">
                            <h5>
                              <Image
                                src={chefIcon}
                                style={{ height: "24px", width: "24px" }}
                                fluid
                              />{" "}
                              {Array(review.rating || 0)
                                .fill()
                                .map((_, index) => (
                                  <span
                                    key={index}
                                    className="fs-5 ms-1 text-center"
                                  >
                                    <StarFill
                                      style={{ color: "gold" }}
                                    ></StarFill>
                                  </span>
                                ))}
                            </h5>
                          </div>
                        </Col>
                        <Col sm={12}>
                          <div className="d-flex align-items-cente mx-1">
                            <LikesReview
                            recipeId={id}
                            reviewId={review._id}
                            initialLikes={review.likes || 0}
                            likedBy={review.liked_by}
                            reloadReviews={reloadReviews}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </li>
              ))
            ) : (
              <span>Reviews not available</span>
            )}
          </ul>
        </Container>
      </Col>
    </Container>
  );
}

export default Reviews;
