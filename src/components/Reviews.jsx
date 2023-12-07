import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import PostReview from "./PostReview";
import { StarFill, PatchCheck, PencilSquare, Trash } from 'react-bootstrap-icons';
import LikesReview from "./LikesReview";
import ImageModal from "./ImageModal";
import ModifyReview from "./ModifyReview";


function Reviews(props) {
  const { id, reloadReviews } = props;
  const [reviews, setReviews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalImage, setShowModalImage] = useState(false);
  const [showModalReview, setShowModalReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedFunct, setSelectedFunct] = useState(null);
  const isLogged = window.localStorage.getItem("logged");
  const currentUserUsername = localStorage.getItem('currentUser');


  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/review/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => console.error("Error al obtener receta:", error));
  }, [id, reloadReviews]); 

  const handleOpenModalImage = (image) => {
    setSelectedImage(image);
    setShowModalImage(true);
  };

  const handleCloseModalImage = () => {
    setSelectedImage(null);
    setShowModalImage(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModalReview = (review, funct) => {
    setSelectedReview(review);
    setShowModalReview(true);
    setSelectedFunct(funct);

  };

  const handleCloseModalReview = () => {
    setSelectedReview(null);
    setShowModalReview(false);
    setSelectedFunct(null);
  };

  return (
    <Container className="flex-column justify-content-between align-items-center">
      {isLogged === 'true' ? 
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
      : null}
      <Col sm={12} className="mt-4 mx-auto">
        <Container>
          <ul className="list-unstyled">
            {reviews ? (
              reviews.map((review, index) => (
                <li key={index} className="mb-3 p-2 fs-6 bg-light box-shadow">
                  <Row>
                    <Col sm={2} className="fw-bold">
                      {review.username}:{" "}
                    </Col>
                    <Col sm={10}>{review.comment}</Col>
                    <Col sm={5} className="mt-2">
                      <Image
                        src={review.image}
                        alt={review.user}
                        onClick={() => handleOpenModalImage(review.image)}
                        style={{
                          width: "112px",
                          height: "96px",
                          borderRadius: "20%",
                          cursor: "pointer"
                        }}
                      />
                    </Col>
                    <Col sm={7}>
                      <Row>
                        <Col sm={12}>
                          <div className="d-flex align-items-center mt-3 mb-2">
                            <h5>
                              <PatchCheck
                                style={{ color: "red", marginLeft: '1px' }}
                              ></PatchCheck>{" "}
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
                            reviewUsername={review.username}
                            recipeId={id}
                            reviewId={review._id}
                            initialLikes={review.likes || 0}
                            likedBy={review.liked_by}
                            reloadReviews={reloadReviews}
                            />
                            {currentUserUsername === review.username && (
                              <>
                                <PencilSquare
                                  className="ms-2"
                                  style={{ color: 'blue', cursor: 'pointer' }}
                                  onClick={() => handleOpenModalReview(review, 'Edit')}
                                />
                                <Trash
                                  className="ms-2"
                                  style={{ color: 'red', cursor: 'pointer' }}
                                  onClick={() => handleOpenModalReview(review, 'Trash')}
                                />
                              </>
                            )} 
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
      <ImageModal
        show={showModalImage}
        onHide={handleCloseModalImage}
        recipeImage={selectedImage}
        recipeName={selectedImage ? "Image" : null} // Puedes cambiar esto según tus necesidades
      />
      {selectedReview && (
        <ModifyReview
          show={showModalReview}
          reviewId={selectedReview._id}
          recipeId={id}
          onHide={handleCloseModalReview}
          reloadReviews={reloadReviews}
          funct={selectedFunct}
          reviewInfo={selectedReview}
        />
      )}
    </Container>
  );
}

export default Reviews;
