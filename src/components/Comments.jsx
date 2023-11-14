import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";


function Comments(){
    const [comments, setComments] = useState(null);

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

    
    return (
    <Container className="" style={{ backgroundColor: '#ffb79fe0'}}>
        <Row className="mt-5">
            <Col sm={12} className="p-3 box-shadow">
            <h3 className="text-align-center">Comentarios</h3>
            </Col>
            <Col sm={8} className="mt-3 mx-auto">
                <Container>
                <ul className="list-unstyled">
                    {comments ? (
                    comments.map((comment, index) => (
                    <li key={index} className="mb-3 p-2 fs-6 bg-light">
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


