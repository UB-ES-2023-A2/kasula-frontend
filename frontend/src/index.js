import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PostRecipe from "./components/PostRecipe";
import reportWebVitals from "./reportWebVitals";
import RecipeDetail from "./components/RecipeDetail";
import UserFeed from "./components/UserFeed";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Logout from "./components/Logout";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <Logout /> */}
    {/* <RecipeDetail /> */}
    {/* <UserFeed /> */}
    <Router>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/recipeDetail" element={<RecipeDetail />} />
            <Route path="/postRecipe" element={<PostRecipe />} />
            <Route path="/logout" element={<Logout />} /> {/* Asegúrate de haber importado el componente Logout si planeas usarlo */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    </Router>
  </React.StrictMode>
); 

reportWebVitals();

/*import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserFeed from "./components/UserFeed";
import RecipeDetail from "./components/RecipeDetail";
import Logout from "./components/Logout";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<UserFeed />} />
        <Route path="/RecipeDetail" element={<RecipeDetail />} />
        <Route path="/Logout" element={<Logout />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
 */
