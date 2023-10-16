import React, { useState } from 'react';
import "../css/Login.css";

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [RepeatedPassword, setRepeatedPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // To manage the visibility of the main password
  const [showRepeatedPassword, setShowRepeatedPassword] = useState(false); // To manage the visibility of the repeated password

  const handleSubmit = (e) => {
      e.preventDefault();
      if (password !== RepeatedPassword) {
          setPasswordError("Les contrassenyes no coincideixen!");
          return;
      }
      setPasswordError('');
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
