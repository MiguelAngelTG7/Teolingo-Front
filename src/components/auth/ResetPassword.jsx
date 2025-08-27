import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await api.post('/usuarios/reset-password/', {
        token,
        password
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al restablecer la contraseña');
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 400, width: '100%', background: '#181818', borderRadius: 18, padding: '32px 24px', boxShadow: '0 2px 16px #0006', textAlign: 'center' }}>
          <div style={{ color: '#58cc02', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
            <p>¡Contraseña actualizada con éxito!</p>
            <p style={{ color: '#e0e0e0', fontSize: 16 }}>Serás redirigido al inicio de sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 400, width: '100%', background: '#181818', borderRadius: 18, padding: '32px 24px', boxShadow: '0 2px 16px #0006' }}>
        <h2 style={{ textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: 28, marginBottom: 24, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          Restablecer Contraseña
        </h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: '#fa5252', color: '#fff', padding: '10px 16px', borderRadius: 10, marginBottom: 18, fontWeight: 700, textAlign: 'center' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="password" style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 16, marginBottom: 6, display: 'block' }}>
              Nueva Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '2px solid #1cb0f6', background: '#222', color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 8 }}
              placeholder="••••••••"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="confirmPassword" style={{ color: '#e0e0e0', fontWeight: 700, fontSize: 16, marginBottom: 6, display: 'block' }}>
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '2px solid #1cb0f6', background: '#222', color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 8 }}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '12px 0', borderRadius: 10, background: '#1cb0f6', color: '#fff', fontWeight: 900, fontSize: 18, letterSpacing: 0.5, textTransform: 'uppercase', border: 'none', marginTop: 8, boxShadow: '0 2px 12px #0005' }}
          >
            Restablecer Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
