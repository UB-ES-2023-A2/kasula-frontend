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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
