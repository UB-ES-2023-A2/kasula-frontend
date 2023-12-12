import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
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
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);



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
        })
        .catch((error) => console.error("Error:", error));
  }, [id])

  const handleFileChange = (event) => {
    const selectedImage= event.target.files[0];
    setImage(selectedImage);
  };

  const handleReviewChange = (e) => {
    const inputReview = e.target.value;
    setReview(inputReview);
    setCharacterCount(inputReview.length);
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
     try {
       const response = await fetch(process.env.REACT_APP_API_URL + `/review/${id}`, {
         method: "POST",
         headers: {
           Authorization: `Bearer ${token}`,
         },
         body: formData,
       });
      // 403 owner  
      // 400 ya review
       const data = await response.json();
       if (response.ok) {
         console.log(">>>Post hecho: ", data)
       } else{
        setError(data.detail);
        setShowErrorModal(true);
      }
     } catch (error) {
      //  alert("HA FALLADO EL POST")
       setError(error);
       setShowErrorModal(true);
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


  return (<>
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton className="fw-bold" style={{ backgroundColor: "#ffb79fe0" }}> 
        <Modal.Title>Post a review</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#ffb79fe0" }}>
        <Form>
          <Form.Group className="mb-3 fw-bold">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your review here"
              value={review}
              onChange={handleReviewChange}
              style={{ borderColor: characterCount > 80 ? 'red' : null }}
            />
            {characterCount > 80 && (
              <div className="text-danger">You exceeded 80 characters.</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3 fw-bold bg-white p-3">
            <Form.Label>Rating</Form.Label>
            <div>{renderStars(difficulty)}</div>
          </Form.Group>

          <Form.Group className="mb-3 fw-bold">
            <Form.Label>Rating</Form.Label>
            <div className='bg-white pb-1'>{renderStars(difficulty)}</div>
          </Form.Group>

          <Form.Group className="mb-3 fw-bold">
            <Form.Label>Select Image</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#ffb79fe0"}}>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button
        className='bg-danger fw-bold border-secondary text-white'
          variant="primary"
          onClick={handlePostReview}
          disabled={characterCount > 80}
        >
          Post Review
        </Button>
      </Modal.Footer>
    </Modal>
     <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
     <Modal.Header closeButton>
       <Modal.Title>Error</Modal.Title>
     </Modal.Header>
     <Modal.Body>
       <Alert variant="danger">
         {error && <p>{error}</p>}
       </Alert>
     </Modal.Body>
     <Modal.Footer>
       <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
         Close
       </Button>
     </Modal.Footer>
   </Modal>
   </>
  );
};

export default PostReview;
