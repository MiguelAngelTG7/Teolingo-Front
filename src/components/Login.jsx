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
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: '#111' }}>
      <div className="shadow-lg p-4 rounded-4" style={{ maxWidth: 400, width: '100%', background: '#181818', border: '2px solid #fff', color: '#fff', boxShadow: '0 2px 16px #0006' }}>
        <div className="text-center mb-3">
          <div style={{ background: '#232323', borderRadius: '50%', width: 120, height: 120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px #0005' }}>
            <img src={logo} alt="Teolingo Logo" style={{ width: 90, height: 90 }} />
          </div>
          <h1 className="mt-3 mb-1" style={{ color: '#fff', fontWeight: 900, fontSize: 32, letterSpacing: 0.5, textTransform: 'uppercase' }}>Teolingo</h1>
        </div>
        <h2 className="fw-bold mb-4 text-center" style={{ color: '#1cb0f6', fontWeight: 800, fontSize: 22, letterSpacing: 0.5 }}>Iniciar Sesión</h2>
        {error && <div className="alert alert-danger py-2" style={{ background: '#ff5252', color: '#fff', border: 'none', fontWeight: 700 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control form-control-lg rounded-pill"
              required
              style={{ borderColor: '#1cb0f6', background: '#232323', color: '#fff', fontWeight: 600, fontSize: 17, boxShadow: 'none' }}
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
              style={{ borderColor: '#1cb0f6', background: '#232323', color: '#fff', fontWeight: 600, fontSize: 17, boxShadow: 'none' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-lg w-100 rounded-pill fw-bold"
            style={{ background: '#1cb0f6', borderColor: '#1cb0f6', color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: 0.5, textTransform: 'uppercase', boxShadow: '0 2px 12px #0005' }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
