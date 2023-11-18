//React
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

//Bootstrap
import { Container } from "react-bootstrap";

//Components
import KasulaNavbar from "./KasulaNavbar";
import Login from "./Login";
import Signup from "./Signup";
import PasswordRecovery from "./PasswordRecovery";
import PasswordChange from "./PasswordChange";
import UserFeed from "./UserFeed";
import RecipeDetail from "./RecipeDetail";
import UserProfile from "./UserProfile";

//CSS
import "../css/Transitions.css";
import "../css/Root.css";
import "../css/common.css";

function Root() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Container className="my-0 pt-0 pb-4 px-0 min-vh-100">
                <KasulaNavbar></KasulaNavbar>
                <Container className="bg-lightest min-vh-100">
                  <UserFeed></UserFeed>
                </Container>
              </Container>
            }
          ></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/RecipeDetail/:id"
            element={
              <Container className="my-0 pt-0 pb-4 px-0 min-vh-100">
                <KasulaNavbar></KasulaNavbar>
                <Container className="bg-lightest min-vh-100">
                  <RecipeDetail></RecipeDetail>
                </Container>
              </Container>
            }
          ></Route>
          <Route path="/passwordrecovery" element={<PasswordRecovery />} />
          <Route path="/passwordrecovery/set" element={<PasswordChange />} />
          <Route
            path="userprofile/:userId"
            element={
              <Container className="my-0 pt-0 pb-4 px-0 min-vh-100">
                <KasulaNavbar></KasulaNavbar>
                <Container className="min-vh-100">
                  <UserProfile></UserProfile>
                </Container>
              </Container>
            }
          ></Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default Root;
