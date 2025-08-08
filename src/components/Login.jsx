// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/teolingo-logo.png';
import '../App.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: "rgb(128,191,255)" }}>
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: 400, width: "100%" }}>
        <div className="text-center mb-3">
          <div className="duo-logo-bg">
            <img src={logo} alt="Teolingo Logo" style={{ width: 120, height: 120 }} />
          </div>
          <h1 className="duo-title mt-2 mb-1">Teolingo</h1>
        </div>
        <h2 className="fw-bold mb-4 text-center" style={{ color: "rgb(128,191,255)" }}>Iniciar Sesión</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control form-control-lg rounded-pill"
              required
              style={{ borderColor: "rgb(128,191,255)" }}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control form-control-lg rounded-pill"
              required
              style={{ borderColor: "rgb(128,191,255)" }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-lg w-100 rounded-pill"
            style={{ backgroundColor: "rgb(128,191,255)", borderColor: "rgb(128,191,255)", color: "#fff", fontWeight: 700 }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
