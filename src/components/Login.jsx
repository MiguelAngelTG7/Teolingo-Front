// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/teolingo-logo.png';
import '../App.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Usamos el email como username
      const success = await login(username, password);
      if (success) {
        // Pequeño delay para asegurar que el token se guarde
        setTimeout(() => {
          navigate('/cursos');
        }, 100);
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" 
         style={{ background: '#111' }}>
      <div className="container" style={{ 
        maxWidth: 400, 
        background: '#181818', 
        padding: '32px 24px', 
        borderRadius: '18px',
        border: '3px solid #ffffffaf',
        boxShadow: '0 8px 32px rgba(255,255,255,0.1)'
      }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Teolingo Logo" style={{ width: 140, height: 140, marginBottom: 8 }} />
          <h1 className="mb-1 duolingo-font" style={{ color: '#fff', fontWeight: 900, fontSize: 32, letterSpacing: 0.5, textTransform: 'uppercase' }}>Teolingo</h1>
        </div>
        <h2 className="fw-bold mb-4 text-center duolingo-font" style={{ color: '#1cb0f6', fontWeight: 800, fontSize: 22, letterSpacing: 0.5 }}>Iniciar Sesión</h2>
        
        {error && (
          <div className="alert" style={{ 
            background: '#ff5b5b20', 
            color: '#ff5b5b',
            border: '1px solid #ff5b5b',
            borderRadius: '10px',
            padding: '10px 15px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Email"
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
            className="btn w-100"
            disabled={loading}
            style={{
              background: loading ? '#ccc' : '#1cb0f6',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '17px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              minWidth: '180px',
              fontWeight: '800'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link 
            to="/register" 
            style={{ 
              color: '#1cb0f6',
              textDecoration: 'none',
              fontSize: '16px',
              letterSpacing: '0.5px',
              fontWeight: '700'
            }}
          >
            ¿Nuevo usuario? Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
