import React, { useState, useEffect } from "react";
import "../css/UserFeed.css";
import logo from "../assets/logo.png";
import { Link, useHistory, useNavigate } from "react-router-dom";

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

  return (
    <div className="user-feed-container">
      <header className="header">
        <img src={logo} alt="Kasula" className="logo" />
        <h1>Kasula</h1>
      </header>
      <div className="background-image"></div>
      <div className="recipe-container">
        {recipes.map((recipe) => (
          <Link key={recipe._id} to={`/RecipeDetail/${recipe._id}`} className="recipe-link">
            <div className="recipe">
              <p className="recipe-name">{recipe.name}</p>
              <img
                src={recipe.image || "default_image_link_if_needed.jpg"}
                alt={recipe.name}
                className="recipe-image"
              />
            </div>
          </Link>
        ))}
      </div>
      <button className="post-recipe-button" onClick={() => navigate("/postRecipe")}>
        Post Recipe
      </button>
    </div>
  );
}

export default UserFeed;
