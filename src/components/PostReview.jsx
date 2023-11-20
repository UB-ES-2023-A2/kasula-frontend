import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import {
  StarFill,
  Star
} from "react-bootstrap-icons";

const PostReview = ({ show, onHide }) => {
  const [username, setUsername] = useState('');
  const [review, setReview] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [data, setData] = useState(null);
  const [image, setImage] = useState(null);
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
    const selectedImage= event.target.files[0];
    setImage(selectedImage);
  };

  const handlePostReview = async () => {
    const reviewData = {
      username: username,
      review: review,
      difficulty: difficulty,
    };

    const formData = new FormData();
    formData.append("review", JSON.stringify(reviewData));

    if (image) {
      formData.append("file", image);
    }
    console.log(">>>>formD1: ", reviewData)
    console.log(">>>>formD: ", formData)

    // try {
    //   const response = await fetch(process.env.REACT_APP_API_URL + "/reviews", {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: formData,
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     setSubmitMessage("Recipe posted successfully", data);
    //     setPostRecipeSuccess(true);
    //     onClose();
    //   } else {
    //     setSubmitMessage("Error posting recipe: " + JSON.stringify(data));
    //   }
    // } catch (error) {
    //   setSubmitMessage(JSON.stringify(error));
    //   setPostRecipeSuccess(false);
    // }
    setReview('');
    setImage(null);

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
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your review here"
              value={review}
              onChange={(e) => setReview(e.target.value)}
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
        <Button variant="primary" onClick={handlePostReview}>
          Post Review
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PostReview;
