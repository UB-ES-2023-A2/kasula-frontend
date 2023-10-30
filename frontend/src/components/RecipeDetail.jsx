import React, { useState, useEffect } from "react";
import "../css/RecipeDetail.css";
import "../css/Transitions.css";
import logo from "../assets/logo.png";
import { useParams } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import gyozas from '../assets/gyozas.jpg';
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Container, Row, Col, Image } from "react-bootstrap";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});

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
  
  function getImage(filename) {
    return gyozas;
  }  

  return (
      <Container fluid className="bg-image min-vh-100">
          <Row className="bg-danger text-white">
            <Col sm={1} className="py-2"> 
              <Image src={logo} alt="KASULÀ" fluid />
              </Col>
              <Col sm={11}></Col>
          </Row>
          <Container>
            <Row>
              <Col sm={2}></Col>
              <Col sm={8}>
              <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
                <Container id='recipe-container' className="mt-5 text-center rounded box-shadow" style={{ backgroundColor: '#ffb79fe0'}}>
                  <Row>
                    <Col xs={12} md={6} lg={6}>
                      <Col xs={10}>
                        <img
                          src={getImage(recipe.image)}
                          alt={recipe.name}
                          className="img-fluid mx-3 my-4 box-shadow"
                          style={{ height: 'auto' }}
                        />
                        </Col>
                      <Col xs={12}>
                        <h2 style={{ marginBottom: '1rem' }}>{recipe.name}</h2>
                      </Col>
                      <Col md={10}>
                        <div id='info-box' className="mt-5 pt-2 bg-light box-shadow">
                          <h4>Más información</h4>
                          <div id='difficultyStars' className="d-flex align-items-center my-2 mx-3">
                            <h5>Difficulty:</h5>
                            <div id='allStars' className="d-flex ms-2 mb-1">
                              {Array(recipe.difficulty || 0).fill().map((_, index) => (
                                <span key={index} className="star">&#9733;</span>
                              ))}
                            </div>
                          </div>
                          <div id='timeCooking' className="d-flex align-items-center my-2 mx-3">
                            <h5>Time:</h5>
                            <p id="time" className="fs-5 fw-bold mt-2">{recipe.cooking_time}</p>
                          </div>
                        </div>
                      </Col>
                    </Col>
                    <Col xs={12} md={6} lg={6}>
                      <Row>
                        <Col xs={12}>
                          <div id='ingredient-box' className="mb-3 mt-3 py-2 bg-light box-shadow">
                            <h3>Ingredientes</h3>
                            <ul id='text-in-left'>
                              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                                <li id='orderList' key={index}>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</li>
                              ))}
                            </ul>
                          </div>
                        </Col>
                        <Col xs={12}>
                          <div id='step-box' className="mb-3 bg-danger py-2 text-white box-shadow">
                            <h3>Pasos</h3>
                            <ol id='text-in-left'>
                              {recipe.instructions && recipe.instructions.map((instruction, index) => (
                                <li id='orderList' className='text-white' key={index}>
                                  Step {instruction.step_number + 1}: {instruction.body}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Container>
              </CSSTransition>
              </Col>
              <Col sm={1}></Col>
            </Row>
          </Container>
      </Container>
  );
}

export default RecipeDetail;
