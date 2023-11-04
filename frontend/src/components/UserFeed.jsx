import React, { useState, useEffect } from "react";
import "../css/UserFeed.css";
import "../css/Transitions.css";
import { CSSTransition } from "react-transition-group";
import logo from "../assets/logo.png";
import gyozas from "../assets/gyozas.jpg";
import { Link, useHistory, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";

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
    <Container fluid className="bg-image min-vh-100">
      <Row className="bg-danger text-white">
          <Col sm={1} className="py-2"> 
            <Image src={logo} alt="KASULÀ" fluid />
            </Col>
            <Col sm={9}></Col>
            <Col sm={2}>
              <div id='buttons-group' className="mt-4">
                <button onClick={() => navigate("/")}>
                  Log In
                </button>
                <button onClick={() => navigate("/postRecipe")}>
                  Post Recipe
                </button>
                <button onClick={() => navigate("/logout")}>
                  Log Out
                </button>
              </div>
            </Col>
      </Row>
      <Container>
        <Row>
          <Col sm={1}></Col>
          <Col sm={10}>
          <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
          <div className="recipe-container-user-feed_1 mt-5">
            {recipes.map((recipe) => (
              <Link key={recipe._id} to={`/RecipeDetail/${recipe._id}`} className="recipe-link">
                <div className="mt-4 p-3 bg-white shadow rounded d-flex align-items-center overflow-hidden" id='recipes-list'>
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
          </Col>
          <Col sm={1}></Col>
        </Row>
      </Container>
    </Container>
  );
}

export default UserFeed;
