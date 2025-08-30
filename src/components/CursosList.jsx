import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
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

    api.get('/cursos/')
      .then(res => {
        setCursos(res.data);
        setLoading(false);
        // Cargar progreso de cada curso
        res.data.forEach(curso => {
          api.get(`/cursos/${curso.id}/progreso/`)
            .then(response => {
              if (response.data) {
                setProgresos(prev => ({ ...prev, [curso.id]: response.data }));
              }
            })
            .catch(error => {
              console.error('Error al cargar el progreso:', error);
            });
        });
      })
      .catch(err => {
        console.error('Error al cargar los cursos:', err);
        if (err.response?.status === 401) {
          setError('La sesión ha expirado. Por favor, inicia sesión nuevamente.');
          logout();
          navigate('/login');
        } else {
          setError('No se pudieron cargar los cursos. Por favor, intenta de nuevo.');
        }
        setLoading(false);
      });
  }, [accessToken]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInscripcion = async (e, cursoId) => {
    e.stopPropagation(); // Evitar que el click se propague al div del curso
    try {
      await inscribirseEnCurso(cursoId);
      // Actualizar la lista de cursos para reflejar el cambio
      const response = await getCursos();
      setCursos(response.data);
    } catch (error) {
      console.error('Error al inscribirse:', error);
      setError(error.response?.data?.message || 'Error al inscribirse en el curso');
    }
  };

  if (loading) return <p className="text-secondary">Cargando cursos...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  console.log('Estado de autenticación:', {
    accessToken,
    user,
    cursosData: cursos,
    loadingState: loading,
    errorState: error
  });

  return (
    <div className="min-vh-100" style={{ background: '#111' }}>
      <div className="container py-4" style={{ maxWidth: 900 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1" style={{ color: '#fff', fontWeight: 900, fontSize: 32, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Bienvenido{user?.nombre_completo ? `, ${user.nombre_completo}` : ''}
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
                style={{ background: '#181818', border: '2px solid #fff', boxShadow: '0 4px 18px #0008', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onClick={() => navigate(`/cursos/${curso.id}`)}
                title="Ir al curso"
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 12px 36px #1cb0f633'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 18px #0008'; e.currentTarget.style.transform = 'none'; }}
              >
                {/* Imagen del curso (por convención: curso_{curso.id}.png) */}
                <img
                  src={`/assets/curso_${curso.id}.png`}
                  alt={curso.titulo}
                  style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block', background: '#222' }}
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
                <div className="card-body d-flex flex-column justify-content-between align-items-center text-center duolingo-font" style={{ background: 'transparent', minHeight: 100, padding: '10px 10px 16px' }}>
                  <div>
                    <h3 className="fw-bold mb-1" style={{ color: '#fff', fontSize: 22, textShadow: '0 2px 8px #0008', fontWeight: 900 }}>{curso.titulo}</h3>
                    <div style={{ fontSize: '1.05rem', color: '#e0e0e0', fontWeight: 600, textShadow: '0 1px 4px #0007' }}>
                      {curso.categoria?.nombre && (
                        <span>{curso.categoria.nombre}</span>
                      )}
                    </div>
                  </div>
                  {!curso.esta_inscrito ? (
                    <button
                      onClick={(e) => handleInscripcion(e, curso.id)}
                      className="btn"
                      style={{
                        background: '#1cb0f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '6px 12px',
                        fontSize: '14px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                      }}
                    >
                      Inscribirse
                    </button>
                  ) : (
                    <span style={{ 
                      color: '#1cb0f6', 
                      fontWeight: '600',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <i className="bi bi-check-circle-fill"></i>
                      Inscrito
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
