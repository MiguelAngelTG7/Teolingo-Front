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
    <div className="min-vh-100" style={{ background: "rgb(128,191,255)" }}>
      <div className="container py-5" style={{ maxWidth: 900 }}>
        <h2 className="duo-title mb-4 text-center">{curso.curso_titulo} - Progreso</h2>
        <div className="duo-card mb-4 text-center">
          <h4 style={{ color: "#222e50" }}>Avance general</h4>
          <div className="progress mb-2" style={{ height: 14, borderRadius: 8 }}>
            <div
              className="progress-bar"
              style={{
                width: `${porcentajeCurso}%`,
                background: "rgb(128,191,255)",
                borderRadius: 8
              }}
            />
          </div>
          <p>{completadas} de {totalLecciones} lecciones completadas</p>
        </div>
        <div className="row">
          <div className="col-12 col-md-4 mb-4">
            <div className="duo-card text-center">
              <h5 style={{ color: "#222e50" }}>XP Total</h5>
              <p style={{ fontSize: "2rem", fontWeight: 900, color: "rgb(128,191,255)" }}>{curso.xp_total}</p>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="duo-card text-center">
              <h5 style={{ color: "#222e50" }}>Porcentaje de avance</h5>
              <p style={{ fontSize: "2rem", fontWeight: 900, color: "rgb(128,191,255)" }}>{Math.round(curso.porcentaje)}%</p>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="duo-card text-center">
              <h5 style={{ color: "#222e50" }}>Lecciones completadas</h5>
              <p style={{ fontSize: "2rem", fontWeight: 900, color: "rgb(128,191,255)" }}>{completadas}</p>
            </div>
          </div>
        </div>
        <h4 className="fw-bold mb-3" style={{ color: "#222e50" }}>Desempeño por lección</h4>
        <div className="row">
          {curso.lecciones.map(leccion => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={leccion.leccion}>
              <div className="duo-card text-center">
                <h5 style={{ color: "#222e50" }}>{leccion.leccion_titulo}</h5>
                <p>XP: <strong>{leccion.puntaje}</strong></p>
                <p>Completada: <strong>{leccion.completado ? "Sí" : "No"}</strong></p>
              </div>
            </div>
          ))}
        </div>
        {!loading && siguienteLeccion && (
          <div className="text-center my-4">
            <button
              className="duo-btn"
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