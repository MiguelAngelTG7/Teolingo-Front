import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCursos } from '../api/api';
import { useAuth } from '../context/AuthContext';
import '../App.css';

export default function CursosList() {
  const { accessToken, logout, user } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [progresos, setProgresos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      setError("Debes iniciar sesión.");
      setLoading(false);
      return;
    }

    getCursos()
      .then(res => {
        setCursos(res.data);
        setLoading(false);
        // Cargar progreso de cada curso
        res.data.forEach(curso => {
          const API_URL = import.meta.env.VITE_API_BASE_URL;
          fetch(`${API_URL}/cursos/${curso.id}/progreso/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
              if (data) {
                setProgresos(prev => ({ ...prev, [curso.id]: data }));
              }
            });
        });
      })
      .catch(err => {
        console.error('Error al cargar los cursos:', err);
        setError('No se pudieron cargar los cursos.');
        setLoading(false);
      });
  }, [accessToken]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <p className="text-secondary">Cargando cursos...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="min-vh-100" style={{ background: '#111' }}>
      <div className="container py-4" style={{ maxWidth: 900 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1" style={{ color: '#fff', fontWeight: 900, fontSize: 32, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Bienvenido{user?.username ? `, ${user.username}` : ''}
            </h2>
            <p style={{ color: '#e0e0e0', fontWeight: 500 }}>Explora nuestros cursos disponibles para ti:</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-duo"
            style={{ background: 'transparent', color: '#ff5252', border: '2px solid #ff5252', fontWeight: 700, fontSize: 15 }}
          >
            Cerrar sesión
          </button>
        </div>

        {/* Mostrar todos los cursos sin agrupar por categoría */}
        <div className="row g-4">
          {cursos.map(curso => (
            <div key={curso.id} className="col-12 col-md-6">
              <div
                className="shadow-sm rounded-4 h-100 position-relative"
                style={{ background: '#181818', border: '2px solid #fff', boxShadow: '0 4px 18px #0008', cursor: 'pointer', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onClick={() => navigate(`/cursos/${curso.id}`)}
                title="Ir al curso"
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 12px 36px #1cb0f633'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 18px #0008'; e.currentTarget.style.transform = 'none'; }}
              >
                {/* Imagen del curso (por convención: curso_{curso.id}.png) */}
                <img
                  src={`/assets/curso_${curso.id}.png`}
                  alt={curso.titulo}
                  style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block', background: '#222' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
                {/* Barra de progreso y datos debajo de la imagen, con fondo diferenciado */}
                <div style={{ background: '#232323', padding: '16px 16px 0 16px', borderBottom: '2px solid #fff' }}>
                  {progresos[curso.id] && (
                    <div className="progress mb-2" style={{ height: 8, background: '#222', borderRadius: 8 }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${progresos[curso.id].porcentaje || 0}%`, background: 'linear-gradient(90deg, #1cb0f6 60%, #81bfff 100%)', borderRadius: 8 }}
                        aria-valuenow={progresos[curso.id].porcentaje || 0}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: 15, fontWeight: 600, color: '#e0e0e0' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="bi bi-journal-text" style={{ fontSize: 17, color: '#1cb0f6' }}></i>
                      {curso.lecciones_count} Lecciones
                    </span>
                    {progresos[curso.id] && (
                      <span style={{ color: '#1cb0f6', fontWeight: 700 }}>
                        {progresos[curso.id].porcentaje ? `${Math.round(progresos[curso.id].porcentaje)}% Completado` : '0% Completado'}
                      </span>
                    )}
                  </div>
                </div>
                {/* Título y categoría debajo */}
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-center duolingo-font" style={{ background: 'transparent', minHeight: 100 }}>
                  <h3 className="fw-bold mb-1" style={{ color: '#fff', fontSize: 22, textShadow: '0 2px 8px #0008', fontWeight: 900 }}>{curso.titulo}</h3>
                  <div className="mb-2" style={{ fontSize: '1.05rem', color: '#e0e0e0', fontWeight: 600, textShadow: '0 1px 4px #0007' }}>
                    {curso.categoria?.nombre && (
                      <span>{curso.categoria.nombre}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
