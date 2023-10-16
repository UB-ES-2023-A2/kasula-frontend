import React from "react";
import "../css/Logout.css";
import logo from "../assets/logo.svg";

function Logout() {
  return (
    <div className="logout-container">
      <div className="header">
        <img src={logo} alt="Kasula" className="logo" />
        <h1>Kasula</h1>
      </div>
      <div className="logout-box">
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
