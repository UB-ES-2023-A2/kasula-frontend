import { useAuth } from "./AuthContext";

// React
import React, { useState, useRef, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

// Images
import defaultProfile from "../assets/defaultProfile.png";
import chefIcon from "../assets/icons/chef.png";
import logo from "../assets/logo.png";

// Bootstrap
import { StarFill, Pencil, ExclamationTriangleFill, X} from "react-bootstrap-icons";
import { Container, Row, Col, Card, Button, Form, Image, Modal, Dropdown, ListGroup } from "react-bootstrap";

// MDBReact components
import { MDBCard, MDBCardBody, MDBCardText } from 'mdb-react-ui-kit';

// CSS
import "../css/common.css";
import "../css/UserProfile.css";

const UserProfile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [operationSuccess, setOperationSuccess] = useState(false);


  const { userId } = useParams();
  const [myUserId, setMyUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userMail, setUserMail] = useState('');
  const [userBio, setUserBio] = useState('');
  const [userFollowers, setUserFollowers] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  const [userNameAux, setUserNameAux] = useState('');
  const [userMailAux, setUserMailAux] = useState('');
  const [userBioAux, setUserBioAux] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const [usernameValid, setUsernameValid] = useState(true);
  const [usernameValidated, setUsernameValidated] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [emailValidated, setEmailValidated] = useState(true);

  const [usernameValidationMessage, setUsernameValidationMessage] = useState('');
  const [emailValidationMessage, setEmailValidationMessage] = useState('');
  const [isDoingRequest, setIsDoingRequest] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerDetails, setFollowerDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);


  const [adminMode, setadminMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showRemoveQuestion, setRemoveQuestion] = useState(false);
  const [showRemoveRecipeModal, setShowRemoveRecipeModal] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);


  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [recipes, setRecipes] = useState([]);

  const handleNavigate = (userId) => {
    window.location.href = `/UserProfile/${userId}`;
  };

  
  const profileTitleStyle = {
    marginBottom: '5px',
  };
  
  const profileTextStyle = {
    marginBottom: '0',
  };
  
  const bioBoxStyle = {
    overflowY: 'auto',
    maxHeight: '200px',
    borderRadius: '0.25rem',
    padding: '0.375rem 0.75rem',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word'
  };

  const fetchMyUserData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080' + '/user/me', {
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
      setMyUserId(data._id)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080' + '/user/' + userId, {
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

      setUserName(data.username);
      setUserNameAux(data.username);

      setUserMail(data.email)
      setUserMailAux(data.email)

      setUserBio(data.bio || '');
      setUserBioAux(data.bio || '');

      setUserFollowers(data.followers || []);
      setUserFollowing(data.following || []);

      setProfilePicture(data.profile_picture || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserDetails = async (usernames, setUserDetails) => {
    const userDetails = await Promise.all(
      usernames.map(async (username) => {
        const response = await fetch(`http://127.0.0.1:8080/user/${username}`);
        return response.json();
      })
    );
    setUserDetails(userDetails);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchMyUserData();
    }
  }, [token, navigate]);

  useEffect(() => {
    if(myUserId == userId){
      setadminMode(true);
    }
    fetchUserData();
  }, [myUserId]);

  useEffect(() => {
    if (userName) {
      getRecipes();
    }
  }, [userName]);

  useEffect(() => {
    fetchUserDetails(userFollowers, setFollowerDetails);
  }, [userFollowers]);
  
  useEffect(() => {
    fetchUserDetails(userFollowing, setFollowingDetails);
  }, [userFollowing]);
  
  
  
  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleCancelEdit = () => {
    fetchMyUserData();
    fetchUserData();
    setEditMode(false);
  };

  const handleShowRemoveRecipeModal = () => {
    setShowRemoveRecipeModal(true);
};

  const handleSaveProfile = async () => {

    if (!userNameAux) {
        setConfirmationMessage("Name is required");
        setShowConfirmation(true);
        return;
    }

    if (!usernameValid || !emailValid) {
      setConfirmationMessage("Please make sure that the username and email are valid.");
      setShowConfirmation(true);
      setOperationSuccess(false);
      return;
    }

    const formData = new FormData();
    const userProfile = {
        username: userNameAux,
        email: userMailAux,
        bio: userBioAux
    };
    
    // Convert the user profile object to a JSON string and append to FormData
    formData.append('user', JSON.stringify(userProfile));

    try {
        const response = await fetch(`${'http://127.0.0.1:8080'}/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
                // Note: 'Content-Type' header is not needed when using FormData
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to update user data');
        }

        const updatedData = await response.json();

        setUserName(updatedData.username);
        setUserMail(updatedData.email);
        setUserBio(updatedData.bio || '');

        setConfirmationMessage("Profile updated successfully");
    } catch (error) {
        console.error('Error updating user data:', error);
        setConfirmationMessage("Failed to update profile");
    }

    setShowConfirmation(true);
    setOperationSuccess(true)
    setEditMode(false);
};


  const handleImageUpload = async () => {
    const userData = {
    };
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        setProfilePicture(imageUrl);
  
        const formData = new FormData();
        formData.append("file", file);
  
        try {
          const response = await fetch(`http://127.0.0.1:8080/user/${userId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error('Failed to update user data');
          }
  
          const data = await response.json();
          setConfirmationMessage("Profile updated successfully");
        } catch (error) {
          console.error('Error updating user data:', error);
          setConfirmationMessage("Failed to update profile");
        }
        setShowConfirmation(true);
      }
    };
    fileInput.click();
  };

  const handleImageRemove = (event) => {
    setShowRemoveRecipeModal(false);
  };

  const handleRecipeRemove = async () => {
    setShowRemoveRecipeModal(false);

    try {
        const response = await fetch(`http://127.0.0.1:8080/recipe/${selectedRecipeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            setConfirmationMessage("Recipe removed successfully.");
            setOperationSuccess(true);
            getRecipes(); // Re-fetch recipes
        } else {
            const errorData = await response.text();
            throw new Error(`Failed to remove recipe: ${errorData}`);
        }
    } catch (error) {
        console.error('Error removing recipe:', error);
        setConfirmationMessage(error.toString());
        setOperationSuccess(false);
    }
    setShowConfirmation(true);
};

  const handleImageRemoveQuestion = (event) => {
    setRemoveQuestion(true);
  };

  const ImageRemoveQuestionClose = (event) => {
    setRemoveQuestion(false)
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const getRecipes = () => {
    fetch(`http://127.0.0.1:8080/recipe/user/${userName}`, {
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    })
    .then((response) => response.json())
    .then((data) => {
      console.error('RECIPES', data);
      setRecipes(data);
    })
    .catch((error) => console.error("Error al obtener recetas:", error));
  }

  const onUsernameChange = (e) => {
    const value = e.target.value;
    setUserNameAux(value);
    setUsernameValid(isUsernameValid(value)); 
    setUsernameValidated(true);
  };
  
  const onEmailChange = (e) => {
    const value = e.target.value;
    setUserMailAux(value);
    setEmailValid(isEmailValid(value)); 
    setEmailValidated(true);
  };
  

  const isUsernameValid = (username = "") => {
    let isValid = true; 
  
    if (username.length === 0) {
      setUsernameValidationMessage("This field is required");
      isValid = false;
    } else if (username.search(/[ !@#$%^&*(),.?":{}|<>]/) >= 0) {
      setUsernameValidationMessage(
        "Username can only contain letters, numbers, and underscores"
      );
      isValid = false;
    } else if (username.length < 4 || username.length > 20) {
      setUsernameValidationMessage(
        "Username must be between 4 and 20 characters"
      ); 
      isValid = false;
    } else {
      isUsernameAvailable(username);
    }
    setUsernameValid(isValid);
    setUsernameValidated(true);
    return isValid;
  };

  const isEmailValid = (email = "") => {
    let isValid = true;
  
    if (email.length === 0) {
      setEmailValidationMessage("This field is required");
      isValid = false;
    } else if (email.search(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) < 0) {
      setEmailValidationMessage("Please enter a valid email address");
      isValid = false;
    } else {
      isEmailAvailable(email);
    }
    setEmailValid(isValid);
    setEmailValidated(true);
    return isValid;
  };

  const isUsernameAvailable = async (username = "") => {
    if (!isDoingRequest) {
      setIsDoingRequest(true);
      try {
        const response = await fetch(
          'http://127.0.0.1:8080' + "/user/check_username/".concat(username),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const data = await response.json();
          if (data && data.detail) {
            setUsernameValidationMessage(data.detail);
          } else {
            setUsernameValidationMessage(
              "Could not check if username is available. Please try again later."
            );
          }
        } else {
          const data = await response.json();
          setUsernameValidationMessage(data.message);
          setUsernameValid(data.status);
        }
      } catch (error) {
        setUsernameValidationMessage(
          "Could not check if username is available. Please try again later."
        );
      } finally {
        setIsDoingRequest(false);
      }
    }
  };

  const isEmailAvailable = async (email = "") => {
    if (!isDoingRequest) {
      setIsDoingRequest(true);
      try {
        const response = await fetch('http://127.0.0.1:8080' + "/user/check_email/".concat(email),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const data = await response.json();
          if (data && data.detail) {
            setEmailValidationMessage(data.detail);
          } else {
            setEmailValidationMessage(
              "Could not check if email is available. Please try again later."
            );
          }
        } else {
          const data = await response.json();
          setEmailValidationMessage(data.message);
          setEmailValid(data.status);
        }
      } catch (error) {
        setEmailValidationMessage(
          "Could not check if email is available. Please try again later."
        );
      } finally {
        setIsDoingRequest(false);
      }
    }
  };

  const handleShowFollowersModal = () => setShowFollowersModal(true);
  const handleCloseFollowersModal = () => setShowFollowersModal(false);
  const handleShowFollowingModal = () => setShowFollowingModal(true);
  const handleCloseFollowingModal = () => setShowFollowingModal(false);

  useEffect(() => {
    setIsFollowing(userFollowing.includes(myUserId));
  }, [userFollowing, myUserId]);

  const handleFollow = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/user/follow/${userName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (response.ok) {
        setConfirmationMessage("You are now following the user.");
        setIsFollowing(true);
        setUserFollowers(prevFollowers => [...prevFollowers, myUserId]);
      } else {
        throw new Error('There was an error following the user.');
      }
    } catch (error) {
      console.error('Error following user:', error);
      setConfirmationMessage(error.toString());
      setShowConfirmation(true);
    }
  };
  
  const handleUnfollow = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/user/unfollow/${userName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (response.ok) {
        setConfirmationMessage("You have unfollowed the user.");
        setIsFollowing(false);
        setUserFollowers(prevFollowers => prevFollowers.filter(id => id !== myUserId));
      } else {
        throw new Error('There was an error unfollowing the user.');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setConfirmationMessage(error.toString());
      setShowConfirmation(true);
    }
    setShowUnfollowModal(false);
  };
  
  return (
    <div>
        <Container>
          {/* Profile Form */}
          <Row>
            <Col sm={2}></Col>
            <Col sm={8} className="form-container mt-5 pt-3 pb-2rounded shadow-sm">
              <Row>
                <Col sm={2}>
                <div className="image-container" 
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}>

                  <Image 
                    src={profilePicture ? profilePicture : defaultProfile} 
                    alt="Profile" 
                    fluid 
                    roundedCircle 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {showDropdown && adminMode && (
                    <Dropdown align="end" className="edit-button" style={{ position: 'absolute', top: 0, right: 0 }}>
                      <Dropdown.Toggle as={Button} variant="light" size="sm">
                        <Pencil/>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as="button" onClick={handleImageUpload}>Upload new file</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
                </Col>
                <Col sm={7}>
                <Row>
                      <h3 style={profileTextStyle}>@{userName}</h3>
                      <div style={bioBoxStyle}>{userBio}</div>
                      <Row className="mt-1">
                          <Col sm={4}>
                            {adminMode && (
                              <Button variant="danger" onClick={handleEditToggle}>
                                Edit
                              </Button>
                            )}
                          </Col>
                          </Row>
                          <Row>
                          <Col sm={4}>
                            {!adminMode && (
                              <Button
                                variant={isFollowing ? 'info' : 'primary'}
                                onClick={isFollowing ? () => setShowUnfollowModal(true) : handleFollow}
                              >
                                {isFollowing ? 'Following' : 'Follow'}
                              </Button>
                            )}
                          </Col>
                      </Row>
                </Row>
                <Row className="mt-2 justify-content-center">
                <Col sm={4} className="d-flex justify-content-around align-items-center rounded-3 p-2 mb-2"
                    style={{ backgroundColor: '#ffffff' }}>
                    <div className="text-center" onClick={handleShowFollowersModal} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                      <p className="small text-muted mb-1">Followers</p>
                      <p className="mb-0">{userFollowers.length}</p>
                    </div>
                    <div className="text-center" onClick={handleShowFollowingModal} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                      <p className="small text-muted mb-1">Following</p>
                      <p className="mb-0">{userFollowing.length}</p>
                    </div>
                </Col>
                  <Col sm={8}></Col>
                </Row>
                </Col>
            </Row>
            <Row>
              {recipes && recipes.length > 0 ? (
                  recipes.map((recipe) => (
                      <Col sm={12} md={6} xl={4} key={recipe._id}>
                          <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
                          <Link key={recipe._id} to={`/RecipeDetail/${recipe._id}`} className="text-decoration-none">
                              <Card className="mt-5 shadow" id="recipes-list">
                                  <Card.Img className="object-fit-cover" variant="top" src={recipe.main_image} alt={recipe.name} height={100}/>
                                  <Card.Body>
                                      <Card.Title className="overflow-hidden text-nowrap">{recipe.name}</Card.Title>
                                      <h5>
                                          <Image src={chefIcon} style={{height: '24px', width: '24px'}} fluid/> 
                                          {Array(recipe.difficulty || 0).fill().map((_, index) => (
                                              <span key={index} className="fs-5 ms-1 text-center"><StarFill style={{color: 'gold'}}></StarFill></span>
                                          ))}
                                      </h5>
                                      {adminMode && (
                                        <div className="card-buttons">
                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => {
                                                setSelectedRecipeId(recipe._id)
                                                setShowRemoveRecipeModal(true)
                                            }}>
                                                <Pencil />
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => {
                                                setSelectedRecipeId(recipe._id)
                                                setShowRemoveRecipeModal(true)
                                            }}>
                                                <X />
                                            </Button>
                                        </div>
                                      )}
                                  </Card.Body>
                              </Card>
                              </Link>
                          </CSSTransition>
                      </Col>
                  ))
              ) : ( 
                  <div className="alert alert-warning" role="alert">There are currently no Recipes</div> 
              )}
          </Row>

            </Col>
            <Col sm={2}></Col>
          </Row>
        </Container>

      <Modal show={showRemoveRecipeModal} size="sm" onHide={() => setShowRemoveRecipeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Remove recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="text-center mb-4">
              <ExclamationTriangleFill className="text-warning" size={100} />
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              <p className="ms-0">Are you sure you want to remove this recipe?</p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
        <Button variant="danger" onClick={handleRecipeRemove}>
          Remove
        </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirmation}
        onHide={handleConfirmationClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Profile Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmationMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmationClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={editMode} onHide={handleCancelEdit}>
          <Modal.Header closeButton>
              <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={userNameAux}
                  onChange={(e) => onUsernameChange(e)}
                  isInvalid={usernameValidated && !usernameValid}
                />
                <Form.Control.Feedback type="invalid">
                  {usernameValidationMessage}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={userMailAux}
                  onChange={(e) => onEmailChange(e)}
                  isInvalid={emailValidated && !emailValid}
                />
                <Form.Control.Feedback type="invalid">
                  {emailValidationMessage}
                </Form.Control.Feedback>
              </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Biography</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={userBioAux}
                    onChange={(e) => setUserBioAux(e.target.value)}
                  />
                </Form.Group>
              </Form>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
              </Button>
              <Button 
                  variant="primary" 
                  onClick={handleSaveProfile}
                  disabled={!usernameValid || !emailValid} 
              >
                  Save Changes
              </Button>
          </Modal.Footer>
      </Modal>

      <Modal show={showConfirmation} onHide={handleConfirmationClose}>
        <Modal.Header closeButton>
            <Modal.Title>{operationSuccess ? 'Success' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmationMessage}</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleConfirmationClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>

    <Modal show={showFollowersModal} onHide={handleCloseFollowersModal}>
      <Modal.Header closeButton>
        <Modal.Title>Followers</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {followerDetails.map((follower, index) => (
          <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
            <Card key={index} className="mb-0 shadow" id="followers-list" style={{ cursor: 'pointer' }} onClick={() => handleNavigate(follower._id)}>
              <Card.Body>
                <Row>
                  <Col sm={2}>
                  <Image 
                    src={follower.profile_picture ? follower.profile_picture : defaultProfile} 
                    roundedCircle 
                    style={{ width: '30px', marginRight: '10px' }} 
                  />
                  </Col>
                  <Col >
                    <Card.Title style={{ cursor: 'pointer' }}>{follower.username}</Card.Title>
                  </Col>
                </Row>
                {}
              </Card.Body>
            </Card>
          </CSSTransition>
        ))}
      </Modal.Body>

    </Modal>

    <Modal show={showFollowingModal} onHide={handleCloseFollowingModal}>
      <Modal.Header closeButton>
        <Modal.Title>Following</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {followingDetails.map((following, index) => (
          <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
            <Card key={index} className="mb-0 shadow" id="followers-list" onClick={() => handleNavigate(following._id)}>
              <Card.Body>
                <Row>
                  <Col sm={2}>
                  <Image 
                    src={following.profile_picture ? following.profile_picture : defaultProfile} 
                    roundedCircle 
                    style={{ width: '30px', marginRight: '10px' }} 
                  />
                  </Col>
                  <Col >
                    <Card.Title>{following.username}</Card.Title>
                  </Col>
                </Row>
                {}
              </Card.Body>
            </Card>
          </CSSTransition>
        ))}
      </Modal.Body>
    </Modal>

    <Modal show={showUnfollowModal} onHide={() => setShowUnfollowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Unfollow User</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to unfollow this user?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowUnfollowModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleUnfollow}>
          Unfollow
        </Button>
      </Modal.Footer>
    </Modal>

    </div>
  );
};

export default UserProfile;

