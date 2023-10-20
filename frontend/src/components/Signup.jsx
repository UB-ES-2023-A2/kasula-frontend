import React, { useState } from 'react';
import "../css/Signup.css";
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [RepeatedPassword, setRepeatedPassword] = useState('');
    const [bio, setBio] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);
    const [generalMessage, setGeneralMessage] = useState('');
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

        setPasswordError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                    window.alert("Hi ha hagut un error inesperat. Si us plau, intenta-ho de nou.");
                }
            } else {
                const data = await response.json();
                window.alert("Usuari registrat amb èxit!");
                navigate("/login");
            }
        } catch (error) {
            window.alert(error.JSON.stringify);
        }
    };

    return (
        <div className="login-container">
            <form id='form-singup' onSubmit={handleSubmit}>
                <img src={logo} alt="Logo" class="logo_logut" />
                
                <div className="input-container">
                    <input 
                        type="text" 
                        placeholder="Usuari" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="input-container">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="password-container password-container-signup">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Contrasenya" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? '👁️' : '🙈'}
                    </span>
                </div>

                <div className="password-container password-container-signup">
                    <input 
                        type={showRepeatedPassword ? "text" : "password"} 
                        placeholder="Repeteix la contrassenya" 
                        value={RepeatedPassword} 
                        onChange={e => setRepeatedPassword(e.target.value)}
                        required
                    />
                    <span className="toggle-password" onClick={() => setShowRepeatedPassword(!showRepeatedPassword)}>
                        {showRepeatedPassword ? '👁️' : '🙈'}
                    </span>
                </div>

                <div className="input-container">
                    <textarea 
                        placeholder="Bio (opcional)" 
                        value={bio} 
                        onChange={e => setBio(e.target.value)}
                    ></textarea>
                </div>

                {passwordError && <p style={{color: 'red'}}>{passwordError}</p>}
                {generalMessage && <p style={{color: generalMessage.includes("èxit") ? 'green' : 'red'}}>{generalMessage}</p>}

                <button style={{marginTop: '10px'}} type="submit">REGISTRAR-TE</button>
                <a style={{marginBottom: '5px'}} href="/login">Et trobes ja registrat?</a>
            </form>
        </div>
    );
}

export default Signup;