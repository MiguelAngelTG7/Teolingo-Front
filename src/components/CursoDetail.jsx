import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCursoDetail } from '../api/api';
import '../App.css';

export default function CursoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leccionSeleccionada, setLeccionSeleccionada] = useState(null);
  const [progreso, setProgreso] = useState(null);

  useEffect(() => {
    getCursoDetail(id)
      .then(res => {
        setCurso(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('No se pudo cargar el curso.');
        setLoading(false);
      });

    fetch(`http://localhost:8000/api/cursos/${id}/progreso/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then(res => res.json())
      .then(data => setProgreso(data));
  }, [id]);

  if (loading) return <p className="text-secondary">Cargando curso...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!curso) return null;

  // Si hay una lección seleccionada, muestra el detalle
  if (leccionSeleccionada) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ background: '#111', minHeight: '100vh', padding: '32px 0' }}>
        <div className="container" style={{ maxWidth: 700, background: '#111', borderRadius: 18, padding: '32px 24px', boxShadow: '0 2px 16px #0006' }}>
      <button
        className="btn fw-bold"
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 100,
          background: '#232323',
          color: '#fff',
          border: '2px solid #1cb0f6',
          borderRadius: 10,
          fontSize: 16,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          minWidth: 120,
          padding: '8px 18px',
          fontWeight: 800,
          boxShadow: '0 2px 12px #0005',
        }}
        onClick={() => setLeccionSeleccionada(null)}
      >
        ← LECCIONES
      </button>
          {/* Indicador de número de lección */}
          {curso.lecciones && (
            <div className="text-center" style={{ color: '#1cb0f6', fontWeight: 700, fontSize: 18, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {(() => {
                const sortedLecciones = [...curso.lecciones].sort((a, b) => a.id - b.id);
                const idx = sortedLecciones.findIndex(l => l.id === leccionSeleccionada.id);
                return idx !== -1 ? `Lección ${idx + 1}` : '';
              })()}
            </div>
          )}
          <h2 className="mb-4 text-center" style={{ color: '#fff', fontWeight: 900, fontSize: 33, letterSpacing: 0.5, textTransform: 'uppercase' }}>{leccionSeleccionada.titulo}</h2>
          {/* Video de presentación */}
          <div className="mb-4 text-center">
            <iframe
              width="100%"
              height="360"
              src={leccionSeleccionada.video_url.replace('watch?v=', 'embed/')}
              title="Video de la lección"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: 12, background: '#000', border: 'none' }}
            />
          </div>
          {/* Descripción de la lección */}
          <div className="mb-4 text-center">
            <div
              style={{ color: '#e0e0e0', fontSize: 17, lineHeight: 1.7, whiteSpace: 'pre-line', textAlign: 'center' }}
              dangerouslySetInnerHTML={{ __html: leccionSeleccionada.contenido }}
            />
          </div>
          {/* Botón para descargar PDF */}
          <div className="mb-4 text-center">
            <button
              className="btn fw-bold"
              style={{
                background: '#111',
                color: '#fff',
                border: '2px solid #fff',
                borderRadius: 10,
                fontSize: 17,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                minWidth: 220,
                marginBottom: 12
              }}
              onClick={() => {
                const link = document.createElement('a');
                link.href = `/assets/leccion_${leccionSeleccionada.id}.pdf`;
                link.download = `leccion_${leccionSeleccionada.id}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Guía de Estudio (PDF)
            </button>
          </div>
          {/* Botón para abrir el quiz */}
          <div className="text-center">
            <button
              className="btn fw-bold"
              style={{
                background: '#1cb0f6',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 17,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                minWidth: 180
              }}
              onClick={() => navigate(`/lecciones/${leccionSeleccionada.id}`)}
            >
              Ir al Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Listado de lecciones
  return (
    <div className="min-vh-100" style={{ background: '#111', position: 'relative' }}>
      {/* Botón para regresar al dashboard */}
      <button
        className="btn fw-bold"
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 100,
          background: '#232323',
          color: '#fff',
          border: '2px solid #1cb0f6',
          borderRadius: 10,
          fontSize: 16,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          minWidth: 120,
          padding: '8px 18px',
          fontWeight: 800,
          boxShadow: '0 2px 12px #0005',
        }}
        onClick={() => window.location.href = '/dashboard'}
      >
        ← Dashboard
      </button>
      {/* Cabecera con imagen de fondo y overlay */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: 340,
        background: '#222',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Imagen de cabecera del curso (por convención: curso_{curso.id}.png) */}
        <img
          src={`/assets/curso_${curso.id}.png`}
          alt={curso.titulo}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            filter: 'brightness(0.55)'
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 600,
          padding: '32px 24px 32px 24px',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <span style={{
              background: '#232323',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              borderRadius: 16,
              padding: '4px 18px',
              letterSpacing: 0.5,
              boxShadow: '0 2px 8px #0005',
              textTransform: 'capitalize',
            }}>
              {curso.categoria?.nombre ? curso.categoria.nombre : 'Sin categoría'}
            </span>
          </div>
          {/* Título */}
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 50, marginBottom: 12, textShadow: '0 2px 12px #000a' }}>{curso.titulo}</h1>
          {/* Datos de lecciones y duración */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 18 }}>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 16, letterSpacing: 1 }}>
              {curso.lecciones?.length || 0} LECCIONES
            </span>
            {/* Duración total placeholder, puedes reemplazar por duración real si la tienes */}
          </div>
        </div>
      </div>
      {/* Descripción destacada y texto largo */}
      <div className="container" style={{ maxWidth: 700, marginTop: 32 }}>
        {/* Descripción destacada (primer párrafo en negrita) */}
        {curso.descripcion && (
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 20, lineHeight: 1.4 }}>
            {curso.descripcion.split('\n')[0]}
          </div>
        )}
        {/* Texto largo (resto de la descripción, con saltos de línea como párrafos) */}
        {curso.descripcion && curso.descripcion.split('\n').slice(1).join('\n') && (
          <div style={{ color: '#e0e0e0', fontSize: 17, marginBottom: 32, lineHeight: 1.7 }}>
            {curso.descripcion.split('\n').slice(1).map((p, i) =>
              p.trim() ? <p key={i} style={{ marginBottom: 16 }}>{p}</p> : null
            )}
          </div>
        )}
        {/* Listado de lecciones */}
        <div className="row justify-content-center">
          {curso.lecciones && [...curso.lecciones]
            .sort((a, b) => a.id - b.id)
            .map((leccion, idx) => {
              // Buscar progreso de la lección
              let completada = false;
              if (progreso && progreso.lecciones) {
                const prog = progreso.lecciones.find(l => l.leccion === leccion.id);
                completada = prog ? !!prog.completado : false;
              }
              return (
                <div key={leccion.id} className="col-12 mb-3">
                  <div
                    className="lesson-card text-white"
                    style={{
                      background: '#181818',
                      border: '2px solid #fff',
                      borderRadius: 12,
                      padding: '22px 24px',
                      marginBottom: 8,
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 20,
                      boxShadow: '0 8px 32px rgba(128,191,255,0.18)',
                      transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
                      textAlign: 'left',
                      position: 'relative',
                      letterSpacing: 0.2,
                      outline: 'none',
                      userSelect: 'none',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    tabIndex={0}
                    onClick={() => setLeccionSeleccionada(leccion)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setLeccionSeleccionada(leccion); }}
                    onMouseOver={e => {
                      e.currentTarget.style.boxShadow = '0 12px 36px rgba(128,191,255,0.25)';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.borderColor = '#1cb0f6';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(128,191,255,0.18)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderColor = '#fff';
                    }}
                  >
                    {/* Círculo de progreso */}
                    <span style={{
                      display: 'inline-block',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: '2.5px solid #1cb0f6',
                      background: completada ? '#1cb0f6' : 'transparent',
                      marginRight: 18,
                      transition: 'background 0.2s',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1cb0f6', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Lección {idx + 1}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 4, textTransform: 'none', letterSpacing: 0.2 }}>
                        {leccion.titulo}
                      </div>
                      {leccion.descripcion && (
                        <div style={{ color: '#e0e0e0', fontWeight: 400, fontSize: 16, marginTop: 2, opacity: 0.85 }}>
                          {leccion.descripcion}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
