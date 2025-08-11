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
          fetch(`http://localhost:8000/api/cursos/${curso.id}/progreso/`, {
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
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="duo-title mb-1">
            Bienvenido{user?.username ? `, ${user.username}` : ''} 
          </h2>
          <p className="text-secondary">Explora nuestros cursos disponibles para ti:</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger rounded-pill fw-bold"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Mostrar todos los cursos sin agrupar por categoría */}
      <div className="row g-4">
        {cursos.map(curso => (
          <div key={curso.id} className="col-12 col-md-6">
            <div
              className="card shadow-sm rounded-4 h-100 position-relative"
              style={{ background: "#181818", border: 'none', boxShadow: '0 4px 18px rgba(11,111,191,0.10)', cursor: 'pointer', overflow: 'hidden' }}
              onClick={() => navigate(`/cursos/${curso.id}`)}
              title="Ir al curso"
            >
              {/* Imagen del curso */}
              {curso.imagen_url && (
                <img
                  src={curso.imagen_url}
                  alt={curso.titulo}
                  style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block', background: '#222' }}
                />
              )}
              {/* Barra de progreso y datos debajo de la imagen, con fondo diferenciado */}
              <div style={{ background: '#232323', padding: '16px 16px 0 16px'}}>
                {progresos[curso.id] && (
                  <div className="progress mb-2" style={{ height: 7, background: '#222' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${progresos[curso.id].porcentaje || 0}%`, background: '#d4dee6ff' }}
                      aria-valuenow={progresos[curso.id].porcentaje || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: 15, fontWeight: 500, color: '#b8c7d1' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="bi bi-journal-text" style={{ fontSize: 17, color: '#4c789c' }}></i>
                    {curso.lecciones_count} Lecciones
                  </span>
                  {progresos[curso.id] && (
                    <span>
                      {progresos[curso.id].porcentaje ? `${progresos[curso.id].porcentaje.toFixed(1)}% Completado` : '0% Completado'}
                    </span>
                  )}
                </div>
              </div>
              {/* Título y categoría debajo */}
              <div className="card-body d-flex flex-column justify-content-center align-items-center text-center" style={{ background: 'transparent', minHeight: 100 }}>
                <h3 className="fw-bold mb-1" style={{ color: '#fff', fontSize: 22, textShadow: '0 2px 8px #0008' }}>{curso.titulo}</h3>
                <div className="mb-2" style={{ fontSize: '1.05rem', color: '#b0b0b0', fontWeight: 500, textShadow: '0 1px 4px #0007' }}>
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
  );
}
