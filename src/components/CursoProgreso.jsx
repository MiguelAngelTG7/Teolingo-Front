import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CursoProgreso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("Debes iniciar sesión para ver el progreso.");
      navigate('/login');
      return;
    }
    fetch(`http://localhost:8000/api/cursos/${id}/progreso/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          alert(`HTTP ${res.status}: ${text}`);
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        setCurso(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setCurso(null);
        alert("Error al cargar el progreso: " + err.message);
      });
  }, [id, navigate]);

  if (loading) return <p className="p-4">Cargando progreso...</p>;
  if (!curso || !curso.lecciones) return <p className="p-4">No hay datos de progreso.</p>;

  const totalLecciones = curso.lecciones.length;
  const completadas = curso.lecciones.filter(l => l.completado).length;
  const porcentajeCurso = totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0;
  const siguienteLeccion = curso.lecciones.find(l => !l.completado);

  return (
    <div className="min-vh-100" style={{ background: '#111' }}>
      <div className="container py-5" style={{ maxWidth: 900 }}>
        <h2 className="mb-4 text-center" style={{ color: '#fff', fontWeight: 900, fontSize: 32, letterSpacing: 0.5, textTransform: 'uppercase' }}>{curso.curso_titulo} - Progreso</h2>
        <div className="mb-4 text-center" style={{ background: '#181818', borderRadius: 16, boxShadow: '0 2px 16px #0006', padding: '28px 24px', color: '#fff' }}>
          <h4 style={{ color: '#1cb0f6', fontWeight: 800, fontSize: 22, marginBottom: 18 }}>Avance general</h4>
          <div className="progress mb-2" style={{ height: 14, borderRadius: 8, background: '#232323' }}>
            <div
              className="progress-bar"
              style={{
                width: `${porcentajeCurso}%`,
                background: 'linear-gradient(90deg, #1cb0f6 60%, #81bfff 100%)',
                borderRadius: 8
              }}
            />
          </div>
          <p style={{ color: '#e0e0e0', fontWeight: 600 }}>{completadas} de {totalLecciones} lecciones completadas</p>
        </div>
        <div className="row">
          <div className="col-12 col-md-4 mb-4">
            <div style={{ background: '#181818', borderRadius: 14, boxShadow: '0 2px 12px #0005', padding: '22px 18px', color: '#fff' }} className="text-center">
              <h5 style={{ color: '#1cb0f6', fontWeight: 700 }}>XP Total</h5>
              <p style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: 0 }}>{curso.xp_total}</p>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div style={{ background: '#181818', borderRadius: 14, boxShadow: '0 2px 12px #0005', padding: '22px 18px', color: '#fff' }} className="text-center">
              <h5 style={{ color: '#1cb0f6', fontWeight: 700 }}>Porcentaje de avance</h5>
              <p style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: 0 }}>{Math.round(curso.porcentaje)}%</p>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div style={{ background: '#181818', borderRadius: 14, boxShadow: '0 2px 12px #0005', padding: '22px 18px', color: '#fff' }} className="text-center">
              <h5 style={{ color: '#1cb0f6', fontWeight: 700 }}>Lecciones completadas</h5>
              <p style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: 0 }}>{completadas}</p>
            </div>
          </div>
        </div>
        <h4 className="fw-bold mb-3" style={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>Desempeño por lección</h4>
        <div className="row">
          {curso.lecciones.map(leccion => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={leccion.leccion}>
              <div style={{ background: '#181818', border: '2px solid #fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(128,191,255,0.18)', padding: '22px 18px', color: '#fff', fontWeight: 700, fontSize: 18, textAlign: 'left', transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s' }}>
                <h5 style={{ color: '#1cb0f6', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>{leccion.leccion_titulo}</h5>
                <p style={{ color: '#e0e0e0', fontWeight: 400, fontSize: 16, marginBottom: 4 }}>XP: <strong style={{ color: '#fff' }}>{leccion.puntaje}</strong></p>
                <p style={{ color: '#e0e0e0', fontWeight: 400, fontSize: 16 }}>Completada: <strong style={{ color: leccion.completado ? '#1cb0f6' : '#ff5252' }}>{leccion.completado ? 'Sí' : 'No'}</strong></p>
              </div>
            </div>
          ))}
        </div>
        {!loading && siguienteLeccion && (
          <div className="text-center my-4">
            <button
              className="btn fw-bold"
              style={{
                background: '#1cb0f6',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 18,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                minWidth: 200,
                padding: '12px 0',
                fontWeight: 800,
                boxShadow: '0 2px 12px #0005',
                marginTop: 8
              }}
              onClick={() => navigate(`/lecciones/${siguienteLeccion.leccion}`)}
            >
              Siguiente lección
            </button>
          </div>
        )}
      </div>
    </div>
  );
}