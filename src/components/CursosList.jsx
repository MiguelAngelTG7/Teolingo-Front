import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import '../App.css';

// Agregar estilos para las animaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: translate(-50%, -40%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;
document.head.appendChild(style);

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
      // Hacer la petición de inscripción al endpoint correcto
      const inscripcionResponse = await api.post(`/cursos/${cursoId}/`);
      
      // Mostrar mensaje de éxito si está disponible
      if (inscripcionResponse.data?.message) {
        setError(null);
        // Podríamos mostrar un mensaje de éxito aquí si lo deseas
      }
      
      // Actualizar la lista de cursos para reflejar el cambio
      const response = await api.get('/cursos/');
      setCursos(response.data);
      
      // Limpiar cualquier mensaje de error previo
      setError(null);
    } catch (error) {
      console.error('Error al inscribirse:', error);
      if (error.response?.status === 404) {
        setError('¡Ups! Parece que hubo un pequeño problema al encontrar el curso. Por favor, actualiza la página e intenta de nuevo.');
      } else if (error.response?.status === 400 && error.response?.data?.message?.includes('Ya estás inscrito')) {
        setError('¡Ya formas parte de este curso! Puedes acceder al contenido directamente.');
      } else {
        setError(error.response?.data?.message || '¡Ups! Algo no salió como esperábamos. ¿Podrías intentarlo de nuevo?');
      }
      
      // Limpiar el mensaje de error después de 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  if (loading) return <p className="text-secondary">Cargando cursos...</p>;

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
        {error && (
          typeof error === 'string' ? (
            // Mensaje de texto normal
            <div 
              className="alert fade show mb-4" 
              role="alert" 
              style={{ 
                background: error.includes('exitosamente') ? 'rgba(23, 201, 100, 0.95)' : 'rgba(28, 176, 246, 0.95)',
                backdropFilter: 'blur(8px)',
                border: error.includes('exitosamente') ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                color: '#fff',
                padding: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                animation: 'fadeInDown 0.3s ease-out'
              }}
            >
              <div className="d-flex align-items-center gap-4">
                <div className="d-flex align-items-center justify-content-center" 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px',
                    width: '48px',
                    height: '48px'
                  }}>
                  <i className={`bi ${error.includes('exitosamente') ? 'bi-check-circle-fill' : 'bi-info-circle-fill'}`} 
                     style={{ color: '#fff', fontSize: '1.8rem' }}></i>
                </div>
                <div className="flex-grow-1">
                  <div style={{ 
                    fontWeight: '700', 
                    fontSize: '1.1rem', 
                    marginBottom: '4px',
                    letterSpacing: '0.3px'
                  }}>
                    {error.includes('exitosamente') ? '¡Felicitaciones!' : '¡Atención!'}
                  </div>
                  <div style={{ 
                    fontWeight: '500',
                    opacity: 0.9,
                    lineHeight: '1.4'
                  }}>
                    {error}
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-close align-self-start ms-2" 
                  onClick={() => setError(null)} 
                  style={{ 
                    filter: 'invert(1)',
                    opacity: 0.7,
                    transition: 'all 0.2s ease',
                    transform: 'scale(0.9)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.transform = 'scale(0.9)';
                  }}
                />
              </div>
            </div>
          ) : (
            // Contenido JSX personalizado (para el modal de inscripción)
            error
          )
        )}
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
                onClick={(e) => {
                  if (!curso.esta_inscrito) {
                    e.preventDefault();
                    const message = (
                      <div 
                        className="position-fixed top-50 start-50 translate-middle"
                        style={{
                          zIndex: 1050,
                          width: '320px',
                          background: 'rgba(28, 176, 246, 0.95)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '20px',
                          padding: '24px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                          border: '2px solid rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          textAlign: 'center',
                          animation: 'fadeInScale 0.3s ease-out'
                        }}
                      >
                        <div className="mb-3">
                          <i className="bi bi-lock-fill" style={{ fontSize: '2.5rem', color: '#fff' }}></i>
                        </div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>
                          ¡Contenido Bloqueado!
                        </h4>
                        <p style={{ fontSize: '1rem', marginBottom: '16px', lineHeight: '1.4' }}>
                          Para explorar este curso, necesitas inscribirte primero.
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInscripcion(e, curso.id);
                          }}
                          className="btn"
                          style={{
                            background: '#fff',
                            color: '#1cb0f6',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '10px 24px',
                            fontSize: '15px',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          Inscribirme Ahora
                        </button>
                      </div>
                    );
                    setError(message);
                    // Limpiar el mensaje después de 5 segundos
                    setTimeout(() => setError(null), 5000);
                    return;
                  }
                  navigate(`/cursos/${curso.id}`);
                }}
                title={curso.esta_inscrito ? "Ir al curso" : "Inscríbete para acceder"}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 12px 36px #1cb0f633'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 18px #0008'; e.currentTarget.style.transform = 'none'; }}
              >
                {/* Imagen del curso (por convención: curso_{curso.id}.png) */}
                <div className="position-relative">
                  <img
                    src={`/assets/curso_${curso.id}.png`}
                    alt={curso.titulo}
                    style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block', background: '#222' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div className="position-absolute" style={{ 
                    top: 16, 
                    right: 16, 
                    background: 'rgba(24, 24, 24, 0.8)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '10px',
                    padding: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}>
                    {!curso.esta_inscrito ? (
                      <button
                        onClick={(e) => handleInscripcion(e, curso.id)}
                        className="btn"
                        style={{
                          background: '#1cb0f6',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
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
                        color: '#fff', 
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
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-center duolingo-font" style={{ background: 'transparent', minHeight: 80, padding: '16px 10px' }}>
                  <h3 className="fw-bold mb-1" style={{ color: '#fff', fontSize: 22, textShadow: '0 2px 8px #0008', fontWeight: 900 }}>{curso.titulo}</h3>
                  <div style={{ fontSize: '0.9rem', color: '#e0e0e0', fontWeight: 500, textShadow: '0 1px 4px #0007', opacity: 0.9 }}>
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
