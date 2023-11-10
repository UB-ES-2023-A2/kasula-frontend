import React, { useState, useEffect } from "react";
import "../css/UserFeed.css";
import { useAuth } from "./AuthContext";
import "../css/Transitions.css";
import { CSSTransition } from "react-transition-group";
import logo from "../assets/logo.png";
import gyozas from "../assets/gyozas.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Modal, Button} from "react-bootstrap";
import { ExclamationTriangleFill } from "react-bootstrap-icons";

function UserFeed() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(localStorage.getItem("logged") === "true");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsLogged(localStorage.getItem("logged") === "true");
    fetch(process.env.REACT_APP_API_URL + "/recipe/")
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => console.error("Error al obtener recetas:", error));
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.setItem('logged', 'false'); // This will update the localStorage
    setIsLogged(false); // This will update the state within the app
    handleCloseModal(); // This will close the modal
  };  

  return (
    <div>
      <Container fluid className="min-vh-100">
        <Row className="bg-danger text-white">
          <Col sm={1} className="py-2">
            <Image src={logo} alt="KASULÀ" fluid />
          </Col>
          <Col sm={9}></Col>
          <Col sm={2}>
            <div id='buttons-group' className="mt-4">
              {!isLogged && (
                <button className='btn btn-light' onClick={() => navigate("/login")}>
                  Log In
                </button>
              )}
              {isLogged && (<>
                <button 
                  className='btn btn-light me-2' 
                  onClick={() => {
                      navigate("/postRecipe");
                  }}>
                  Post Recipe
                </button>
                <button className='btn btn-light' onClick={() => handleOpenModal()}>
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
                  {recipes && recipes.length > 0 ? (
                    recipes.map((recipe) => (
                      <Link key={recipe._id} to={`/RecipeDetail/${recipe._id}`} className="text-decoration-none">
                        <div className="mt-4 p-3 shadow rounded d-flex align-items-center overflow-hidden" id='recipes-list'>
                          <Row className="align-items-center">
                            <Col sm={9}>
                              <p className="font-large-bold fs-5 text-dark mb-0">{recipe.name}</p>
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
      </Container>
      <Modal show={showModal} size="sm" onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tancar la sessió</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="text-center mb-4">
              <ExclamationTriangleFill className="text-warning" size={100} />
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
