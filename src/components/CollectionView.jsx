//React
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useAuth } from "./AuthContext";

//Bootstrap
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Image, ListGroup } from "react-bootstrap";
import { StarFill, ArrowLeft, X } from "react-bootstrap-icons";

//CSS
import "../css/UserFeed.css";
import "../css/Transitions.css";

//Assets
import chefIcon from "../assets/icons/chef.png";
import gyoza from "../assets/gyozas.jpg";

function CollectionView() {
  const { token, isLogged } = useAuth();
  const { id, name } = useParams();
  const [recipes, setRecipes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged()) {
      navigate("/login");
    } else {
      getRecipes();
    }
  }, [id, name]);

  const getRecipes = () => {
    fetch(process.env.REACT_APP_API_URL + `/collection/${id}/recipes/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRecipes(data);
      })
      .catch((error) => console.error("Error al obtener recetas:", error));
  };

  return (
    <Container className="pb-5 pt-3">
      <h1 className="text-center">{name}</h1>
      <Link to={"/collections"}>
        <span className="fs-3 colorless-span-button" role="button">
          <ArrowLeft></ArrowLeft>
        </span>
      </Link>
      <Row className="mt-3">
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Col sm={12} md={6} xl={4}>
              <CSSTransition
                in={true}
                timeout={500}
                classNames="slideUp"
                appear
              >
                <div className="position-relative transition-03s" >
                  <Link
                    key={recipe._id}
                    to={`/RecipeDetail/${recipe._id}`}
                    className="text-decoration-none"
                  >
                    <Card className="mt-5 shadow" id="recipes-list">
                      <Card.Img
                        className="object-fit-cover"
                        variant="top"
                        src={recipe.main_image ?? gyoza}
                        height={300}
                      />
                      <Card.Body>
                        <Card.Title className="overflow-hidden text-nowrap">
                          {recipe.name}
                        </Card.Title>
                        <h5>
                          <Image
                            src={chefIcon}
                            style={{ height: "24px", width: "24px" }}
                            fluid
                          />{" "}
                          {Array(recipe.difficulty || 0)
                            .fill()
                            .map((_, index) => (
                              <span key={index} className="fs-5 ms-1 text-center">
                                <StarFill style={{ color: "gold" }}></StarFill>
                              </span>
                            ))}
                        </h5>
                        <div className="d-flex">
                          <StarFill className="mx-1 mt-1" style={{color: 'red'}}></StarFill>
                          <span>{recipe?.average_rating?.toFixed(1) || 0}</span>
                        </div>
                      </Card.Body>
                      <Card.Footer>By {recipe?.username}</Card.Footer>
                    </Card>
                  </Link>
                  <span className="fs-3 colorless-span-button position-absolute top-0 end-0 mx-2" role="button" onClick={
                    () => {
                      fetch(process.env.REACT_APP_API_URL + `/collection/${id}/remove_recipe/${recipe._id}`, {
                        method: 'PUT',
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          console.log(data);
                          getRecipes();
                        })
                        .catch((error) => console.error("Error al obtener recetas:", error));
                    }
                  }>
                    <X className="rounded-circle highlighter" />
                  </span>
                </div>
              </CSSTransition>
            </Col>
          ))
        ) : (
          <div className="alert alert-warning mt-4" role="alert">
            This collection has no recipes. Search for a recipe in your feed,
            profile or another user and add it from there.
          </div>
        )}
      </Row>
    </Container>
  );
}

export default CollectionView;
