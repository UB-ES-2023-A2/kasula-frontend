import React from "react";
import { Modal, Image } from "react-bootstrap";

function ImageModal({ show, onHide, recipeImage, recipeName }) {
  return (
    // <Modal show={show} onHide={onHide} size="lg">
    //   <Modal.Header closeButton>
    //     <Modal.Title>{recipeName}</Modal.Title>
    //   </Modal.Header>
    //   <Modal.Body>
    //     <Image src={recipeImage} alt={recipeName} className="img-fluid" />
    //   </Modal.Body>
    // </Modal>
    <Modal show={show} onHide={onHide} size="lg">
        <Modal.Body className="p-0">
            <Image src={recipeImage} alt="Recipe" fluid />
        </Modal.Body>
    </Modal>
  );
}

export default ImageModal;
