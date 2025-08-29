import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/axiosConfig';  // Updated import path

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    nombre_completo: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (!formData.email || !formData.nombre_completo || !formData.password || !formData.confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await register(
        formData.email,
        formData.nombre_completo,  // Cambiado el orden para coincidir con el backend
        formData.password
      );
      
      setSuccess('¡Registro exitoso! Por favor, revisa tu correo electrónico para verificar tu cuenta.');
      
      // Esperar un poco más antes de redirigir
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error("❌ Error completo:", err);
      
      if (err.response?.data) {
        // Manejar errores específicos del backend
        const errorMessage = typeof err.response.data === 'object' 
          ? Object.values(err.response.data).flat().join('\n')
          : err.response.data;
        setError(errorMessage);
      } else {
        setError('Error de conexión. Por favor intenta más tarde.');
      }
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{ background: '#111' }}
    >
      <div className="container" style={{ maxWidth: 400 }}>
        <h1
          className="text-center mb-4"
          style={{
            color: '#fff',
            fontWeight: 900,
            fontSize: '33px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}
        >
          Crear Cuenta
        </h1>

        {error && (
          <pre
            className="alert"
            style={{
              background: '#ff5b5b20',
              color: '#ff5b5b',
              border: '1px solid #ff5b5b',
              borderRadius: '10px',
              padding: '10px 15px',
              whiteSpace: 'pre-wrap'
            }}
          >
            {error}
          </pre>
        )}

        {success && (
          <div
            className="alert"
            style={{
              background: '#1cb0f620',
              color: '#1cb0f6',
              border: '1px solid #1cb0f6',
              borderRadius: '10px',
              padding: '10px 15px'
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={{ color: '#fff', marginBottom: '6px', display: 'block' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                background: '#232323',
                border: '2px solid #1cb0f6',
                color: '#fff',
                borderRadius: '10px',
                padding: '12px'
              }}
            />
          </div>

          <div className="mb-3">
            <label style={{ color: '#fff', marginBottom: '6px', display: 'block' }}>
              Nombre completo
            </label>
            <input
              type="text"
              className="form-control"
              value={formData.nombre_completo}
              onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
              required
              style={{
                background: '#232323',
                border: '2px solid #1cb0f6',
                color: '#fff',
                borderRadius: '10px',
                padding: '12px'
              }}
            />
          </div>

          <div className="mb-3">
            <label style={{ color: '#fff', marginBottom: '6px', display: 'block' }}>
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{
                background: '#232323',
                border: '2px solid #1cb0f6',
                color: '#fff',
                borderRadius: '10px',
                padding: '12px'
              }}
            />

          </div>

          <div className="mb-4">
            <label style={{ color: '#fff', marginBottom: '6px', display: 'block' }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              className="form-control"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              style={{
                background: '#232323',
                border: '2px solid #1cb0f6',
                color: '#fff',
                borderRadius: '10px',
                padding: '12px'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              background: '#1cb0f6',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Registrarse
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/login"
            style={{
              color: '#1cb0f6',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
