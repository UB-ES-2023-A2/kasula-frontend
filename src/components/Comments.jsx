import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import PostComment from "./PostComment";


function Comments(){
    const [comments, setComments] = useState(null);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        // Haremos el fetch donde traiga los comentarios
       const mockComments = [
        {user: "Jaimito",
        text: "Good recipe"},
        {user: "Pedrito",
        text: "Bad recipe"},
        {user: "Juanito",
        text: "Not bad recipe"},
        {user: "Pepito",
        text: "Excellent recipe"}
       ]
        setComments(mockComments);
    }, [])

    const handleOpenModal = () => {
        setShowModal(true);
      };
      
      const handleCloseModal = () => {
        setShowModal(false);
      };


    return (
    <Container className="" style={{ backgroundColor: '#ffb79fe0'}}>
        {/* Demomento ponemos el modal de las imagenes, pero será el modal para postear una receta */}
        <PostComment
          show={showModal}
          onHide={handleCloseModal}
        //   recipeImage={gyozas}
        //   recipeName={"Gyozas"}
        />
        <Row className="mt-5">
            {/* <Col sm={12} className="p-2 box-shadow">
            <Row>
                <Col sm={7}>
                    <h3 className="text-center">Comentarios</h3>
                </Col>
                <Col sm={5}>
                    <Button className="fs-6" onClick={handleOpenModal}>Post comment</Button>
                </Col>
            </Row>
            </Col> */}
            <Col sm={12} className="mt-3 mx-auto">
                <Container>
                <ul className="list-unstyled">
                    {comments ? (
                    comments.map((comment, index) => (
                    <li key={index} className="mb-3 p-2 fs-6 bg-light box-shadow">
                        {comment.user}: {comment.text}
                    </li>
                    ))) :
                    <span>Comentarios no disponibles</span>}
                </ul>
                </Container>
            </Col>
        </Row>

    </Container>);
}

export default Comments;


