import React, { useState, useEffect } from "react";
import "../css/RecipeDetail.css";
import "../css/Transitions.css";
import logo from "../assets/logo.png";
import { useParams } from "react-router-dom";
import spaghettiCarbonaraCover from '../assets/spaghetti_carbonara_cover.jpg';
import vegetableStirFryCover from '../assets/vegetable_stir_fry_cover.jpg';
import chickenAlfredoCover from '../assets/chicken_alfredo_cover.jpg';
import { CSSTransition } from "react-transition-group";
import gyozas from '../assets/gyozas.jpg';
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Card } from "react-bootstrap";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});

  const imageMap = {
    '../assets/spaghetti_carbonara_cover.jpg': spaghettiCarbonaraCover,
    '../assets/vegetable_stir_fry_cover.jpg': vegetableStirFryCover,
    '../assets/chicken_alfredo_cover.jpg': chickenAlfredoCover,
    '../assets/gyozas.jpg': gyozas
  };
  
  function getImage(filename) {
    return imageMap[filename] || gyozas;
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
    <div className="container mt-5">
        <Card className="text-center fixed-top border-0">
          <Card.Header className="bg-danger text-white d-flex align-items-center rounded-0">
            <img src={logo} alt="KASULÀ" className="img-fluid logo_recipe_detail" />
            <h1 className="h1_recipe_detail mx-auto my-auto">KASULÀ</h1>
          </Card.Header>
        </Card>
      <div className="bg-image">
        <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
          <div className="recipe-square-detail mt-8 p-3">
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
    </div>
  );
}

export default RecipeDetail;
