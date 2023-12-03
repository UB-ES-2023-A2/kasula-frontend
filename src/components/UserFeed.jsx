import { useAuth } from "./AuthContext";
import React, { useState, useEffect } from "react";
import RecipeList from "./RecipeList";
import { Container, Spinner, ButtonGroup, Button, Row } from "react-bootstrap";

function UserFeed() {
  const [myUserName, setMyUserName] = useState(localStorage.getItem("currentUser"));
  const { token, logout, isLogged } = useAuth();
  const [myUserFollowing, setMyUserFollowing] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [FollowingRecipes, setFollowingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState("forYou");

  useEffect(() => {
    getUserFollowing();
  }, [feedType]);

  useEffect(() => {
    getRecipes();
  }, [myUserFollowing]);

  const getUserFollowing = async (userId) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/user/' + myUserName, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setMyUserFollowing(data.following || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getRecipesFollowing = async () => {
    setLoading(true);
    const allFollowingRecipes = [];
    for (const following of myUserFollowing) {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/recipe/user/' + following + '?limit=2', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch recipes for following');
        }
        const followingRecipes = await response.json();
  
        allFollowingRecipes.push(...followingRecipes);
      } catch (error) {
        console.error('Error fetching recipes for following:', error);
      }
    }
  
    setRecipes(allFollowingRecipes);
    setLoading(false);
  };

  const getRecipes = () => {
    setLoading(true);
    if (feedType === "following") {
      getRecipesFollowing();
    } else {
      let url = process.env.REACT_APP_API_URL + "/recipe/";
      fetch(url)
        .then((response) => response.json())
        .then((allRecipes) => {
          const filteredRecipes = allRecipes.filter(recipe => 
            !myUserFollowing.includes(recipe.username)
          );
          setRecipes(filteredRecipes);
          setLoading(false);
        })
        .catch((error) => { 
          console.error("Error al obtener recetas:", error); 
          setLoading(false); 
        });
    }
};


  return (
    <Container>
      <Row></Row>
      <div className="d-flex justify-content-center mt-3">
        <ButtonGroup className="mb-3">
          <Button 
            variant={feedType === "forYou" ? "danger" : "secondary"} 
            onClick={() => setFeedType("forYou")}
          >
            For You
          </Button>
          <Button 
            variant={feedType === "following" ? "danger" : "secondary"} 
            onClick={() => setFeedType("following")}
          >
            Following
          </Button>
        </ButtonGroup>
      </div>
      {loading ? (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <Spinner animation="border" variant="secondary"/>
        </Container>
      ) : ( 
        <RecipeList recipes={recipes} /> 
      )}
    </Container>
  );
}

export default UserFeed;
