//React
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../css/common.css";

//Bootstrap
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Modal,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { ExclamationTriangleFill, PlusLg } from "react-bootstrap-icons";

//Components
import PostRecipe from "./PostRecipe";

//Assets
import logo from "../assets/logo.png";
import chef from "../assets/chef.png";

function KasulaNavbar() {
  const { token, logout, isLogged } = useAuth();
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showPostRecipe, setShowPostRecipe] = useState(false);

  useEffect(() => {
    if (isLogged()) {
      getLoggedUserData();
    }
  }, []);

  const getLoggedUserData = () => {
    fetch(process.env.REACT_APP_API_URL + "/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User data:", data);
        setUser(data);
        {window.localStorage.setItem("currentUser", data.username)}
      })
      .catch((error) => console.error("Error al obtener recetas:", error));
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClosePostRecipeModal = () => {
    setShowPostRecipe(false);
  };

  const handleClosePostRecipeSuccessfulModal = () => {
    setShowPostRecipe(false);
    //window.location.reload();
  };

  const handleLogout = () => {
    localStorage.setItem("logged", "false"); // This will update the localStorage
    handleCloseModal(); // This will close the modal
    logout(); // This will remove the token from the localStorage
  };

  return (
    <>
      <Navbar expand="lg" className="bg-normal sticky-top">
        <Container fluid>
          <Navbar.Brand>
            <Link to="/">
              <Image
                src={logo}
                width="96"
                height="96"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle
            className="me-3 navbar-button"
            aria-controls="navbar-nav"
          />
          <Navbar.Collapse id="navbar-nav">
                <Nav className="me-auto fs-5">
                  <Nav.Link href="/">Feed</Nav.Link>
                  <Nav.Link href="/collections">Collections</Nav.Link>
                </Nav>
                {isLogged() && (
                  <>
                  <Button
                    className="me-4 fs-5 border-0"
                    id="positiveButton"
                    onClick={() => setShowPostRecipe(true)}
                  >
                    <PlusLg></PlusLg> Recipe
                  </Button>
                  <Nav className="fs-5 me-4">
                    <NavDropdown
                      title={
                        <>
                          <Image
                            className="me-2"
                            src={chef} // replace with the actual image source
                            alt={chef}
                            roundedCircle
                            width={30}
                            height={30}
                          />
                          <span className="min-width-container">{user.username}</span>
                        </>
                      }
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Item href="#action/3.2">
                        My Information
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.1">
                        My Recipes
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.2">
                        Followed Users
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.3">
                        Followers
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        role="button"
                        onClick={() => handleOpenModal()}
                        href="#action/3.4"
                      >
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                  </>
                )}
              {!isLogged() && (
                <Link
                  to="/login"
                  className="btn ms-auto me-4 fs-5 border-0"
                  id="mainButton"
                >
                  Log In
                </Link>
              )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal
        show={showPostRecipe}
        size="lg"
        onHide={handleClosePostRecipeModal}
      >
        <Modal.Header closeButton className="bg-normal">
          <Modal.Title className="fs-3 fw-semi-bold">Post Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <PostRecipe
            onClose={handleClosePostRecipeSuccessfulModal}
          ></PostRecipe>
        </Modal.Body>
      </Modal>
      <Modal show={showModal} size="sm" onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="text-center mb-4">
              <ExclamationTriangleFill className="text-warning" size={100} />
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              <p className="ms-0">Are you sure you want to Log Out?</p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="danger" onClick={handleLogout}>
            Log Out
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default KasulaNavbar;
