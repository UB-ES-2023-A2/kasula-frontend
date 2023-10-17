import React, { useState } from 'react';
import "../css/PostRecipe.css";
import logo from '../assets/logo.png';

const RecipePost = () => {
    const [ingredients, setIngredients] = useState('');
    const [preparation, setPreparation] = useState('');

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
                    <label>INGREDIENTS</label>
                    <textarea 
                        value={ingredients} 
                        onChange={(e) => setIngredients(e.target.value)} 
                        maxLength={2000}
                        placeholder="Write something..."
                    />
                </div>
                <div className="input-section">
                    <label>PREPARATION</label>
                    <textarea 
                        value={preparation} 
                        onChange={(e) => setPreparation(e.target.value)} 
                        maxLength={2000}
                        placeholder="Write something..."
                    />
                </div>
                <div className="details-section">
                    <button>Upload image</button>
                    <div>Time: --:--</div>
                    <div>Difficulty: ★★★</div>
                    <div>Energy: ___kcal</div>
                </div>
                <button className="post-button">POST RECIPE</button>
            </div>
        </div>
    );
}

export default RecipePost;
