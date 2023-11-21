import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  Container,
  Row,
  Col,
  Image,
  Offcanvas,
  Button,
  Table,
  Card,
} from "react-bootstrap";
import {
  TrashFill,
  PencilFill,
  HeartFill,
  BoxArrowInRight,
  FolderPlus,
} from "react-bootstrap-icons";
import "../css/common.css";

function Collections() {
  const { token } = useAuth();
  const [user, setUser] = useState({});
  const [isLogged, setIsLogged] = useState(
    localStorage.getItem("logged") === "true"
  );
  const [collections, setCollections] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLogged(localStorage.getItem("logged") === "true");
    if (localStorage.getItem("logged") === "true") {
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
        getCollectionsData(data);
      })
      .catch((error) => console.error("Error when getting user:", error));
  };

  const getCollectionsData = (user) => {
    console.log(user);
    fetch(process.env.REACT_APP_API_URL + `/collection/user/${user.username}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Collections data:", data);
        setCollections(data);
      })
      .catch((error) =>
        console.error("Error when getting collections:", error)
      );
  };

  return (
    <Container className="pb-4">
      <h1 className="py-4 text-center text-uppercase">
        {user.username + "'s collections"}
      </h1>
      <Container className="bg-normal p-4 min-vh-100">
        <span className="d-flex">
          <span
            className="ms-auto colorless-span-button"
            role="button"
            onClick={() => {}}
          >
            <span className="me-2">New Collection</span>
            <FolderPlus className="fs-2" />
          </span>
        </span>
        {collections
          .sort((a, b) => (b.favorite ? 1 : -1)) // Sort by favorite status
          .map((collection, index) => (
            <Col sm={12} md={6} xl={4}>
              <Card>
                <Card.Header className="d-flex">
                  <>
                    {collection.favorite === true ? (
                      <span className="me-2">
                        <HeartFill style={{ color: "red" }}></HeartFill>
                      </span>
                    ) : (
                      <></>
                    )}
                  </>
                  <span className="me-auto">{collection.name}</span>
                  {collection.favorite === false ? (
                    <>
                      <span
                        className="colorless-span-button me-3"
                        role="button"
                        onClick={() => {}}
                      >
                        <PencilFill />
                      </span>
                      <span
                        className="colorless-span-button"
                        role="button"
                        onClick={() => {}}
                      >
                        <TrashFill />
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col xs={12}>
                      <span className="text-truncate">
                        {collection.description}
                      </span>
                    </Col>
                    <Col xs={12} className="d-flex my-0">
                      <Link
                        className="ms-auto"
                        to={`/collections/${collection._id}`}
                      >
                        <span
                          className="colorless-span-button fs-4"
                          role="button"
                        >
                          <BoxArrowInRight />
                        </span>
                      </Link>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Container>
    </Container>
  );
}

export default Collections;
