import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const VerificarEmail = () => {
  const [status, setStatus] = useState('verificando');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verificarEmail = async () => {
      if (!token) {
        setStatus('error');
        setError('Token no proporcionado');
        return;
      }

      try {
        await api.post('/usuarios/verificar-email/', { token });  // Cambiado a POST
        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setError(error.response?.data?.message || 'Error al verificar el email');
        console.error('Error al verificar email:', error);
      }
    };

    verificarEmail();
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
            <p style={{ color: '#e0e0e0', fontSize: 16 }}>{error}</p>
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
