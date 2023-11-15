import React, { useState, useRef, useEffect } from "react";
import "../css/common.css";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Image, Modal } from "react-bootstrap";
import logo from "../assets/logo.png";
import defaultProfile from "../assets/defaultProfile.png";

const UserProfile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [userMail, setUserMail] = useState('');
  const [userBio, setUserBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // Function to fetch current user data
  const fetchUserData = async () => {
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
      setUserName(data.username);
      setUserMail(data.email)
      setUserBio(data.bio || '');
      setProfilePicture(data.profile_picture || '');
      setUserName(data.username);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [token, navigate]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleCancelEdit = () => {
    fetchUserData();
    setEditMode(false);
  };

  const handleSaveProfile = () => {
    if (!userName) {
      setConfirmationMessage("Name is required");
      setShowConfirmation(true);
      return;
    }

    // Assuming an API call to save profile changes
    // You will need to implement API call logic
    setShowConfirmation(true);
    setConfirmationMessage("Profile updated successfully");
    setEditMode(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setProfilePicture(imageUrl);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <Container fluid className="min-vh-100 pb-5">
        <Row className="bg-danger text-white">
          <Col sm={1} className="py-2">
            <Image src={logo} alt="KASULÀ" fluid />
          </Col>
          <Col sm={11}></Col>
        </Row>

        <Container className="form-container mt-5 pt-4 pb-2 rounded shadow-sm">
          {/* Profile Form */}
          <Row>
            <Col sm={2}></Col>
            <Col sm={8}>
              <Row>
                <Col sm={4}>
                  <Image src={defaultProfile} alt={defaultProfile} fluid roundedCircle />
                  {editMode && (
                  <Form.Control
                    type="file"
                    onChange={handleImageUpload}
                  />
                )}
                </Col>
                <Col sm={6}>
                  <row>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={userName}
                        readOnly={!editMode}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </Form.Group>
                  </row>
                  <row>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter mail"
                        value={userMail}
                        readOnly={!editMode}
                        onChange={(e) => setUserMail(e.target.value)}
                      />
                    </Form.Group>
                  </row>
                </Col>
              </Row>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter bio"
                    value={userBio}
                    readOnly={!editMode}
                    onChange={(e) => setUserBio(e.target.value)}
                  />
                </Form.Group>

                {editMode ? (
                  <>
                    <Button variant="primary" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleCancelEdit} className="ms-2">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={handleEditToggle}>
                    Edit Profile
                  </Button>
                )}
              </Form>
            </Col>
            <Col sm={2}></Col>
          </Row>
        </Container>
      </Container>

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
    </div>
  );
};

export default UserProfile;

