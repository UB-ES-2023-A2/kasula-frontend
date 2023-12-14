//He de fer un fetch a les notificacions de l'usuari i mostrar-les en NotificationsCard cadascuna
//React
import { CSSTransition } from "react-transition-group"
import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { Container, Row, Col } from "react-bootstrap"
import NotificationCard from "./NotificationCard"
import Dropdown from 'react-bootstrap/Dropdown';
import { BellFill } from 'react-bootstrap-icons';
import styled from 'styled-components';


const CustomToggle = styled(Dropdown.Toggle)`
  &::after {
    display: none;
  }
`;


export default function Notifications() {

  console.log("Notifications constructor call start")

  const [notifications, setNotifications] = useState([])

  const currentUserUsername = localStorage.getItem('currentUser')
  console.log("Current user: " + currentUserUsername)

  const getRecipes = () => {
    console.log("Fetching notifications...");
    fetch(process.env.REACT_APP_API_URL + `/notification/` + currentUserUsername)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setNotifications(data)
        //setLoading(false);
      })
      .catch((error) => { 
        console.error("Error al obtenir notificacions:", error)
        //setLoading(false)
      });
  };

  useEffect(() => {
    console.log("useEffect call")
    getRecipes()
  }, [])

  /*useEffect(() => {
    setLoading(true);
    if (!isLogged()) {
      navigate("/login");
      setLoading(false);
    } else {
      getRecipes();
    }
  }, [id, name]);*/

  console.log("Notifications constructor call end");

  const onClick = () => {
      alert("notification added");
    }

  return (
    <>
    <h1>Notifications</h1>

    <Dropdown>
      <CustomToggle variant="success" id="dropdown-basic" >
      <BellFill />
    <span className="badge rounded-pill badge-notification bg-danger">{notifications.length}</span>
      </CustomToggle>

      <Dropdown.Menu>
        {notifications.map(notification => (
            <Dropdown.Item
              href={"#/"+notification.link}>
              <NotificationCard notification={notification} />
            </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>

    <button onClick={onClick} className="add-notification-button">
        Add Notification
      </button>
    
    <Container>
        {notifications.map(notification => (
            <Row key={notification.id}>
                <Col xs={12}>
                    <NotificationCard notification={notification} />
                </Col>
            </Row>
        ))}
    </Container>
    </>
);
        }

    // <Container className="pb-5 pt-3">
    //   <Row>
    //     {notifications && notifications.length > 0 ? (
    //       notifications.map((notification) => (
    //         <Col sm={12} md={6} xl={4}>
    //           <CSSTransition
    //             in={true}
    //             timeout={500}
    //             classNames="slideUp"
    //             appear
    //           >
    //             <div className="position-relative transition-03s">
    //               <Link
    //                 key={notification._id}
    //                 to={'/'}//{`/RecipeDetail/${recipe._id}`}
    //                 className="text-decoration-none"
    //               >
    //                 <NotificationCard notification={notification} />
    //               </Link>
    //               {/* {canDelete && (
    //                 <span
    //                   className="fs-3 colorless-span-button position-absolute top-0 end-0 mx-2"
    //                   role="button"
    //                   onClick={() => {
    //                     fetch(
    //                       process.env.REACT_APP_API_URL +
    //                         `/collection/${id}/remove_recipe/${recipe._id}`,
    //                       {
    //                         method: "PUT",
    //                         headers: {
    //                           Authorization: `Bearer ${token}`,
    //                         },
    //                       }
    //                     )
    //                       .then((response) => response.json())
    //                       .then((data) => {
    //                         console.log(data);
    //                         //onDeleteRecipe();
    //                       })
    //                       .catch((error) =>
    //                         console.error("Error al obtener recetas:", error)
    //                       );
    //                   }}
    //                 >
    //                   <X className="rounded-circle highlighter" />
    //                 </span>
    //               )} */}
    //             </div>
    //           </CSSTransition>
    //         </Col>
    //       ))
    //     ) : (
    //       <div className="alert alert-warning" role="alert">
    //         There are currently no recipes
    //       </div>
    //     )}
    //   </Row>
    // </Container>
//   );
// }
