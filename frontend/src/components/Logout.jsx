import React from "react";
import "../css/Logout.css";
import logo from "../assets/logo.png";
import background_image from "../assets/background.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // ensure the path is correct

function Logout() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // empty the token
    setToken(null);

    // redirect to login screen
    navigate('/login');
  };

  const handleCancel = () => {
    // go back to the user feed
    navigate("/userfeed");
  };

  return (
    <div className="logout-container">
      <div className="header_logout">
        <img src={logo} alt="KASULÀ" class="logo_logout" />
        <h1 class="h1_logout">KASULÀ</h1>
      </div>
      <div className="background-image"></div>

      <div className="logout-box">
        <img src={logo} alt="KASULÀ" id="logo_logout_2" />
        <div className="logout-message">
          <p>¿Desea cerrar sesión?</p>
        </div>
        <div className="button-container">
          <button onClick={handleLogout} className="logout-button">Aceptar</button>
          <button onClick={handleCancel} className="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
