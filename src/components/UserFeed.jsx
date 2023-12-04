import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import RecipeList from "./RecipeList";
import { Container, Spinner, ButtonGroup, Button, Row, Modal } from "react-bootstrap";

function UserFeed() {
  const [myUserName, setMyUserName] = useState(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const { token, logout, isLogged } = useAuth();
  const [myUserFollowing, setMyUserFollowing] = useState([]);
  const [recipesForYou, setRecipesForYou] = useState([]);
  const [recipesFollowing, setRecipesFollowing] = useState([]);
  const [followingRecipes, setFollowingRecipes] = useState([]);
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState("forYou");
  const [showLoginRedirectModal, setShowLoginRedirectModal] = useState(false);

  useEffect(() => {
    getUserFollowing();
  }, [feedType]);

  useEffect(() => {
    setLogged(isLogged);
  }, [token]);

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
        const response = await fetch(process.env.REACT_APP_API_URL + '/recipe/user/' + following, {
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
        allFollowingRecipes.push(...followingRecipes.slice(0, 2));
        console.error(followingRecipes)
      } catch (error) {
        console.error('Error fetching recipes for following:', error);
      }
    }
  
    setRecipesFollowing(allFollowingRecipes);
    setLoading(false);
  };

  const displayedRecipes = () => {
    return feedType === "forYou" ? recipesForYou : recipesFollowing;
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
          setRecipesForYou(filteredRecipes);
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
      <div className="d-flex justify-content-center">
      <ButtonGroup className="mt-5">
        <Button 
          style={feedType === "forYou" ? { backgroundColor: '#FFC1AC', borderColor: '#FFC1AC', color: '#000' } : null}
          variant={feedType === "forYou" ? "light" : "light"} 
          onClick={() => setFeedType("forYou")}
        >
          For You
        </Button>
        <Button 
          style={feedType === "following" ? { backgroundColor: '#FFC1AC', borderColor: '#FFC1AC', color: '#000' } : null}
          variant={feedType === "following" ? "light" : "light"} 
          onClick={() => {
            if(logged==false) {
              setShowLoginRedirectModal(true);
            }else{
              setFeedType("following");
            }
          }}
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
        <RecipeList recipes={displayedRecipes()} /> 
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
