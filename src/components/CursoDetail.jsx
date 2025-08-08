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
  }, [id]);

  if (loading) return <p className="text-secondary">Cargando curso...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!curso) return null;

  // Si hay una lección seleccionada, muestra el detalle
  if (leccionSeleccionada) {
    return (
      <div className="container py-5" style={{ maxWidth: 700 }}>
        <button className="btn btn-link mb-3" onClick={() => setLeccionSeleccionada(null)}>
          ← Volver al listado de lecciones
        </button>
        <h2 className="mb-4 text-center">{leccionSeleccionada.titulo}</h2>
        {/* Video de presentación */}
        <div className="mb-4 text-center">
          <iframe
            width="100%"
            height="360"
            src={leccionSeleccionada.video_url.replace('watch?v=', 'embed/')}
            title="Video de la lección"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: 12, background: "#000", border: "none" }}
          />
        </div>
        {/* Botón para descargar PDF */}
        <div className="mb-4 text-center">
          <a
            href={leccionSeleccionada.guia_pdf_url}
            className="btn btn-outline-primary"
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Descargar Guía de Estudio (PDF)
          </a>
        </div>
        {/* Botón para abrir el quiz */}
        <div className="text-center">
          <button
            className="btn btn-success"
            onClick={() => navigate(`/lecciones/${leccionSeleccionada.id}`)}
          >
            Ir al Quiz
          </button>
        </div>
      </div>
    );
  }

  // Listado de lecciones
  return (
    <div className="min-vh-100" style={{ background: "rgb(128,191,255)" }}>
      <div className="container py-5" style={{ maxWidth: 600 }}>
        <div className="duo-card text-center mx-auto mb-5">
          <h1 className="duo-title mb-2">{curso.titulo}</h1>
          <p className="text-secondary mb-2">{curso.descripcion}</p>
          <p className="fw-bold mb-0" style={{ color: "rgb(128,191,255)" }}>
            Lecciones disponibles: {curso.lecciones?.length || 0}
          </p>
        </div>
        <div className="row justify-content-center">
          {curso.lecciones?.map(leccion => (
            <div key={leccion.id} className="col-12">
              <div
                className="duo-card mb-4 text-center"
                style={{
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onClick={() => setLeccionSeleccionada(leccion)}
                onMouseOver={e => {
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(128,191,255,0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(128,191,255,0.18)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <h2 className="fw-bold mb-3" style={{ color: "rgb(128,191,255)", fontFamily: 'Nunito, Segoe UI, Arial, sans-serif' }}>
                  {leccion.titulo}
                </h2>
                <p className="text-secondary mb-0">{leccion.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
