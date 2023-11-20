import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import {
  StarFill,
  Star
} from "react-bootstrap-icons";

const PostComment = ({ show, onHide }) => {
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/user/me", {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setUsername(data?.username);
        })
        .catch((error) => console.error("Error:", error));
  }, [])
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handlePostComment = () => {
    // Enviaremos con un post el comentario
    // limpiamos los campos
    setUsername('');
    setComment('');
    setFile(null);

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
          onClick={() => setDifficulty(i)}
        >
          {i <= amount ? <StarFill /> : <Star />}
        </span>
      );
    }
    return stars;
  };


  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Post a review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            {/* En un futuro esto lo traeremos por props, el usuario */}
            <Form.Label>Username</Form.Label>
            <p className='fw-bold'>{username}</p>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your comment here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <div>{renderStars(difficulty)}</div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Image</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handlePostComment}>
          Post Review
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PostComment;
