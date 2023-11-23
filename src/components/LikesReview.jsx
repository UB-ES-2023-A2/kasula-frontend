// LikesReview.js
import React, { useState } from "react";
import {Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./AuthContext";


function LikesReview({ recipeId, reviewId, initialLikes, likedBy, reloadReviews }) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const currentUserUsername = localStorage.getItem('currentUser');
  const [hasLikedByUser, setHasLikedByUser] = useState(likedBy.includes(currentUserUsername));
  const { token } = useAuth();


  const handleLikeClick = async () => {


    if (hasLiked || hasLikedByUser) {
      console.log(">>>By: ", hasLikedByUser)
      console.log(">>>List: ", likedBy)
      likes > 0 ? setLikes(likes - 1) : setLikes(0);  
      setHasLiked(false);  
      setHasLikedByUser(false);    
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/review/unlike/${recipeId}/${reviewId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
          },
          }
        );
  
        const data = await response.json();
        if (!response.ok) {
          console.error("Error al enviar el dislike:", data);
        }
      } catch (error) {
        console.error("Error en la solicitud de dislike:", error);
      }
    }else{
      
      console.log(">>>By2: ", hasLikedByUser)
      console.log(">>>List2: ", likedBy)
      setLikes(likes + 1);
      setHasLiked(true);
      setHasLikedByUser(true);    
    // Realiza la lógica para enviar el like a la base de datos
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/review/like/${recipeId}/${reviewId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
        },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.error("Error al enviar el like:", data);
      }
    } catch (error) {
      console.error("Error en la solicitud de like:", error);
    }
  }
    reloadReviews();
  };

  return (
    <Row>
      <Col sm={3}>
        <FontAwesomeIcon
          icon={faHeart}
          onClick={handleLikeClick}
          style={{ cursor: "pointer" }}
        />
      </Col>
      <Col sm={8}>
        <span className="">{likes} likes</span>
      </Col>
      <Col sm={1}></Col>
    </Row>  
       );
}

export default LikesReview;
