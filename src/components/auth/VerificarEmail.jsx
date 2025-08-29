import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerificarEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verificando');

  useEffect(() => {
    const verificarEmail = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/verificar-email/`,
          { token },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (response.status === 200) {
          setStatus('success');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Error:', error);
        setStatus('error');
      }
    };

    if (token) {
      verificarEmail();
    }
  }, [token, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 400, width: '100%', background: '#181818', borderRadius: 18, padding: '32px 24px', boxShadow: '0 2px 16px #0006', textAlign: 'center' }}>
        {status === 'verificando' && (
          <div style={{ color: '#1cb0f6', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
            <p>Verificando tu correo electrónico...</p>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}
        {status === 'success' && (
          <div style={{ color: '#58cc02', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
            <p>¡Email verificado correctamente!</p>
            <p style={{ color: '#e0e0e0', fontSize: 16 }}>
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        )}
        {status === 'error' && (
          <div style={{ color: '#fa5252', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
            <p>Error al verificar el email</p>
            <p style={{ color: '#e0e0e0', fontSize: 16 }}>Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.</p>
            <button
              onClick={() => navigate('/login')}
              style={{ 
                width: '100%', 
                padding: '12px 0', 
                borderRadius: 10, 
                background: '#1cb0f6', 
                color: '#fff', 
                fontWeight: 900, 
                fontSize: 18, 
                border: 'none', 
                marginTop: 16,
                cursor: 'pointer'
              }}
            >
              Ir al inicio de sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificarEmail;
