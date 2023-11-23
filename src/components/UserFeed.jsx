//React
import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

//Bootstrap
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Image, ListGroup} from "react-bootstrap";
import { StarFill, List } from "react-bootstrap-icons";

//CSS
import "../css/UserFeed.css";
import "../css/Transitions.css";

//Assets
import chefIcon from "../assets/icons/chef.png";
import gyoza from "../assets/gyozas.jpg";

function UserFeed() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = () => {
    fetch(process.env.REACT_APP_API_URL + "/recipe/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setRecipes(data);
      })
      .catch((error) => console.error("Error al obtener recetas:", error));
  }

  return (
    <Container className="pb-5 pt-3">
      <Row>
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Col sm={12} md={6} xl={4}>
              <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
                <Link key={recipe._id} to={`/RecipeDetail/${recipe._id}`} className="text-decoration-none">
                  <Card className="mt-5 shadow transition-03s" id="recipes-list">
                    <Card.Img className="object-fit-cover" variant="top" src={recipe.main_image ?? gyoza} height={300}/>
                    <Card.Body>
                      <Card.Title className="overflow-hidden text-nowrap">{recipe.name}</Card.Title>
                        <h5><Image src={chefIcon} style={{height:'24px', width: '24px'}} fluid/> {Array(recipe.difficulty || 0).fill().map((_, index) => (
                            <span key={index} className="fs-5 ms-1 text-center"><StarFill style={{color: 'gold'}}></StarFill></span>
                          ))}</h5>
                        Rated:
                    </Card.Body>
                    <Card.Footer>By {recipe.username}</Card.Footer>
                  </Card>
                </Link>
              </CSSTransition>
            </Col>
          ))
        ) : ( <div className="alert alert-warning" role="alert">There are currently no recipes</div> )
        }
      </Row>
    </Container>
  );

}

export default UserFeed;
