import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Logout from "./components/Logout";
import reportWebVitals from "./reportWebVitals";
import RecipeDetail from "./components/RecipeDetail";
import UserFeed from "./components/UserFeed";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <Logout /> */}
    {/* <RecipeDetail /> */}
    <UserFeed />
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
