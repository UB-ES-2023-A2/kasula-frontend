//Logic packages
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//React Components
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Image,
  InputGroup,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

//Styles
import "../css/Signup.css";

//Assets
import logo from "../assets/logo.png";

function Signup() {
  /* Variables */

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");

  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [confirmPasswordValidated, setConfirmPasswordValidated] =
    useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalMessage, setGeneralMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  /* Functions */

  const isPasswordSecure = (pwd = "") => {
    setPasswordValid(false);

    if (pwd.length === 0) {
      setPasswordError("This field is required");
    } else if (pwd.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else if (pwd.search(/[a-z]/i) < 0) {
      setPasswordError("Password must contain at least one letter");
    } else if (pwd.search(/[A-Z]/) < 0) {
      setPasswordError("Password must contain at least one capital letter");
    } else if (pwd.search(/[0-9]/) < 0) {
      setPasswordError("Password must contain at least one number");
    } else if (pwd.search(/[ !@#$%^&\*-\._,;ºª\\/()~?¿¡:="·<>{}[\]+]/) < 0) {
      setPasswordError("Password must contain at least one special character");
    } else {
      setPasswordError("");
      setPasswordValid(true);
    }

    setPasswordValidated(true);
  };

  const checkPasswordsMatch = (pwd = "", confirmPwd = "") => {
    setPasswordsMatch(false);
    if (pwd.length === 0) {
      setConfirmPasswordError("This field is required");
    } else if (pwd !== confirmPwd) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
      setPasswordsMatch(true);
    }

    setConfirmPasswordValidated(true);
  };

  /* Events */

  const onPasswordChange = ({ target: { value } }) => {
    isPasswordSecure(value);
    if (value.length === 0) {
      setPasswordValidated(false);
    }
    setPassword(value);
  };

  const onConfirmPasswordChange = ({ target: { value } }) => {
    checkPasswordsMatch(password, value);
    if (value.length === 0) {
      setConfirmPasswordValidated(false);
    }
    setConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    isPasswordSecure(password);
    checkPasswordsMatch(password, confirmPassword);

    // Validaciones:

    /*
    const passwordValidationMsg = isPasswordSecure(password);
    if (passwordValidationMsg) {
      setPasswordError(passwordValidationMsg);
      return;
    }
    setPasswordError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          bio: bio || "This is a short bio",
          profile_picture: "imgurl",
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        if (data && data.detail) {
          setGeneralMessage(data.detail);
        } else {
          setGeneralMessage(
            "Hi ha hagut un error inesperat. Si us plau, intenta-ho de nou."
          );
        }
      } else {
        const data = await response.json();
        setGeneralMessage("Usuari registrat amb èxit!");
        navigate("/login");
      }
    } catch (error) {
      setGeneralMessage(error.JSON.stringify);
    }*/
  };

  /* Render */

  return (
    <div className="register min-vh-10">
      <Container className="pt-5 pb-5">
        <Row>
          <Col sm={3}></Col>
          <Col sm={6} className="register-container rounded">
            <Row>
              <Col sm={4}></Col>
              <Col sm={4}>
                <Image className="mt-4 mb-4" src={logo} fluid />
              </Col>
              <Col sm={4}></Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <h1 className="register-title">Register</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="register-description mb-4">
                  Register and enjoy the benefits of Posting your own recipes
                  and providing feedback to others! You will also be able to
                  save your favourite recipes!
                </p>
              </Col>
            </Row>
            <Row className="register-form">
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formUsername">
                  <Form.Label>User</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Type your username"
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Type your email"
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      required
                      className={
                        passwordValidated
                          ? passwordValid
                            ? "is-valid"
                            : "is-invalid"
                          : ""
                      }
                      type={showPassword ? "text" : "password"}
                      placeholder="Type your password"
                      onChange={onPasswordChange}
                      value={password}
                    />
                    <InputGroup.Text
                      className="password-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlash /> : <Eye />}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {passwordError}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-4" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      required
                      className={
                        confirmPasswordValidated
                          ? passwordsMatch
                            ? "is-valid"
                            : "is-invalid"
                          : ""
                      }
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Type your password again"
                      onChange={onConfirmPasswordChange}
                      value={confirmPassword}
                    />
                    <InputGroup.Text
                      className="password-icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <EyeSlash /> : <Eye />}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {confirmPasswordError}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-4" controlId="formBio">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Describe yourself (optional)"
                  />
                </Form.Group>
                <Form.Group className="mb-5" controlId="formAcceptTerms">
                  <Form.Check
                    type="checkbox"
                    label="I accept the Terms of Use and Privacy Policy"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" id="formButtonRegister">
                  REGISTER NOW
                </Button>
              </Form>
            </Row>
          </Col>
          <Col sm={3}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Signup;
