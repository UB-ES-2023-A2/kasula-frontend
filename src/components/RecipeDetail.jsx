import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/common.css";
import "../css/Transitions.css";
import chefIcon from "../assets/icons/chef.png";
import { useAuth } from "./AuthContext";
import { CSSTransition } from "react-transition-group";
import gyozas from "../assets/gyozas.jpg";
import {
  Container,
  Row,
  Col,
  Image,
  Offcanvas,
  Button,
  Dropdown,
  Modal,
  Toast,
} from "react-bootstrap";
import {
  ArrowLeft,
  StarFill,
  Stopwatch,
  Lightning,
  FolderSymlinkFill,
  Heart,
  HeartFill,
} from "react-bootstrap-icons";
import ImageModal from "./ImageModal";
import Reviews from "./Reviews";
import CollectionCreate from "./CollectionCreate";
import AddRecipeToCollection from "./AddRecipeToCollection";

function RecipeDetail() {
  const { token } = useAuth();
  const [user, setUser] = useState({});
  const { id } = useParams();
  const [recipe, setRecipe] = useState({ images: [] });
  const [showReviews, setShowReviews] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [imageModal, setImageModal] = useState({
    show: false,
  });

  const [createCollectionModal, setCreateCollectionModal] = useState({
    show: false,
    title: "Create new collection",
  });

  const [reloadReviews, setReloadReviews] = useState(null);
  const [reloadRecipeDetail, setreloadRecipeDetail] = useState(null);
  const navigate = useNavigate();

  const [addToCollectionModal, setAddToCollectionModal] = useState({
    show: false,
    title: "Add to collection",
  });

  const [toastData, setToastData] = useState({
    message: "",
    variant: "",
    show: false,
  });

  useEffect(() => {
    getRecipe();
    getLoggedUser();
  }, [id, reloadReviews]);

  const getLoggedUser = () => {
    fetch(process.env.REACT_APP_API_URL + "/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        getIsLiked(data);
      })
      .catch((error) => console.error("Error al obtener recetas:", error));
  };

  const getRecipe = () => {
    fetch(process.env.REACT_APP_API_URL + `/recipe/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
      })
      .catch((error) => console.error("Error al obtener receta:", error));
  };

  const reloadReviewsFunction = () => {
    setReloadReviews(!reloadReviews);
  };

  const getIsLiked = (user) => {
    fetch(
      process.env.REACT_APP_API_URL + `collection/favorites/${user.username}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
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
    fetch(
      process.env.REACT_APP_API_URL +
        `collection/favorites/add_recipe/${recipe._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
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
    fetch(
      process.env.REACT_APP_API_URL +
        `/collection/favorites/remove_recipe/${recipe._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsLiked(false);
      })
      .catch((error) => console.error("Error al obtener receta:", error));
  };

  const handleToggleReviews = () => {
    setShowReviews(!showReviews);
  };

  const handleCloseModal = (setModalState, modalState) => {
    setModalState({
      ...modalState,
      show: false,
    });
  };

  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      className="p-2 me-2 btn-normal"
      role="button"
      ref={ref}
      id="collection-dropdown"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <span className="fs-6 me-2">Add to collection</span>
      <FolderSymlinkFill className="fs-4" />
    </div>
  ));

  return (
    <Container fluid className="min-vh-100">
      <ImageModal
        show={imageModal.show}
        onHide={() => handleCloseModal(setImageModal, imageModal)}
        recipeImage={recipe.main_image ?? gyozas}
        recipeName={recipe.name}
      />
      <Container>
        <Row>
          <Col sm={12}>
            <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
              <Container className="mt-5 text-center box-rounded shadow bg-normal">
                <Row>
                  <Col xs={12} md={1} lg={1} className="p-4">
                    <Button
                      variant="link"
                      className="text-decoration-none fs-3 text-reset my-2"
                      onClick={() => navigate("/")}
                    >
                      <ArrowLeft></ArrowLeft>
                    </Button>
                  </Col>
                  <Col xs={12} md={5} lg={5} className="p-4">
                    <Col xs={11}>
                      <Image
                        src={recipe.main_image ?? gyozas}
                        className="img-fluid shadow mb-3"
                        onClick={() => setImageModal({ show: true })}
                        style={{ cursor: "pointer" }}
                        fluid
                      />
                      <h2 style={{ marginBottom: "1rem" }}>{recipe.name}</h2>
                    </Col>
                    <Col xs={12}>
                      <div className="mt-5 pb-3 pt-2 bg-light box-shadow">
                        <h4>More information</h4>
                        <div className="d-flex align-items-center mt-4 mb-3 mx-2">
                          <StarFill
                            className="mx-2"
                            style={{ color: "red",fontSize: "24px"}}
                          ></StarFill>
                          <span>{recipe?.average_rating?.toFixed(1) || 0}</span>
                        </div>
                        <div className="d-flex align-items-center mt-2 mb-1 mx-3">
                          <h5>
                            <Image
                              src={chefIcon}
                              style={{ height: "24px", width: "24px" }}
                              fluid
                            />{" "}
                            {Array(recipe.difficulty || 0)
                              .fill()
                              .map((_, index) => (
                                <span
                                  key={index}
                                  className="fs-5 ms-1 text-center"
                                >
                                  <StarFill
                                    style={{ color: "gold" }}
                                  ></StarFill>
                                </span>
                              ))}
                          </h5>
                        </div>
                        <div className="d-flex align-items-center mb-1 mx-3">
                          <h5>
                            <Stopwatch />
                          </h5>
                          <span className="fs-6 fw-bold ms-2 text-muted">
                            {recipe.cooking_time} min
                          </span>
                        </div>
                        <div className="d-flex align-items-center mt-2 mx-3">
                          <h5>
                            <Lightning />
                          </h5>
                          <span className="fs-6 fw-bold ms-2 text-muted">
                            {recipe.energy ?? "No info of"} kcal
                          </span>
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
                          <Dropdown>
                            <Dropdown.Toggle
                              as={CustomToggle}
                              variant="null"
                              id="dropdown-basic"
                            />
                            <Dropdown.Menu>
                              <Dropdown.Item
                                eventKey={1}
                                onClick={() => {
                                  setAddToCollectionModal({
                                    show: true,
                                    title: "Add to collection",
                                  });
                                }}
                              >
                                Add to existing collection
                              </Dropdown.Item>
                              <Dropdown.Item
                                eventKey={2}
                                onClick={() => {
                                  setCreateCollectionModal({
                                    show: true,
                                    title: "Create new collection",
                                  });
                                }}
                              >
                                Add to new collection
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                          <div
                            className="p-2"
                            role="button"
                            onClick={isLiked ? setUnliked : setLiked}
                          >
                            <span>
                              {isLiked ? (
                                <HeartFill
                                  className="fs-4"
                                  style={{ color: "red" }}
                                />
                              ) : (
                                <Heart className="fs-4" />
                              )}
                            </span>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="mb-3 py-2 bg-light box-shadow">
                          <h3>Ingredients</h3>
                          <ul className="text-start">
                            {recipe.ingredients &&
                              recipe.ingredients.map((ingredient, index) => (
                                <li
                                  className="mb-2 fs-6 fw-bold text-muted"
                                  key={index}
                                >
                                  {ingredient.name} - {ingredient.quantity}{" "}
                                  {ingredient.unit}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="mb-3 bg-danger py-2 text-white box-shadow">
                          <h3>Steps</h3>
                          <ol className="text-start">
                            {recipe.instructions &&
                              recipe.instructions.map((instruction, index) => (
                                <li
                                  className="mb-2 fs-6 fw-bold text-white"
                                  key={index}
                                >
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
      <Offcanvas
        show={showReviews}
        onHide={() => setShowReviews(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton style={{ backgroundColor: "#ffb79fe0" }}>
          <Offcanvas.Title className="fs-2 mt-3">Reviews</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ backgroundColor: "#ffb79fe0" }}>
          <Reviews id={id} reloadReviews={reloadReviewsFunction} />
        </Offcanvas.Body>
      </Offcanvas>
      <Modal
        show={createCollectionModal.show}
        size="lg"
        onHide={() =>
          handleCloseModal(setCreateCollectionModal, createCollectionModal)
        }
      >
        <Modal.Header closeButton className="bg-normal">
          <Modal.Title className="fs-3 fw-semi-bold">
            {createCollectionModal.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <CollectionCreate
            onClose={() =>
              handleCloseModal(setCreateCollectionModal, createCollectionModal)
            }
            onMessage={(message, variant) => {
              setToastData({
                message: message,
                variant: variant,
                show: true,
              });
            }}
            recipe_id={id}
          ></CollectionCreate>
        </Modal.Body>
      </Modal>
      <Modal
        show={addToCollectionModal.show}
        size="md"
        onHide={() =>
          handleCloseModal(setAddToCollectionModal, addToCollectionModal)
        }
      >
        <Modal.Body className="p-0">
          <AddRecipeToCollection
            onClose={() =>
              handleCloseModal(setAddToCollectionModal, addToCollectionModal)
            }
            onMessage={(message, variant) => {
              setToastData({
                message: message,
                variant: variant,
                show: true,
              });
            }}
            recipe_id={id}
          ></AddRecipeToCollection>
        </Modal.Body>
      </Modal>
      <Toast
        onClose={() => {
          setToastData({
            message: "",
            variant: "",
            show: false,
          });
        }}
        bg={toastData.variant}
        text={"white"}
        show={toastData.show}
        delay={3000}
        autohide
        className="position-fixed bottom-0 end-0 m-3"
      >
        <Toast.Body>{toastData.message}</Toast.Body>
      </Toast>
    </Container>
  );
}

export default RecipeDetail;
