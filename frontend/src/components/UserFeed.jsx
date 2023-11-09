import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import "../css/UserFeed.css";
import "../css/Transitions.css";
import { CSSTransition } from "react-transition-group";
import logo from "../assets/logo.png";
import gyozas from "../assets/gyozas.jpg";
import { Link, useHistory, useNavigate } from "react-router-dom";
//React Components
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Image,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { ArrowLeft, CheckCircleFill, Eye, EyeSlash, ExclamationTriangleFill } from "react-bootstrap-icons";

function UserFeed() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [showLogout, setLogout] = useState(false);
  const { token, logout } = useAuth();

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/recipe/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRecipes(data);
      })
      .catch((error) => console.error("Error al obtener recetas:", error));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHide = () => {
    setLogout(false);
  };

  return (
    <div>
    <div className="user-feed-container">
      <header class="header_user_feed">
        <img src={logo} alt="KASULÀ" className="logo_user_feed" />
        <h1 class="h1_user_feed">KASULÀ</h1>
        <button class="post-recipe-button" onClick={() => navigate("/postRecipe")}>
          Post Recipe
        </button>
        <button class="logout_button_user_feed" onClick={() => setLogout(true)}>
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
    <Modal show={showLogout} size="sm" onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>Tancar la sessió</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="text-center mb-4">
              <ExclamationTriangleFill className="text-warning" size={100}/>
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              <p className="ms-0">Segur que vols tancar sessió?</p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="danger" onClick={handleLogout}>
              Tancar
          </Button>
      </Modal.Footer>
      </Modal>
    </div>
  );
  
}

export default UserFeed;
