import React, { useState } from 'react';
import "../css/PostRecipe.css";
import logo from '../assets/logo.png';
import uploadIcon from '../assets/upload_icon.png';

const RecipePost = () => {
    const [ingredients, setIngredients] = useState('');
    const [preparation, setPreparation] = useState('');
    const [time, setTime] = useState('');
    const [energy, setEnergy] = useState('');
    const [difficulty, setDifficulty] = useState(3);

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

                <button className="post-button">POST RECIPE</button>
            </div>
        </div>
    );
}

export default RecipePost;
