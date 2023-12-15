//He de fer un fetch a les notificacions de l'usuari i mostrar-les en NotificationsCard cadascuna
//React
import React, { useState, useEffect } from 'react'
import NotificationCard from "./NotificationCard"
import Dropdown from 'react-bootstrap/Dropdown';
import { BellFill } from 'react-bootstrap-icons';
import styled from 'styled-components';
import "../css/common.css";
import { useAuth } from "./AuthContext";
import { useLocation } from 'react-router-dom';


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

  console.log("Rendering NotificationBell...")

  const [notifications, setNotifications] = useState([])

  const [isFocused, setIsFocused] = useState(false);

  const [notificationsLoaded, setNotificationsLoaded] = useState(false);

  const { isLogged } = useAuth();

  const currentUserUsername = localStorage.getItem('currentUser')

  const location = useLocation();
  const isNotificationsRoute = location.pathname === '/notifications';

  const handleStatusChange = (id, newStatus) => {
    if (!isLogged() || isNotificationsRoute || notificationsLoaded === false) {
      return;
    }
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, status: newStatus } : notification
    ));
  };

  const getUnreadNotifications = () => {
    if (!isLogged() || isNotificationsRoute || notificationsLoaded === false || !Array.isArray(notifications)) {
      return 0;
    }
    return notifications?.filter(notification => notification.status === "unread").length;
  }

  const getRecipes = () => {
    console.log("Fetching notifications...");
    fetch(process.env.REACT_APP_API_URL + `/notification/` + currentUserUsername)
      .then((response) => response.json())
      .then((data) => {
        setNotifications(data)
        setNotificationsLoaded(true);
        console.log("Notifications have been loaded")
      })
      .catch((error) => { 
        setNotificationsLoaded(false);
        setNotifications([]);
        console.error("Error al obtenir notificacions:", error)
      });
  };

  useEffect(() => {
    if (isLogged()) {
      getRecipes()
    }
  }, [notifications])

  if (!isLogged() || isNotificationsRoute || notificationsLoaded === false || !Array.isArray(notifications)) { 
    return null;
  }
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
