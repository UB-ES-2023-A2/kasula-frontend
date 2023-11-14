import React from "react";
import { Container, Row, Col} from "react-bootstrap";


function Comments(){

    return (
    <Container className="" style={{ backgroundColor: '#ffb79fe0'}}>
        <Row className="mt-5">
            <Col sm={12}>
            <h3 className="text-align-center">Comentarios</h3>
            </Col>
            <Col sm={8}>
                <Container>
                    <span>Comentarios no disponibles</span>
                </Container>
            </Col>
        </Row>
    </Container>);
}

export default Comments;


