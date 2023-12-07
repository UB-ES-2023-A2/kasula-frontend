//React
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import RecipeList from "./RecipeList";
import RecipeBrowser from "./RecipeBrowser";

//Bootstrap
import { Container, Spinner } from "react-bootstrap";

function UserFeed() {
  const { isLogged } = useAuth();
  const numRecipes = isLogged() ? 24 : 9;
  const loggedOutFilters = {
    sortBy: "average_rating",
    sortAscending: false,
  };
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState(isLogged() ? (JSON.parse(localStorage.getItem("filters"))) : loggedOutFilters);
  const [recipeName, setRecipeName] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(isLogged() ? false : true);

  useEffect(() => {
    getRecipes(filters, recipeName, page, numRecipes, true);
  }, []);

  useEffect(() => {
    if (!isLogged()) {
      setFinished(true);
      setPage(0);
      setFilters(loggedOutFilters);
      setRecipeName(null);
      getRecipes(loggedOutFilters, null, 0, 9, true);
    }
  }, [isLogged]);

  const getRecipes = ( filters, recipeName, page, numRecipes, reset ) => {
    if (loading) return;
    setLoading(true);
    fetch(buildRequestUrl(filters, recipeName, page, numRecipes))
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            setPage(page - 1);
            setFinished(true);
          }
        }
        return response.json();
      })
      .then((data) => {
        if (reset) {
          setRecipes(data);
        } else {
          setRecipes(recipes.concat(data));
        }
        setLoading(false);
      })
      .catch((error) => { 
        console.error("Error al obtener recetas:", error); 
        setLoading(false); 
      });
  }

  const buildRequestUrl = (filters, recipeName, page, numRecipes) => {
    let url = process.env.REACT_APP_API_URL + "/recipe/" + (filters || recipeName || page || numRecipes ? "magic?" : "");
    if (filters) {
      url += (filters.sortBy === 'none') ? '' : `sort_by=${filters.sortBy}&`;
      url += (filters.sortBy === 'none') ? '' : `order=${filters.sortAscending}&`;
      url += filters.maxDifficulty ? `max_difficulty=${filters.maxDifficulty}&` : '';
      url += filters.maxTime ? `max_cooking_time=${filters.maxTime}&` : '';
      url += filters.minRating ? `min_rating=${filters.minRating}&` : '';
      url += filters.maxCalories ? `max_energy=${filters.maxCalories}&` : '';
    }
    if (recipeName) {
      url += `search=${recipeName}&`;
    }
    if (page !== null && numRecipes !== null) {
      url += `start=${page * numRecipes}&`;
      url += `size=${numRecipes}`;
    }
    console.log(url);
    return url;
  }

  return (
    <Container className="py-5">
      {isLogged() && (
        <RecipeBrowser onSearch={(filters, recipeName) => {
        setPage(0);
        setFinished(false);
        setFilters(filters);
        setRecipeName(recipeName);
        getRecipes(filters, recipeName, 0, numRecipes, true);
        }}/>
      )}
      {loading && recipes.length === 0 ? (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="secondary"/>
      </Container>
      ) : ( 
        <RecipeList onRequestLoadMore={() => {
          setPage(page + 1);
          getRecipes(filters, recipeName, page + 1, numRecipes, false);
        }} recipes={recipes} finished={finished}/> 
      )}
      {!isLogged() && (
        <div className="alert alert-warning b-4" role="alert">
            This is as far as you can go. Please, <a href="/login">login</a> or <a href="/signup">register</a> to see more recipes.
        </div>
      )}
    </Container>
  );

}

export default UserFeed;
