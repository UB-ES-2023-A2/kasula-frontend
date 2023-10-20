import React, { useState, useEffect } from "react";
import "../css/UserFeed.css";
import "../css/Transitions.css";
import { CSSTransition } from "react-transition-group";
import logo from "../assets/logo.png";
import { Link, useHistory, useNavigate } from "react-router-dom";
import spaghettiCarbonaraCover from '../assets/spaghetti_carbonara_cover.jpg';
import vegetableStirFryCover from '../assets/vegetable_stir_fry_cover.jpg';
import chickenAlfredoCover from '../assets/chicken_alfredo_cover.jpg';

function UserFeed() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/recipe/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRecipes(data);
      })
      .catch((error) => console.error("Error al obtener recetas:", error));
  }, []);

  const imageMap = {
    '../assets/spaghetti_carbonara_cover.jpg': spaghettiCarbonaraCover,
    '../assets/vegetable_stir_fry_cover.jpg': vegetableStirFryCover,
    '../assets/chicken_alfredo_cover.jpg': chickenAlfredoCover
  };
  
  function getImage(filename) {
    return imageMap[filename] || 'default_image_link_if_needed.jpg';
  }

  return (
    <div className="user-feed-container">
      <header class="header_user_feed">
        <img src={logo} alt="KASULÀ" className="logo_user_feed" />
        <h1 class="h1_user_feed">KASULÀ</h1>
        <button class="post-recipe-button" onClick={() => navigate("/postRecipe")}>
          Post Recipe
        </button>
        <button class="logout_button_user_feed" onClick={() => navigate("/logout")}>
          Log Out
        </button>
      </header>
      <div className="background-image"></div>
      <CSSTransition
        in={true} 
        timeout={500} 
        classNames="slideUp"
        appear
        >
      <div className="recipe-container-user-feed_1">
        {recipes.map((recipe) => (
          <Link key={recipe._id} to={`/RecipeDetail/${recipe._id}`} className="recipe-link">
            <div className="recipe-container-user-feed">
              <p className="recipe-name">{recipe.name}</p>
              <img
                src={getImage(recipe.image)}
                alt={recipe.name}
                className="recipe-image-user-feed"
              />
            </div>
          </Link>
        ))}
      </div>
      </CSSTransition>
    </div>
  );
}

export default UserFeed;
