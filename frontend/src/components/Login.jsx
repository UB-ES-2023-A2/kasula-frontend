import React, { useState } from 'react';
import "../css/Login.css";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // To manage the visibility of the main password

    const handleSubmit = (e) => {
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src="../assets/logo.jpeg" alt="Logo" className="logo" />
                
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
                {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}
                <button type="submit">ENTRAR</button>
                <a href="/register">Clica aqui per registrar-te</a>
            </form>
        </div>
    );
}

export default Login;
