import React, { useState } from 'react';
import "../css/Login.css";
import logo from '../assets/logo.png';

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
                    setGeneralMessage("Hi ha hagut un error inesperat. Si us plau, intenta-ho de nou.");
                }
            } else {
                const data = await response.json();
                setGeneralMessage("Usuari registrat amb èxit!");
            }
        } catch (error) {
            setGeneralMessage("Hi ha hagut un error al connectar amb el servidor. Si us plau, intenta-ho de nou.");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Logo" className="logo" />
                
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

                <div className="password-container">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Contrasenya" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        required
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
                        required
                    />
                    <span onClick={() => setShowRepeatedPassword(!showRepeatedPassword)}>
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

                <button type="submit">REGISTRAR-TE</button>
                <a href="/login">Et trobes ja registrat?</a>
            </form>
        </div>
    );
}

export default Signup;
