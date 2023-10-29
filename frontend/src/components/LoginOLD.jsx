//Logic packages
import { useAuth } from './AuthContext';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//React components
import {
    Container,
  Row,
  Col,
  Button,
  Form,
  Image,
}

import React, { useState } from 'react';
import queryString from 'query-string';
import "../css/Login.css";
import logo from '../assets/logo.png';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { token, setToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const apiUrl = 'http://127.0.0.1:8000/user/token';
        const requestBody = queryString.stringify({
            grant_type: '',
            username,
            password,
            scope: '',
            client_id: '',
            client_secret: ''
        });

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json',
                },
                body: requestBody
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Token obtenido:', data.access_token);
                setToken(data.access_token)
                navigate("/userfeed");
                
            } else {
                const errorData = await response.json();
                setPasswordError(errorData.detail || "Error al iniciar sesión.");
            }
        } catch (error) {
            setPasswordError("Hubo un problema al conectar con el servidor.");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Logo" className="logo_login" />
                
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
                <a href="/signup">Clica aqui per registrar-te</a>
            </form>
        </div>
    );
}

export default Login;
