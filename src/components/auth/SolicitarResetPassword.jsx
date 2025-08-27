import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const SolicitarResetPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      await api.post('/usuarios/solicitar-reset-password/', { email });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setError(error.response?.data?.error || 'Error al procesar la solicitud');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 400, width: '100%', background: '#181818', borderRadius: 18, padding: '32px 24px', boxShadow: '0 2px 16px #0006' }}>
        <h2 style={{ textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: 28, marginBottom: 24, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          Recuperar contraseña
        </h2>
        {status === 'success' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#58cc02', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
              ¡Correo enviado! Por favor, revisa tu bandeja de entrada.
            </div>
            <p style={{ color: '#e0e0e0', fontSize: 15, marginBottom: 12 }}>
              Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '12px 0', borderRadius: 10, background: '#1cb0f6', color: '#fff', fontWeight: 900, fontSize: 18, letterSpacing: 0.5, textTransform: 'uppercase', border: 'none', marginTop: 8, boxShadow: '0 2px 12px #0005' }}
            >
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fa5252', color: '#fff', padding: '10px 16px', borderRadius: 10, marginBottom: 18, fontWeight: 700, textAlign: 'center' }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="email" style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 16, marginBottom: 6, display: 'block' }}>
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 10, border: '2px solid #1cb0f6', background: '#222', color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 8 }}
                placeholder="ejemplo@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{ width: '100%', padding: '12px 0', borderRadius: 10, background: '#1cb0f6', color: '#fff', fontWeight: 900, fontSize: 18, letterSpacing: 0.5, textTransform: 'uppercase', border: 'none', marginTop: 8, boxShadow: '0 2px 12px #0005', opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
            >
              {status === 'loading' ? 'Enviando...' : 'Enviar instrucciones'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 18 }}>
              <Link to="/login" style={{ color: '#1cb0f6', fontWeight: 700, fontSize: 15, textDecoration: 'underline', textTransform: 'uppercase' }}>
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SolicitarResetPassword;
