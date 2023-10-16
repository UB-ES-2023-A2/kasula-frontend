import React from "react";
import "../css/RecipeDetail.css";
import logo from "../assets/logo.svg";
import comida from "../assets/comida1.jpg";

function RecipeDetail() {
  return (
    <div className="recipe-detail-container">
      {/* Encabezado (mismo que el de App) */}
      <header className="header">
        <img src={logo} alt="Kasula" className="logo" />
        <h1>Kasula</h1>
      </header>

      {/* Cuadrado para el contenido de receta */}
      <div className="recipe-square">
        {/* Contenido de detalle de receta */}
        <div className="recipe-content">
          {/* Imagen de la receta (a la izquierda) */}
          <img
            src={comida}
            alt="Imagen de la receta"
            className="recipe-image"
          />

          {/* Detalles de la receta (ingredientes y pasos) */}
          <div className="recipe-details">
            {/* Caja de ingredientes */}
            <div className="ingredient-box">
              <h2>Ingredientes</h2>
              <ul>
                <li>Ingrediente 1</li>
                <li>Ingrediente 2</li>
                <li>Ingrediente 2</li>
                <li>Ingrediente 2</li>
                <li>Ingrediente 2</li>
                {/* Agrega más ingredientes según sea necesario */}
              </ul>
            </div>

            {/* Caja de pasos */}
            <div className="step-box">
              <h2>Pasos</h2>
              <ol>
                <li>Paso 1: Realiza esta acción.</li>
                <li>Paso 2: Realiza otra acción.</li>
                <li>Paso 2: Realiza otra acción.</li>
                <li>Paso 2: Realiza otra acción.</li>
                <li>Paso 2: Realiza otra acción.</li>
                {/* Agrega más pasos según sea necesario */}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
