import React, { useState } from 'react';
import "../css/Login.css";
import logo from '../assets/logo.png';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [RepeatedPassword, setRepeatedPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);

    const isPasswordSecure = (pwd) => {
        if (pwd.length < 8) {
            return "La contrasenya ha de tenir almenys 8 caràcters.";
        }
        if (!/[a-z]/.test(pwd)) {
            return "La contrasenya ha de contenir almenys una lletra minúscula.";
        }
        if (!/[A-Z]/.test(pwd)) {
            return "La contrasenya ha de contenir almenys una lletra majúscula.";
        }
        if (!/\d/.test(pwd)) {
            return "La contrasenya ha de contenir almenys un número.";
        }
        if (!/[@$!%*?&]/.test(pwd)) {
            return "La contrasenya ha de contenir almenys un caràcter especial com @$!%*?&.";
        }
        return "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const passwordValidationMsg = isPasswordSecure(password);
        if (passwordValidationMsg) {
            setPasswordError(passwordValidationMsg);
            return;
        }

        if (password !== RepeatedPassword) {
            setPasswordError("Les contrassenyes no coincideixen!");
            return;
        }

        setPasswordError('');
        // Continuar con el procesamiento de registro (autenticación, etc.)
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Logo" className="logo" />

                <div className="password-container">
                    <input 
                        type="text" 
                        placeholder="Usuari" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="password-container">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Contrasenya" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                    />
                    <span onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? '👁️' : '🙈'}
                    </span>
                </div>
                <div className="password-container">
                    <input 
                        type={showRepeatedPassword ? "text" : "password"} 
                        placeholder="Repeteix la contrassenya" 
                        value={RepeatedPassword} 
                        onChange={e => setRepeatedPassword(e.target.value)}
                    />
                    <span onClick={() => setShowRepeatedPassword(!showRepeatedPassword)}>
                        {showRepeatedPassword ? '👁️' : '🙈'}
                    </span>
                </div>
                {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}
                <button type="submit">REGISTRAR-TE</button>
                <a href="/login">Et trobes ja registrat?</a>
            </form>
        </div>
    );
}

export default Signup;
