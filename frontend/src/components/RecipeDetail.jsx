import React, { useState, useEffect } from "react";
import "../css/RecipeDetail.css";
import logo from "../assets/logo.png";
import { useParams } from "react-router-dom";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/recipe/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRecipe(data);
      })
      .catch((error) => console.error("Error al obtener receta:", error));
  }, [id]);

  return (
    <div className="recipe-detail-container">
      <header className="header">
        <img src={logo} alt="Kasula" className="logo" />
        <h1>Kasula</h1>
      </header>
      <div className="background-image"></div>
      <div className="recipe-square">
        <div className="recipe-content">
          <div className="image-info-container">
            <img
              src={recipe.image || "default_image_link_if_needed.jpg"}
              alt={recipe.name}
              className="recipe-image2"
            />

            <div className="info-box">
              <h2>Más información</h2>
              <div className="info-section">
                <h3>Difficulty:</h3>
                <div className="difficulty-stars">
                  {/* Suponiendo que difficulty es un número del 1 al 5, renderizamos las estrellas */}
                  {Array(recipe.difficulty || 0).fill().map((_, index) => (
                    <span key={index} className="star">&#9733;</span>
                  ))}
                </div>
              </div>
              <div className="info-section">
                <h3>Time:</h3>
                <p id="time">{recipe.cooking_time}</p>
              </div>
            </div>
          </div>

          <div className="recipe-details">
            <div className="ingredient-box">
              <h2>Ingredientes</h2>
              <ul>
              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => <li key={index}>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</li>)}
              </ul>
            </div>

            <div className="step-box">
              <h2>Pasos</h2>
              <ol>
                  {recipe.instructions && recipe.instructions.map((instruction, index) => (
                      <li key={index}>
                          Step {instruction.step_number + 1}: {instruction.body}
                      </li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
