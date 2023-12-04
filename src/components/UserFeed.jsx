//React
import React, { useState, useEffect } from "react";
import RecipeList from "./RecipeList";

//Bootstrap
import { Container, Spinner } from "react-bootstrap";

function UserFeed() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = () => {
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "/recipe/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setRecipes(data);
        setLoading(false);
      })
      .catch((error) => { 
        console.error("Error al obtener recetas:", error); 
        setLoading(false); 
      });
  }

  return (
    loading ? (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="secondary"/>
      </Container>
    ) : ( 
      <RecipeList recipes={recipes} /> 
    )
  );

}

export default UserFeed;
