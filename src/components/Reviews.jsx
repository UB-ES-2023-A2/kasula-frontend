import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import PostReview from "./PostReview";
import chefIcon from "../assets/icons/chef.png"
import { StarFill, CalendarCheck} from "react-bootstrap-icons";


function Reviews(props){
    const { id } = props;
    const [reviews, setReviews] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + `/review/${id}`)
        .then((response) => response.json())
        .then((data) => {
        console.log(">>DATA: ", data);
        setReviews(data);
        })
        .catch((error) => console.error("Error al obtener receta:", error));
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
                        <Row>
                            <Col sm={3} className="fw-bold">
                                {review.username}:{" "}
                            </Col>
                            <Col sm={9}>
                                {review.comment}
                            </Col>
                            <Col sm={5} className="mt-2">
                                <Image
                                src={review.image} 
                                alt={review.user}
                                style={{ width: '112px', height: '96px', borderRadius: '20%' }}
                                />
                            </Col>
                            <Col sm={7}>
                                <div className="d-flex align-items-center my-2">
                                <h5><Image src={chefIcon} style={{height:'24px', width: '24px'}} fluid/> {Array(review.rating || 0).fill().map((_, index) => (
                                    <span key={index} className="fs-5 ms-1 text-center"><StarFill style={{color: 'gold'}}></StarFill></span>
                                    ))}</h5>
                                </div>
                            </Col>
                        </Row>
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


