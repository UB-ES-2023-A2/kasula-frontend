import React, { useState, useEffect } from "react";
import "../css/UserFeed.css";
import "../css/Transitions.css";
import { CSSTransition } from "react-transition-group";
import logo from "../assets/logo.png";
import gyozas from "../assets/gyozas.jpg";
import { Link, useHistory, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";

function UserFeed() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(localStorage.getItem("logged") === "true");


  useEffect(() => {
    setIsLogged(localStorage.getItem("logged") === "true");
    fetch(process.env.REACT_APP_API_URL + "/recipe/")
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
            <Col sm={8}></Col>
            <Col sm={3}>
              <div id='buttons-group' className="mt-4">
                {!isLogged && ( 
                  <button className='btn btn-light' onClick={() => navigate("/login")}>
                    Log In
                  </button>
                )}
                {isLogged && (<>
                {console.log(">>>>>>LOGEADO", localStorage.getItem("logged"))}
                 <button className='btn btn-light me-2' onClick={() => navigate("/postRecipe")}>
                  Post Recipe
                </button>
                <button className='btn btn-light' onClick={() => navigate("/logout")}>
                  Log Out
                </button>
                </>
                )}
              </div>
            </Col>
      </Row>
      <Container>
        <Row>
          <Col sm={1}></Col>
          <Col sm={10}>
          <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
          <div className="recipes-container mt-5">
            {recipes.map((recipe) => (
              <Link key={recipe._id} to={`/RecipeDetail/${recipe._id}`} className="recipe-link">
                <div className="mt-4 p-3 shadow rounded d-flex align-items-center overflow-hidden" id='recipes-list'>
                  <Row className="align-items-center">
                    <Col sm={9}>
                      <p className="font-large-bold fs-5 text-dark">{recipe.name}</p>
                    </Col>
                    <Col sm={3}>
                      <Image
                        src={recipe.image ? recipe.image : gyozas}
                        alt={recipe.name}
                        fluid
                      />
                    </Col>
                  </Row>
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
