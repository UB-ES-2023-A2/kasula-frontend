import React from "react";
import ReactDOM from "react-dom/client";
import PostRecipe from "./components/PostRecipe";
import reportWebVitals from "./reportWebVitals";
import RecipeDetail from "./components/RecipeDetail";
import UserFeed from "./components/UserFeed";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Logout from "./components/Logout";
import PasswordRecovery from "./components/PasswordRecovery";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/recipeDetail" element={<RecipeDetail />} />
            <Route path="/postRecipe" element={<PostRecipe />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/userfeed" element={<UserFeed />} />
            <Route path="/RecipeDetail/:id" element={<RecipeDetail />} />
            <Route path="/passwordrecovery" element={<PasswordRecovery />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  </React.StrictMode>
); 

reportWebVitals();