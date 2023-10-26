//Logic packages
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//React Components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";

//Styles
import "../css/Signup.css";

//Assets
import logo from "../assets/logo.png";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [RepeatedPassword, setRepeatedPassword] = useState("");
  const [bio, setBio] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);
  const [generalMessage, setGeneralMessage] = useState("");
  const navigate = useNavigate();

  const isPasswordSecure = (pwd) => {
    // Aquí debería ir tu lógica para verificar la seguridad de la contraseña si es necesario.
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones:
    if (!username || !email || !password || !RepeatedPassword) {
      setGeneralMessage("Tots els camps són obligatoris, excepte la bio.");
      return;
    }

    const passwordValidationMsg = isPasswordSecure(password);
    if (passwordValidationMsg) {
      setPasswordError(passwordValidationMsg);
      return;
    }

    if (password !== RepeatedPassword) {
      setPasswordError("Les contrassenyes no coincideixen!");
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
    }
  };

  return (
    <div className="register">
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
              <Form>
                <Form.Group className="mb-4" controlId="formUsername">
                  <Form.Label>User</Form.Label>
                  <Form.Control placeholder="Type your username" />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Type your email" />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Type your password"
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Type your password again"
                  />
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
