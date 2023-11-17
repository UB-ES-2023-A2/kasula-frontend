import React, { useState, useEffect } from "react";
import "../css/common.css";
import "../css/Transitions.css";
import chefIcon from "../assets/icons/chef.png"
import { useParams } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import gyozas from '../assets/gyozas.jpg';
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Container, Row, Col, Image, Offcanvas, Button } from "react-bootstrap";
import { StarFill, Stopwatch, Lightning } from "react-bootstrap-icons";
import ImageModal from "./ImageModal";
import Reviews from "./Reviews";


function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);


  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + `/recipe/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setRecipe(data);
      })
      .catch((error) => console.error("Error al obtener receta:", error));
  }, [id]);
  
  const handleOpenModal = () => {
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleToggleReviews = () => {
    setShowReviews(!showReviews);
  };
  

  return (
      <Container fluid className="min-vh-100">
        <ImageModal
          show={showModal}
          onHide={handleCloseModal}
          recipeImage={recipe.image ?? gyozas}
          recipeName={recipe.name}
        />
        <Container>
          <Row>
            <Col sm={12}>
            <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
              <Container className="mt-5 text-center box-rounded shadow" style={{ backgroundColor: '#ffb79fe0'}}>
                <Row>
                  <Col xs={12} md={6} lg={6} className="p-4">
                    <Col xs={12}>
                      <Image
                        src={recipe.image ?? gyozas}
                        alt={recipe.name}
                        className="img-fluid shadow mb-3"
                        onClick={handleOpenModal}
                        style={{ cursor: "pointer" }}
                        fluid
                      />
                      <h2 style={{ marginBottom: '1rem' }}>{recipe.name}</h2>
                    </Col>
                    <Col md={12}>
                      <div className="mt-5 pb-3 pt-2 bg-light box-shadow">
                        <h4>Más información</h4>
                        <div className="d-flex align-items-center my-2 mx-3">
                          <h5><Image src={chefIcon} style={{height:'24px', width: '24px'}} fluid/> {Array(recipe.difficulty || 0).fill().map((_, index) => (
                              <span key={index} className="fs-5 ms-1 text-center"><StarFill style={{color: 'gold'}}></StarFill></span>
                            ))}</h5>
                        </div>
                        <div className="d-flex align-items-center my-2 mx-3">
                          <h5><Stopwatch/></h5>
                          <span className="fs-6 fw-bold ms-2 text-muted">{recipe.cooking_time} min</span>
                        </div>
                        <div className="d-flex align-items-center mt-2 mx-3">
                          <h5><Lightning/></h5>
                          <span className="fs-6 fw-bold ms-2 text-muted">{recipe.energy ?? 'No info of'} kcal</span>
                        </div>
                        <Button className="mt-3" onClick={handleToggleReviews}>
                          Toggle Reviews
                        </Button>
                      </div>
                    </Col>
                  </Col>
                  <Col xs={12} md={6} lg={6} className="p-4">
                    <Row>
                      <Col xs={12}>
                        <div className="mb-3 py-2 bg-light box-shadow">
                          <h3>Ingredientes</h3>
                          <ul className='text-start'>
                            {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                              <li className='mb-2 fs-6 fw-bold text-muted' key={index}>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</li>
                            ))}
                          </ul>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="mb-3 bg-danger py-2 text-white box-shadow">
                          <h3>Pasos</h3>
                          <ol className="text-start">
                            {recipe.instructions && recipe.instructions.map((instruction, index) => (
                              <li className='mb-2 fs-6 fw-bold text-white' key={index}>
                                {instruction.body}
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
          </Row>
        </Container>
      {/* Offcanvas para mostrar los comentarios */}
      <Offcanvas show={showReviews} onHide={() => setShowReviews(false)} placement="end">
        <Offcanvas.Header closeButton style={{ backgroundColor: '#ffb79fe0' }}>
          {/* <div> */}
          <Offcanvas.Title className="fs-2 mt-3">Reviews</Offcanvas.Title>
          {/* <Button className="fs-6 mt-2" onClick={handleOpenModal}>Post comment</Button>
          </div> */}
        </Offcanvas.Header>
        <Offcanvas.Body style={{ backgroundColor: '#ffb79fe0' }}>
          <Reviews />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}

export default RecipeDetail;
