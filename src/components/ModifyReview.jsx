// ModifyReview.js
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import {
  StarFill,
  Star
} from "react-bootstrap-icons";

const ModifyReview = ({ show, reviewId, recipeId, onHide, reloadReviews, funct, reviewInfo }) => {
  const [newComment, setNewComment] = useState(reviewInfo.comment);
  const [newRating, setNewRating] = useState(reviewInfo.rating);
  const [newImage, setNewImage] = useState(reviewInfo.file); // Para almacenar la nueva imagen
  const { token } = useAuth();

  const handleUpdateReview = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/review/${recipeId}/${reviewId}`,
        {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: newComment, rating: newRating }),        
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log('Review actualizada:', data);
        reloadReviews();
      } else {
        console.error('Error al actualizar la revisión:', data);
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización de la revisión:', error);
    }

    onHide();
  };

  const handleDeleteReview = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/review/${recipeId}/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log('Review eliminada:', data);
        reloadReviews();
      } else {
        console.error('Error al eliminar la revisión:', data);
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación de la revisión:', error);
    }

    onHide();
  };

  const renderStars = (amount) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={"difficulty-star "
            .concat(i <= amount ? "active" : "inactive")
            .concat(" ms-2 fs-4")}
          role="button"
          onClick={() => setNewRating(i)}
        >
          {i <= amount ? <StarFill /> : <Star />}
        </span>
      );
    }
    return stars;
  };

  const handleConfirmDelete = () => {
    handleDeleteReview();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{funct === 'Edit' ? 'Modificar' : 'Eliminar'} revisión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {funct === 'Edit' ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Escribe tu nuevo comentario aquí"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Rating</Form.Label>
              <div>{renderStars(newRating)}</div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        ) : (
          <p>Are you sure delete review?</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {funct === 'Edit' ? (
          <Button variant="primary" onClick={handleUpdateReview}>
            Update
          </Button>
        ) : (
          <>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Accept
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModifyReview;
