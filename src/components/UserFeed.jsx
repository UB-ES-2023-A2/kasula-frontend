import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import RecipeList from "./RecipeList";
import RecipeBrowser from "./RecipeBrowser";
import { Container, Spinner, ButtonGroup, Button, Modal, Row, Col } from "react-bootstrap";

function UserFeed() {
  const {isLogged } = useAuth();
  const navigate = useNavigate();
  const numRecipes = isLogged() ? 24 : 9;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState(localStorage.getItem('feedType') || 'foryou');
  const [showLoginRedirectModal, setShowLoginRedirectModal] = useState(false);

  const loggedOutFilters = {
    sortBy: "average_rating",
    sortAscending: false,
  };
  const [filters, setFilters] = useState(isLogged() ? (JSON.parse(localStorage.getItem("filters"))) : loggedOutFilters);
  const [recipeName, setRecipeName] = useState(null);
  const [page, setPage] = useState(0);
  const [finished, setFinished] = useState(isLogged() ? false : true);

  useEffect(() => {
    if (!isLogged()) {
      setFinished(true);
      setPage(0);
      setFilters(loggedOutFilters);
      setRecipeName(null);
      getRecipes(loggedOutFilters, null, 0, 9, true, feedType);
    }
  }, [isLogged]);

  useEffect(() => {
    getRecipes(filters, recipeName, page, numRecipes, true, feedType);
  }, []);

  const getRecipes = async (filters, recipeName, page, numRecipes, reset, feedType) => {
    setLoading(true);
    let url = buildRequestUrl(filters, recipeName, page, numRecipes, feedType);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 400) {
          setPage(page - 1);
          setFinished(true);
        }
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      if (reset) {
        setRecipes(data)
      } else {
        setRecipes(recipes.concat(data));
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildRequestUrl = (filters, recipeName, page, numRecipes, feedType) => {
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
      url += `size=${numRecipes}&`;
    }
    url += `feedType=${feedType}`;
    console.error(url)
    return url;
  };

  const handleTabChange = (tab) => {
    setPage(0);
    setFeedType(tab);
    setFinished(false);
    localStorage.setItem('feedType', tab)
    if (tab === "following") {
      if(!isLogged()){
        setShowLoginRedirectModal(true);
      }else{
        getRecipes(filters, recipeName, 0, numRecipes, true, 'following');
      }
    }else{
      if(!isLogged()){
        getRecipes(loggedOutFilters, null, 0, 9, true);
      }else{
        getRecipes(filters, recipeName, 0, numRecipes, true, 'foryou');
      }
    }
  };

  return (
    <Container>
      <Row>
        <Col sm={5}></Col>
          <Col sm={4}>
            <ButtonGroup className="mt-5">
              <Button
                style={feedType === "foryou" ? { backgroundColor: '#FFC1AC', borderColor: '#FFC1AC', color: '#000' } : null}
                variant={feedType === "following" ? "light" : "light"} 
                onClick={() => handleTabChange("foryou")}
              >
                For You
              </Button>
              <Button
                style={feedType === "following" ? { backgroundColor: '#FFC1AC', borderColor: '#FFC1AC', color: '#000' } : null}
                variant={feedType === "following" ? "light" : "light"} 
                onClick={() => handleTabChange("following")}
              >
                Following
              </Button>
            </ButtonGroup>
        </Col>
        <Col sm={3}></Col>
      </Row>

      {isLogged() && (
        <RecipeBrowser onSearch={(newFilters, newRecipeName) => {
          setPage(0);
          setFinished(false);
          setFilters(newFilters);
          setRecipeName(newRecipeName);
          getRecipes(filters, recipeName, 0, numRecipes, true, feedType);
        }}/>
      )}

      {loading ? (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <Spinner animation="border" variant="secondary"/>
        </Container>
      ) : (
        <RecipeList
          recipes={recipes}
          onRequestLoadMore={() => {
            setPage(page + 1);
            if (feedType === "foryou") {
              getRecipes(filters, recipeName, page, numRecipes, false, 'foryou');
            } else {
              getRecipes(filters, recipeName, page, numRecipes, false, 'following');
            }
          }}
          finished={finished}
        />
      )}

      <Modal show={showLoginRedirectModal} onHide={() => setShowLoginRedirectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Required log in</Modal.Title>
        </Modal.Header>
        <Modal.Body>You need to log in to view the recipes of the people you follow.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginRedirectModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Log in
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserFeed;