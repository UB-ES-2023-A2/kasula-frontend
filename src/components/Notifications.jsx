//He de fer un fetch a les notificacions de l'usuari i mostrar-les en NotificationsCard cadascuna
//React
import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from "react-bootstrap"
import NotificationCard from "./NotificationCard"

//Call the method every x seconds (will be used for checking new notifications on the backend)
function Timer({ method, seconds=30 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timerId = setInterval(() => {
      setCount(count + 1);
      console.log("Timer called");
      method();
    }, seconds*1000);
    return () => clearInterval(timerId); // cleanup on unmount
  }, []);
  return null; // Timer doesn't render anything
}


export default function Notifications() {

  const [notifications, setNotifications] = useState([])

  const currentUserUsername = localStorage.getItem('currentUser')

  const handleStatusChange = (id, newStatus) => {
    setNotifications(notifications?.map(notification => 
      notification.id === id ? { ...notification, status: newStatus } : notification
    ));
  };

  const getUnreadNotifications = () => {
    return notifications.filter(notification => notification.status === "unread").length;
  }

  const getRecipes = () => {
    console.log("Fetching notifications...");
    fetch(process.env.REACT_APP_API_URL + `/notification/` + currentUserUsername)
      .then((response) => response.json())
      .then((data) => {
        setNotifications(data)
      })
      .catch((error) => { 
        console.error("Error al obtenir notificacions:", error)
      });
  };

  useEffect(() => {
    getRecipes()
  }, [])

  return (
    <>

    <Timer method={getRecipes} />
    
    <Container>
        {notifications?.map(notification => (
            <Row key={notification.id}>
                <Col xs={12}>
                    <NotificationCard 
                      key={notification.id}
                      notification={notification}
                      username={currentUserUsername}
                      onStatusChange={handleStatusChange}
                    />
                </Col>
            </Row>
        ))}
    </Container>
    </>
);
}
