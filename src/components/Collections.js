import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { CSSTransition } from "react-transition-group";
import { Container, Row, Col, Image, Offcanvas, Button } from "react-bootstrap";

function Collections() {
  const { token } = useAuth();
  const [user, setUser] = useState({});
  const [isLogged, setIsLogged] = useState(
    localStorage.getItem("logged") === "true"
  );
  const [collections, setCollections] = useState([]);

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
    <div>
      <h1>Collections</h1>
    </div>
  );
}

export default Collections;
