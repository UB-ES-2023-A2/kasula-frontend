import React, { useState, useRef, useContext } from 'react';
import "../css/PostRecipe.css";
import logo from '../assets/logo.png';
import uploadIcon from '../assets/upload_icon.png';
import { useAuth } from './AuthContext'; // Asegúrate de actualizar esta ruta

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

    const renderStars = (amount) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} onClick={() => setDifficulty(i)}>
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
    }

    const handleSubmit = async () => {
        const recipeData = {
            name: recipeName,
            cooking_time: convertTimeToMinutes(time),
            difficulty: difficulty,
            energy: parseInt(energy),
            image: "imgurl",
            ingredients: ingredients,
            instructions: preparation
        };
    
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
                console.log("Recipe posted successfully:", data);
            } else {
                console.error("Error posting recipe:", data);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="recipe-container">
            <div className="header">
                <img src={logo} alt="Logo" className="logo"/>
                <h1>KASULÁ</h1>
                <div className="lang-user">
                    <span>EN</span>
                    <span>Username_tst</span>
                </div>
            </div>
            <div className="recipe-form">
                <h2>Post recipe</h2>

                <div className="input-section">
                    <label>Recipe Name</label>
                    <input 
                        type="text" 
                        value={recipeName} 
                        onChange={(e) => setRecipeName(e.target.value)} 
                        placeholder="Enter Recipe Name" 
                    />
                </div>

                <div className="input-section ingredients-section">
                    <label>INGREDIENTS</label>
                    <div className="ingredient-list">
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="ingredient-item">
                                <span>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</span>
                                <button onClick={() => handleIngredientDelete(index)}>X</button>
                            </div>
                        ))}
                    </div>
                    <div className="ingredient-input-group">
                        <input 
                            type="text" 
                            ref={ingredientNameRef}
                            placeholder="Ingredient Name"
                        />

                        <input 
                            type="number" 
                            ref={ingredientQuantityRef}
                            placeholder="Quantity"
                        />
                        <select className="ingredient-unit-select"
                            ref={ingredientUnitRef}
                        >
                            {Object.values(Unit).map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={addIngredientField}>Add ingredient</button>
                </div>

                <div className="input-section preparation-section">
                    <label>PREPARATION</label>
                    <div className="preparation-list">
                        {preparation.map((step, index) => (
                            <div key={index} className="preparation-item">
                                <span>Step {step.step_number}: {step.body}</span>
                                <button onClick={() => handleInstructionDelete(index)}>X</button>
                            </div>
                        ))}
                    </div>
                    <div className="instruction-input-group">
                        <textarea 
                            ref={instructionRef}
                            placeholder={`Step ${preparation.length > 0 ? preparation.length + 1 : 1}`}
                            maxLength={2000}
                        />
                    </div>
                    <button style={{marginTop: '10px'}} onClick={addInstructionField}>Add step</button>
                </div>

                <div className="recipe-details">
                    <div className="upload-btn-wrapper">
                        <button className="upload-button">
                            <img src={uploadIcon} alt="Upload Icon" className="upload-icon" /> Upload Image
                        </button>
                        <input type="file" />
                    </div>

                    <div className="detail-item">
                        <label>Time of Cook</label>
                        <div className="time-input">
                            <input 
                                type="time" 
                                value={time}
                                onChange={(e) => setTime(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="detail-item">
                        <label>Difficulty</label>
                        <div className="difficulty">
                            {renderStars(difficulty)}
                        </div>
                    </div>

                    <div className="detail-item">
                        <label>Energy (kcal)</label>
                        <div className="energy-input">
                            <input 
                                type="number" 
                                value={energy} 
                                onChange={(e) => setEnergy(e.target.value)} 
                                placeholder="kcal"
                            />
                        </div>
                    </div>
                </div>

                <button className="post-button" onClick={handleSubmit}>POST RECIPE</button>
            </div>
        </div>
    );
}

export default RecipePost;
