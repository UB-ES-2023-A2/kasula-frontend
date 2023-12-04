//React
import { CSSTransition } from "react-transition-group";

//Bootstrap
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { X } from "react-bootstrap-icons";

//Components
import RecipeCard from "./RecipeCard";

//CSS
import "../css/Transitions.css";

function recipeList({ recipes, canDelete, onDeleteRecipe, id, token }) {
  return (
    <Container className="pb-5 pt-3">
      <Row>
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Col sm={12} md={6} xl={4}>
              <CSSTransition
                in={true}
                timeout={500}
                classNames="slideUp"
                appear
              >
                <div className="position-relative transition-03s">
                  <Link
                    key={recipe._id}
                    to={`/RecipeDetail/${recipe._id}`}
                    className="text-decoration-none"
                  >
                    <RecipeCard recipe={recipe} />
                  </Link>
                  {canDelete && (
                    <span
                      className="fs-3 colorless-span-button position-absolute top-0 end-0 mx-2"
                      role="button"
                      onClick={() => {
                        fetch(
                          process.env.REACT_APP_API_URL +
                            `/collection/${id}/remove_recipe/${recipe._id}`,
                          {
                            method: "PUT",
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        )
                          .then((response) => response.json())
                          .then((data) => {
                            console.log(data);
                            onDeleteRecipe();
                          })
                          .catch((error) =>
                            console.error("Error al obtener recetas:", error)
                          );
                      }}
                    >
                      <X className="rounded-circle highlighter" />
                    </span>
                  )}
                </div>
              </CSSTransition>
            </Col>
          ))
        ) : (
          <div className="alert alert-warning" role="alert">
            There are currently no recipes
          </div>
        )}
      </Row>
    </Container>
  );
}

export default recipeList;
