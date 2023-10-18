import React from "react";
import "../css/Logout.css";
import logo from "../assets/logo.png";
import background_image from "../assets/background.png";

function Logout() {
  return (
    <div className="logout-container">
      <div className="header">
        <img src={logo} alt="Kasula" className="logo" />
        <h1>Kasula</h1>
      </div>
      <div className="background-image"></div>

      <div className="logout-box">
        <img src={logo} alt="Kasula" id="logo2" />
        <div className="logout-message">
          <p>¿Desea cerrar sesión?</p>
        </div>
        <div className="button-container">
          <button className="logout-button">Aceptar</button>
          <button className="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
