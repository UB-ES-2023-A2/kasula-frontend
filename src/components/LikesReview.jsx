// LikesReview.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./AuthContext";


function LikesReview({ recipeId, reviewId, initialLikes, likedBy, reloadReviews }) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const currentUserUsername = localStorage.getItem('currentUser');
  const [hasLikedByUser, setHasLikedByUser] = useState(likedBy.includes(currentUserUsername));


  const { token } = useAuth();


  const handleLikeClick = async () => {
    if (hasLiked || hasLikedByUser) {
        alert("This review already has your like");
        return;
      }
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
    reloadReviews();
  };

  return (
    <div className="d-flex align-items-center">
      <span className="mr-4">{likes}</span>
      <FontAwesomeIcon
        className="ml-4"
        icon={faThumbsUp}
        onClick={handleLikeClick}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}

export default LikesReview;
