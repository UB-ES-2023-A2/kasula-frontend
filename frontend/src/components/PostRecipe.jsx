import React, { useState, useRef, useContext } from 'react';
import "../css/PostRecipe.css";
import "../css/Transitions.css";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import logo from '../assets/logo.png';
import uploadIcon from '../assets/upload_icon.png';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { ArrowLeft, CheckCircleFill, Eye, EyeSlash, ExclamationTriangleFill } from "react-bootstrap-icons";

//React Components
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    Image,
    InputGroup,
    Modal
  } from "react-bootstrap";

const RecipePost = () => {
    const { token } = useAuth();

    const Unit = {
        cup: "cup",
        tbsp: "tbsp",
        tsp: "tsp",
        oz: "oz",
        lb: "lb",
        g: "g",
        kg: "kg",
        ml: "ml",
        l: "l",
        pt: "pt",
        qt: "qt",
        gal: "gal",
        count: "count"
    };

    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [preparation, setPreparation] = useState([]);
    const [time, setTime] = useState('');
    const [energy, setEnergy] = useState('');
    const [difficulty, setDifficulty] = useState(3);
    const ingredientNameRef = useRef(null);
    const ingredientQuantityRef = useRef(null);
    const instructionRef = useRef(null);
    const ingredientUnitRef = useRef(null);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [showPostRecipeConfirmation, setShowPostRecipeConfirmation] = useState(false);
    const [postSuccess, setPostRecipeSuccess] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const renderStars = (amount) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span 
                    key={i} 
                    onClick={() => setDifficulty(i)} 
                    style={{ color: i <= amount ? 'yellow' : 'grey' }}
                >
                    {i <= amount ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    };
    

    const handleIngredientDelete = (index) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setIngredients(newIngredients);
    };

    const convertTimeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        
        if (!newIngredients[index]) {
            newIngredients.push({ name: "", quantity: "", unit: "cup" });
        }
        
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };    
    

    const addIngredientField = () => {
        const newIngredient = {
            name: ingredientNameRef.current.value,
            quantity: ingredientQuantityRef.current.value,
            unit: ingredientUnitRef.current.value
        };
        setIngredients([...ingredients, newIngredient]);
        ingredientNameRef.current.value = "";
        ingredientQuantityRef.current.value = "";
    };    

    const handleInstructionChange = (index, value) => {
        const newInstructions = [...preparation];
        if (index >= newInstructions.length) {
            newInstructions.push({ body: value, step_number: newInstructions.length + 1 });
        } else {
            newInstructions[index] = { ...newInstructions[index], body: value };
        }
        setPreparation(newInstructions);
    };    

    const addInstructionField = () => {
        const newInstruction = {
            body: instructionRef.current.value,
            step_number: preparation.length + 1
        };
        setPreparation([...preparation, newInstruction]);
        instructionRef.current.value = "";
    };      

    const handleInstructionDelete = (index) => {
        const newInstructions = [...preparation];
        newInstructions.splice(index, 1);
        newInstructions.forEach((inst, idx) => {
            inst.step_number = idx + 1;
        });
        setPreparation(newInstructions);
    };

    const validateRecipeData = (data) => {
        if (!data.name) return "Name is required!";
        if (!data.cooking_time) return "Cooking time is required!";
        if (!data.difficulty) return "Difficulty is required!";
        if (!data.energy) return "Energy is required!";
        if (!data.ingredients) return "Ingredients are required!";
        if (!data.instructions) return "Instructions are required!";
        
        return null;
    };
    
    const handleSubmit = async () => {
        const recipeData = {
            name: recipeName,
            cooking_time: time,
            difficulty: difficulty,
            energy: parseInt(energy),
            image: image,
            ingredients: ingredients,
            instructions: preparation
        };

        const errorMessage = validateRecipeData(recipeData);
        if (errorMessage) {
            alert(errorMessage);
            return;
        }
    
        try {
            const response = await fetch('http://127.0.0.1:8000/recipe/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(recipeData)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setSubmitMessage("Recipe posted successfully:", data);
                setPostRecipeSuccess(true);
            } else {
                setSubmitMessage("Error posting recipe:", data);
            }
        } catch (error) {
            setSubmitMessage(error.JSON.stringify);
            setPostRecipeSuccess(false);
          } finally {
            setShowPostRecipeConfirmation(true);
          }
    };
    
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImage(e.target.result);
          };
          reader.readAsDataURL(file);
        }
    }

    const handlePostRecipeConfirmationClose = () => {
        setShowPostRecipeConfirmation(false);
        if (postSuccess) {
          navigate("/userfeed");
        }
      }

    return (
        <div>
        <Container fluid className="bg-image min-vh-100">
            <Row className="bg-danger text-white">
                <Col sm={1} className="py-2"> 
                <Image src={logo} alt="KASULÀ" fluid />
                </Col>
                <Col sm={11}></Col>
            </Row>
            
        <Container className='translucidContainer mt-5'>
                    <Row>
                        <Col xs={5}></Col>
                            <Col xs={6}>
                                <h2 id='title'>Post recipe</h2>
                            </Col>
                        <Col xs={3}></Col>
                    </Row>
            <Row>
            <Col sm={3} md={3} lg={3}>
                <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
                    <Container id='recipe-container' className="mt-3 rounded box-shadow">
                        <Row>
                            <Col xs={12}>
                            <div className="ingredient-list">
                                <TransitionGroup component={null}>
                                        {ingredients.map((ingredient, index) => (
                                            <CSSTransition key={index} timeout={500} classNames="ingredient-fade">
                                            <div key={index}>
                                                <Row>
                                                    <Col xs={9}>
                                                        <span>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</span>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Button id='buttons_remove' classNames="remove-button" onClick={() => handleIngredientDelete(index)}>X</Button>{' '}
                                                    </Col>
                                                </Row>
                                            </div>
                                            </CSSTransition>
                                        ))}
                                        </TransitionGroup>
                                    </div>
                            </Col>
                        </Row>   
                    </Container>
                </CSSTransition>
            </Col>
                
            <Col sm={6}>
                <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
                <Container id='recipe-container' className="rounded box-shadow">
                    <Row>
                        <Col sm={12}>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Recipe name"
                                className="mb-3 mt-3"
                            >
                                <Form.Control placeholder="name@example.com" 
                                value={recipeName} 
                                onChange={(e) => setRecipeName(e.target.value)} 
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} md={6} lg={6}>
                            <label>INGREDIENTS</label>
                                    <Row className='mt-2 mb-1'>
                                    <Col sm={12}>
                                        <Form.Control placeholder="Name" 
                                        ref={ingredientNameRef}
                                        />
                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col sm={7}>
                                    <Form.Control type="number" placeholder="Quantity" 
                                        ref={ingredientQuantityRef}
                                        />
                                    </Col>
                                    <Col sm={5}>
                                    <Form.Select className="ingredient-unit-select" ref={ingredientUnitRef} aria-label="Ingredient Unit Selection">
                                        {Object.values(Unit).map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </Form.Select>
                                    </Col>
                                    </Row>
                                    <div className="d-grid gap-2">
                                    <Button className='mb-3' onClick={addIngredientField} variant="danger">Add ingredient</Button>
                                    </div>
                                    
                        </Col>
                        <Col xs={6} md={6} lg={6}>
                            <label>PREPARATION</label>
                                    <Row className='mt-2'>
                                        <Col sm={12}>
                                            <Form.Control type="text"
                                            ref={instructionRef}
                                            placeholder={`Step ${preparation.length > 0 ? preparation.length + 1 : 1}`}
                                            maxLength={2000}
                                            />
                                        </Col>
                                        <Col sm={12}>
                                        <div className="d-grid gap-2">
                                        <Button className='mb-3' style={{marginTop: '10px'}} onClick={addInstructionField} variant="danger">Add step</Button>{' '}
                                        </div>
                                        </Col>
                                    </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} md={6} lg={6}>
                            <Row>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Upload an image</Form.Label>
                                    <Form.Control type="file" onChange={handleImageUpload}/>
                                </Form.Group>
                            </Row>
                        </Col>
                        <Col xs={6} md={6} lg={6}>
                            <Row>
                                <Form.Group className="mb-3">
                                <Form.Label>Cooking time</Form.Label>
                                    <Form.Control
                                            ref={instructionRef}
                                            placeholder={`Minutes`}
                                            value={time}
                                            type="number" 
                                            onChange={(e) => setTime(e.target.value)} 
                                    />
                                </Form.Group>
                            </Row>
                        </Col>
                        <Col xs={6} md={6} lg={6}>
                            <Row>
                                <label>Difficulty</label>
                            </Row>
                            <Row>
                                <div className="difficulty">
                                        {renderStars(difficulty)}
                                    </div>  
                            </Row>
                        </Col>
                        <Col xs={6}>
                            <Row>
                                <Form.Group className="mb-3">
                                <Form.Label>Energy</Form.Label>
                                    <Form.Control
                                            ref={instructionRef}
                                            type="number" 
                                            placeholder={`Kcal`}
                                            value={energy}
                                            onChange={(e) => setEnergy(e.target.value)} 
                                    />
                                </Form.Group>
                            </Row>
                        </Col>
                    </Row> 
                    <Row>
                        <Col xs={3}></Col>
                        <Col xs={6}>
                            <Button className='mb-3' style={{marginTop: '10px'}} onClick={handleSubmit} variant="danger">POST RECIPE</Button>{' '}
                        </Col>
                        <Col xs={3}></Col>
                    </Row>     
                </Container>                             
            </CSSTransition>
            </Col>
            <Col sm={3}>
                <CSSTransition in={true} timeout={500} classNames="slideUp" appear>
                    <Container id='recipe-container' className="mt-3 rounded box-shadow">
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                            <div className="preparation-list">
                                <TransitionGroup component={null}>
                                        {preparation.map((step, index) => (
                                            <CSSTransition key={index} timeout={500} classNames="ingredient-fade">
                                            <div key={index}>
                                                <Row>
                                                    <Col xs={9} md={9} lg={9}>
                                                        <span>Step {step.step_number}: {step.body}</span>
                                                    </Col>
                                                    <Col xs={3} md={3} lg={3}>
                                                        <Button id='buttons_remove' onClick={() => handleInstructionDelete(index)}>X</Button>{' '}
                                                    </Col>
                                                </Row>
                                            </div>
                                            </CSSTransition>
                                        ))}
                                        </TransitionGroup>
                                    </div>
                            </Col>
                        </Row>   
                    </Container>
                </CSSTransition>
            </Col>
            </Row>
        </Container>
        </Container>

        <Modal show={showPostRecipeConfirmation} size="sm" onHide={handlePostRecipeConfirmationClose}>
        <Modal.Header closeButton>
        <Modal.Title>{postSuccess ? "Confirm Posting" : "Posting Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row>
            <Col className="text-center mb-4">
            {postSuccess ? <CheckCircleFill className="text-success" size={100} /> : <ExclamationTriangleFill className="text-warning" size={100} />}
            </Col>
        </Row>
        <Row>
            <Col className="text-center">
            <p>{submitMessage}</p>
            </Col>
        </Row>
        </Modal.Body>
        <Modal.Footer>
        <Button variant={postSuccess ? "success" : "secondary"} onClick={handlePostRecipeConfirmationClose}>
            {postSuccess ? "Go to recipes" : "Close"}
        </Button>
        </Modal.Footer>
        </Modal>
        </div>
    );
}

export default RecipePost;
