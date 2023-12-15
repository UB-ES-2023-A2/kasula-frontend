//He de fer un fetch a les notificacions de l'usuari i mostrar-les en NotificationsCard cadascuna
//React
import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from "react-bootstrap"
import NotificationCard from "./NotificationCard"
import Dropdown from 'react-bootstrap/Dropdown';
import { BellFill } from 'react-bootstrap-icons';
import styled from 'styled-components';
import "../css/common.css";


const CustomToggle = styled(Dropdown.Toggle)`
  &::after {
    display: none;
  }
`;

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


export default function NotificationBell() {

  const [notifications, setNotifications] = useState([])

  const [isFocused, setIsFocused] = useState(false);

  const currentUserUsername = localStorage.getItem('currentUser')

  const handleStatusChange = (id, newStatus) => {
    setNotifications(notifications.map(notification => 
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

    <Dropdown>
      <CustomToggle variant="success" id="dropdown-basic" style={{backgroundColor: "transparent", border: "none"}}>
      <BellFill style={{ color: 'black', marginTop: '10px' }}/>
    <span className="badge rounded-pill badge-notification bg-danger">{getUnreadNotifications()}</span>
      </CustomToggle>

      <Dropdown.Menu style={{ maxHeight: '50vh', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#ffe7df' }}>
        {notifications.map(notification => (
            <Dropdown.Item
            className="my-dropdown-item"
            onClick={(e) => e.stopPropagation()}
              href={notification.link}
              style={isFocused ? { backgroundColor: 'transparent' } : {}}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  >
              <NotificationCard
                key={notification.id}
                notification={notification}
                username={currentUserUsername}
                onStatusChange={handleStatusChange}
              />
            </Dropdown.Item>
        ))}
        <Dropdown.Item href={"/notifications"}>View all</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    </>
);
}
