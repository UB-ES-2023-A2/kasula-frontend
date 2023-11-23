import React, { useState, useEffect } from "react";
import "../css/common.css";
import "../css/Transitions.css";
import chefIcon from "../assets/icons/chef.png"
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { CSSTransition } from "react-transition-group";
import gyozas from '../assets/gyozas.jpg';
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Container, Row, Col, Image, Offcanvas, Button } from "react-bootstrap";
import { StarFill, Stopwatch, Lightning, FolderSymlinkFill, Heart, HeartFill } from "react-bootstrap-icons";
import ImageModal from "./ImageModal";
import Reviews from "./Reviews";


function RecipeDetail() {
  const { token } = useAuth();
  const [user, setUser] = useState({});
  const { id } = useParams();
  const [recipe, setRecipe] = useState({images: []});
  const [showModal, setShowModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isLiked, setIsLiked] = useState(false);


  useEffect(() => {
    getRecipe();
    getLoggedUser();
  }, [id]);

  const getLoggedUser = () => {
    fetch(process.env.REACT_APP_API_URL + "/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User data:", data);
        setUser(data);
        getIsLiked(data);
      })
      .catch((error) => console.error("Error al obtener recetas:", error));
  };

  const getRecipe = () => {
    fetch(process.env.REACT_APP_API_URL + `/recipe/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setRecipe(data);
      })
      .catch((error) => console.error("Error al obtener receta:", error));
  };


  const getIsLiked = (user) => {
    fetch(process.env.REACT_APP_API_URL + `collection/favorites/${user.username}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Favorites: ", data.recipe_ids);
        const recipeIds = data.recipe_ids;
        console.log(recipeIds);
        setIsLiked(recipeIds.includes(id));
      })
      .catch((error) => console.error("Error al obtener receta:", error));
  };

  const setLiked = () => {
    setIsLiked(true);
    fetch(process.env.REACT_APP_API_URL + `collection/favorites/add_recipe/${recipe._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error al obtener receta:", error);
        setIsLiked(false);
      });
  };

  const setUnliked = () => {
    fetch(process.env.REACT_APP_API_URL + `/collection/favorites/remove_recipe/${recipe._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsLiked(false);
      })
      .catch((error) => console.error("Error al obtener receta:", error));
  };
  
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
          recipeImage={recipe.main_image ?? gyozas}
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
                        src={recipe.main_image ?? gyozas}
                        className="img-fluid shadow mb-3"
                        onClick={handleOpenModal}
                        style={{ cursor: "pointer" }}
                        fluid
                      />
                      <h2 style={{ marginBottom: '1rem' }}>{recipe.name}</h2>
                    </Col>
                    <Col md={6}>
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
                  <Col xs={12} md={6} className="p-4">
                    <Row>
                      <Col xs={12} className="d-flex mb-4">
                        <div className="ms-auto d-flex">
                          <div className="me-3" role="button" onClick={isLiked ? setUnliked : setLiked}>
                            <span>
                              {isLiked ? (
                                <HeartFill className="fs-4" style={{color: "red"}} />
                              ) : (
                                <Heart className="fs-4" />
                              )}
                            </span>
                          </div>
                          <div className="colorless-span-button" role="button">
                            <span className="fs-6 me-2">Add to collection</span>
                            <FolderSymlinkFill className="fs-4" />
                          </div>
                        </div>
                      </Col>
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
          {/* <Button className="fs-6 mt-2" onClick={handleOpenModal}>Post review</Button>
          </div> */}
        </Offcanvas.Header>
        <Offcanvas.Body style={{ backgroundColor: '#ffb79fe0' }}>
          <Reviews id={id}/>
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}

export default RecipeDetail;
