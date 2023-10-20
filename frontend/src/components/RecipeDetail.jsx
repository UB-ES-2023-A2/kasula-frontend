import React, { useState, useEffect } from "react";
import "../css/RecipeDetail.css";
import logo from "../assets/logo.png";
import { useParams } from "react-router-dom";
import spaghettiCarbonaraCover from '../assets/spaghetti_carbonara_cover.jpg';
import vegetableStirFryCover from '../assets/vegetable_stir_fry_cover.jpg';
import chickenAlfredoCover from '../assets/chicken_alfredo_cover.jpg';
import { CSSTransition } from "react-transition-group";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});

  const imageMap = {
    '../assets/spaghetti_carbonara_cover.jpg': spaghettiCarbonaraCover,
    '../assets/vegetable_stir_fry_cover.jpg': vegetableStirFryCover,
    '../assets/chicken_alfredo_cover.jpg': chickenAlfredoCover
  };
  
  function getImage(filename) {
    return imageMap[filename] || 'default_image_link_if_needed.jpg';
  }  

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/recipe/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRecipe(data);

        // Log the value of recipe.image
        console.log("recipe.image:", data.image);
      })
      .catch((error) => console.error("Error al obtener receta:", error));
  }, [id]);

  return (
    <div className="recipe-detail-container">
      <header className="header_recipe_detail">
        <img src={logo} alt="KASULÀ" className="logo_recipe_detail" />
        <h1 class="h1_recipe_detail">KASULÀ</h1>
      </header>
      <div className="background-image-detail"></div>
      <CSSTransition
        in={true} 
        timeout={500} 
        classNames="slideUp"
        appear
        >
      <div className="recipe-square-detail">
        <div className="recipe-content">
          <div className="image-info-container">
            <img
              src={getImage(recipe.image)}
              alt={recipe.name}
              className="recipe-image-recipeDetail"
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
      </CSSTransition>
    </div>
  );
}

export default RecipeDetail;
