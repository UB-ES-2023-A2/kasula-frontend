import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import PostReview from "./PostReview";
import chefIcon from "../assets/icons/chef.png";
import { StarFill } from "react-bootstrap-icons";
import LikesReview from "./LikesReview";


function Reviews(props) {
  const { id } = props;
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
  }, []); // Cambié [likes] a [] para evitar un bucle infinito

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

//   const handleLike = async (reviewId) => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/review/like/${id}/${reviewId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       const data = await response.json();
//       if (!response.ok) {
//         console.error("Error al enviar el like:", data);
//         return;
//       }
  
//       // Actualiza el estado localmente usando el callback
//       setReviews(prevReviews => {
//         const updatedReviews = [...prevReviews];
//         const index = updatedReviews.findIndex((review) => review._id === reviewId);
//         if (index !== -1) {
//           updatedReviews[index].likes = (updatedReviews[index].likes || 0) + 1;
//         }
//         return updatedReviews;
//       });
//     } catch (error) {
//       console.error("Error en la solicitud de like:", error);
//     }
//   };

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
          //   recipeImage={gyozas}
          //   recipeName={"Gyozas"}
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
                          <div className="d-flex align-items-center my-2">
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
                          <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center">
                                <LikesReview
                                recipeId={id}
                                reviewId={review._id}
                                initialLikes={review.likes || 0}
                                likedBy={review.liked_by}
                                />
                            </div>
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
