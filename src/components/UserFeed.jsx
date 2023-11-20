//React
import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

//Bootstrap
import { Link } from "react-router-dom";
import { Container, Row, Col, Image} from "react-bootstrap";

//CSS
import "../css/UserFeed.css";
import "../css/Transitions.css";

//Assets
import gyozas from "../assets/gyozas.jpg";


function UserFeed() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = () => {
    fetch(process.env.REACT_APP_API_URL + "/recipe/")
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => console.error("Error al obtener recetas:", error));
  }

  return (
      <Container fluid className="pb-5">
          <Row>
            <Col sm={1}></Col>
            <Col sm={10}>
              <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
                <div className="recipes-container mt-5">
                  {recipes && recipes.length > 0 ? (
                    recipes.map((recipe) => (
                      <Link key={recipe._id} to={`/RecipeDetail/${recipe._id}`} className="text-decoration-none">
                        <div className="mt-4 ps-3 py-0 pe-0 shadow rounded d-flex align-items-center overflow-hidden" id='recipes-list'>
                          <span className="font-large-bold fs-5 text-dark mb-0">{recipe.name}</span>
                          <Image
                          className="ms-auto"
                            src={recipe.image}
                            alt={recipe.name}
                            width={240}
                            height={180}
                            //fluid
                          />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="alert alert-warning" role="alert">
                      No hay recetas disponibles
                    </div>
                  )}
                </div>
              </CSSTransition>
            </Col>
            <Col sm={1}></Col>
          </Row>
        </Container>
  );

}

export default UserFeed;
