// ModifyReview.js
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from "./AuthContext";

const ModifyReview = ({ show, reviewId, recipeId, onHide, reloadReviews, funct }) => {
  const [newComment, setNewComment] = useState('');
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
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/review/${recipeId}/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
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

  const handleConfirmDelete = () => {
    // Aquí puedes agregar lógica adicional antes de confirmar la eliminación
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
        ) : (
          <p>Are you sure you want to delete the review?</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {funct === 'Edit' ? (
            <Button variant="primary" onClick={handleUpdateReview}>
                Actualizar
            </Button>
        ) : (
          <>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Aceptar
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModifyReview;
