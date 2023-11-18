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
import { StarFill, Pencil, ExclamationTriangleFill } from "react-bootstrap-icons";
import { Container, Row, Col, Card, Button, Form, Image, Modal, Dropdown, ListGroup } from "react-bootstrap";

// CSS
import "../css/common.css";

const UserProfile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { userId } = useParams();
  const [myUserId, setMyUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userMail, setUserMail] = useState('');
  const [userBio, setUserBio] = useState('');
  const [userNameAux, setUserNameAux] = useState('');
  const [userMailAux, setUserMailAux] = useState('');
  const [userBioAux, setUserBioAux] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const [adminMode, setadminMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRemoveQuestion, setRemoveQuestion] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [recipes, setRecipes] = useState([]);

  const profileSectionStyle = {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '10px',
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
    border: '1px solid #ced4da',
    borderRadius: '0.25rem',
    padding: '0.375rem 0.75rem',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word'
  };

  const fetchMyUserData = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/user/me', {
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
      const response = await fetch(process.env.REACT_APP_API_URL + '/user/' + userId, {
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

      setProfilePicture(data.profile_picture || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchMyUserData();
      if(myUserId == userId){
        setadminMode(true);
      }
      fetchUserData();
    }
  }, [token, navigate]);

  useEffect(() => {
    getRecipes();
  }, []);
  
  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleCancelEdit = () => {
    fetchMyUserData();
    fetchUserData();
    setEditMode(false);
  };

  const handleSaveProfile = async () => {
    if (!userNameAux) {
      setConfirmationMessage("Name is required");
      setShowConfirmation(true);
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userNameAux,
          email: userMailAux,
          bio: userBioAux,
        }),
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
    setEditMode(false);
  };
  

  const handleImageUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        setProfilePicture(imageUrl);
      }
    };
    fileInput.click();
  };
  

  const handleImageRemove = (event) => {
    setRemoveQuestion(false)
    setProfilePicture("")
  };

  const handleImageRemoveQuestion = (event) => {
    setRemoveQuestion(true)
  };

  const ImageRemoveQuestionClose = (event) => {
    setRemoveQuestion(false)
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const getRecipes = () => {
    fetch(process.env.REACT_APP_API_URL + "/recipe/")
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => console.error("Error al obtener recetas:", error));
  }

  return (
    <div>
        <Container>
          {/* Profile Form */}
          <Row>
            <Col sm={2}></Col>
            <Col sm={8} className="form-container mt-5 pt-4 pb-2 rounded shadow-sm">
              <Row>
                <Col sm={4}>
                <div className="image-container" style={{ position: 'relative' }}>
                  <Image 
                    src={profilePicture ? profilePicture : defaultProfile} 
                    alt="Profile" 
                    fluid 
                    roundedCircle 
                  />
                  <Dropdown align="end" className="edit-button" style={{ position: 'absolute', top: 0, right: 0 }}>
                    <Dropdown.Toggle as={Button} variant="light" size="sm">
                      <Pencil/> {/* Ícono de lápiz */}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item as="button" onClick={handleImageUpload}>Upload new file</Dropdown.Item>
                      <Dropdown.Item as="button" onClick={handleImageRemoveQuestion}>Remove image</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                </Col>
                <Col sm={7}>
                <Row>
                  <Col md={12} lg={4}>
                    <div style={profileSectionStyle}>
                      <h5 style={profileTitleStyle}><i className="fas fa-user"></i> Name</h5>
                      <p style={profileTextStyle}>{userName}</p>
                    </div>
                  </Col>
                  <Col md={12} lg={8}>
                    <div style={profileSectionStyle}>
                      <h5 style={profileTitleStyle}><i className="fas fa-envelope"></i> Email</h5>
                      <p style={profileTextStyle}>{userMail}</p>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div style={profileSectionStyle}>
                      <h5 style={profileTitleStyle}><i className="fas fa-align-left"></i> Bio</h5>
                      <div style={bioBoxStyle}>{userBio}</div>
                    </div>
                  </Col>
                </Row>
                </Col>
              
            <Row className="mt-3">
              <Col sm={1}></Col>
              <Col sm={5}>
                <Button variant="primary" onClick={handleEditToggle}>
                  Edit Profile
                </Button>
              </Col>
              <Col sm={4}></Col>
            </Row>
            </Row>
            <Row>
            <hr className="my-4" style={{ borderTop: '3px solid red', width: '100%' }} /> {}
            <h1 className="my-4 text-center">My Recipes</h1> {/* Agrega esta línea */}
              {recipes && recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <Col sm={12} md={6} xl={4}>
                    <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
                      <Link key={recipe._id} to={`/RecipeDetail/${recipe._id}`} className="text-decoration-none">
                        <Card className="mt-2 shadow" id="recipes-list">
                          <Card.Img className="object-fit-cover" variant="top" src={recipe.image} alt={recipe.name} height={100}/>
                          <Card.Body>
                            <Card.Title className="overflow-hidden text-nowrap">{recipe.name}</Card.Title>
                              <h5><Image src={chefIcon} style={{height:'24px', width: '24px'}} fluid/> {Array(recipe.difficulty || 0).fill().map((_, index) => (
                                  <span key={index} className="fs-5 ms-1 text-center"><StarFill style={{color: 'gold'}}></StarFill></span>
                                ))}</h5>
                              Rated:
                          </Card.Body>
                          
                        </Card>
                      </Link>
                    </CSSTransition>
                  </Col>
                ))
              ) : ( <div className="alert alert-warning" role="alert">No hay recetas disponibles</div> )
              }
            </Row>
            </Col>
            <Col sm={2}></Col>
          </Row>
        </Container>

      <Modal show={showRemoveQuestion} size="sm" onHide={ImageRemoveQuestionClose}>
        <Modal.Header closeButton>
          <Modal.Title>Remove profile image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="text-center mb-4">
              <ExclamationTriangleFill className="text-warning" size={100} />
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              <p className="ms-0">Are you sure you want to remove the profile image?</p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
        <Button variant="danger" onClick={handleImageRemove}>
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
                onChange={(e) => setUserNameAux(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={userMailAux}
                onChange={(e) => setUserMailAux(e.target.value)}
              />
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
          <Button variant="primary" onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default UserProfile;

