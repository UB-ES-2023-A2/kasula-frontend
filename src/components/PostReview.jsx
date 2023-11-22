import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import {
  StarFill,
  Star
} from "react-bootstrap-icons";

const PostReview = ({ id, show, onHide, reloadReviews }) => {
  const [username, setUsername] = useState('');
  const [review, setReview] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [data2, setData2] = useState(null);
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
          setData2(data);
          setUsername(data?.username);
          console.log(">>>>IdPostReview:", id)
        })
        .catch((error) => console.error("Error:", error));
  }, [id])

  const handleFileChange = (event) => {
    const selectedImage= event.target.files[0];
    setImage(selectedImage);
  };

  const handlePostReview = async () => {
    const reviewData = {
      username: username,
      comment: review,
      rating: difficulty,
    };

    const formData = new FormData();
    formData.append("review", JSON.stringify(reviewData));

    if (image) {
      formData.append("file", image);
    }
    console.log(">>>>formD1: ", reviewData)
    console.log(">>>>formD: ", formData)

     try {
      console.log(">>>ID: ", id)
       const response = await fetch(process.env.REACT_APP_API_URL + `/review/${id}`, {
         method: "POST",
         headers: {
           Authorization: `Bearer ${token}`,
         },
         body: formData,
       });

       const data = await response.json();
       console.log(">>>DATA despues del post:", data)
       if (response.ok) {
         console.log(">>>Post hecho: ", data)
       } else{
        console.log(">>>Response KO: ", data)
       }
     } catch (error) {
       console.log("HA FALLADO EL POST")
     }
    setReview('');
    setImage(null);

    onHide();
    reloadReviews();
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
