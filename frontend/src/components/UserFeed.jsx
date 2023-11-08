import React, { useState, useEffect } from "react";
import "../css/UserFeed.css";
import "../css/Transitions.css";
import { CSSTransition } from "react-transition-group";
import logo from "../assets/logo.png";
import gyozas from "../assets/gyozas.jpg";
import { Link, useHistory, useNavigate } from "react-router-dom";

function UserFeed() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/recipe/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRecipes(data);
      })
      .catch((error) => console.error("Error al obtener recetas:", error));
  }, []);

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
                src={recipe.image ? recipe.image : gyozas}
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
