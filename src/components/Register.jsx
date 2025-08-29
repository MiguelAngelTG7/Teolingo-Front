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

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await register(
        formData.email,
        formData.password,
        formData.nombre_completo
      );
      console.log("✅ Registro exitoso:", response.data);

      if (response.data.email_sent) {
        setSuccess(
          '¡Registro exitoso! Por favor, revisa tu correo electrónico y haz clic en el enlace que te enviamos para verificar tu cuenta.'
        );
      } else {
        setSuccess(
          '¡Registro exitoso! Hubo un problema al enviar el correo de verificación. Por favor, contacta al soporte.'
        );
      }
      
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      console.error("❌ Error completo:", err);
      if (err.response) {
        console.log("📩 Detalle del error desde Django:", err.response.data);
        // mostramos el JSON de error en pantalla para debug
        setError(
          typeof err.response.data === "object"
            ? JSON.stringify(err.response.data, null, 2)
            : err.response.data
        );
      } else if (err.request) {
        console.log("📡 No hubo respuesta del servidor:", err.request);
        setError("No hubo respuesta del servidor. Revisa la consola.");
      } else {
        console.log("⚠️ Error al configurar la petición:", err.message);
        setError(err.message);
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
