import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
