import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import PostReview from "./PostReview";


function Reviews(props){
    const { id } = props;
    const [reviews, setReviews] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Haremos el fetch donde traiga los comentarios
       const mockReviews = [
        {user: "Jaimito",
        text: "Good recipe"},
        {user: "Pedrito",
        text: "Bad recipe"},
        {user: "Juanito",
        text: "Not bad recipe"},
        {user: "Pepito",
        text: "Excellent recipe"}
       ]
        setReviews(mockReviews);
        console.log(">>>>ID in Reviews: ", id)
    }, [])

    const handleOpenModal = () => {
        setShowModal(true);
      };
      
      const handleCloseModal = () => {
        setShowModal(false);
      };


    return (
    <Container className="flex-column justify-content-between align-items-center">
        <Row className="mt-2">
        <Button className="fs-6 mx-auto" onClick={handleOpenModal}>Post review</Button>
        <PostReview
          id={id}
          show={showModal}
          onHide={handleCloseModal}
        //   recipeImage={gyozas}
        //   recipeName={"Gyozas"}
        />
            {/* <Col sm={12} className="p-2 box-shadow">
            <Row>
                <Col sm={7}>
                    <h3 className="text-center">Comentarios</h3>
                </Col>
                <Col sm={5}>
                    <Button className="fs-6" onClick={handleOpenModal}>Post review</Button>
                </Col>
            </Row>
            </Col> */}
            <Col sm={12} className="mt-4 mx-auto">
                <Container>
                <ul className="list-unstyled">
                    {reviews ? (
                    reviews.map((review, index) => (
                    <li key={index} className="mb-3 p-2 fs-6 bg-light box-shadow">
                        {review.user}: {review.text}
                    </li>
                    ))) :
                    <span>Reviews not available</span>}
                </ul>
                </Container>
            </Col>
        </Row>

    </Container>);
}

export default Reviews;


