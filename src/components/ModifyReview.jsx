// ModifyReview.js
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const ModifyReview = ({ reviewId, recipeId, onHide, reloadReviews }) => {
  const [newComment, setNewComment] = useState('');

  const handleUpdateReview = async () => {
    // Realizar la lógica para actualizar la revisión usando el endpoint PUT
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/review/${recipeId}/${reviewId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment: newComment }),
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
    // Realizar la lógica para eliminar la revisión usando el endpoint DELETE
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/review/${recipeId}/${reviewId}`,
        {
          method: 'DELETE',
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

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar o eliminar revisión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nuevo Comentario</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Escribe tu nuevo comentario aquí"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDeleteReview}>
          Eliminar
        </Button>
        <Button variant="primary" onClick={handleUpdateReview}>
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModifyReview;
