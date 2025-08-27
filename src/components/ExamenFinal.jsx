import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamenFinal } from "../api/axiosConfig";

export default function ExamenFinal() {
  const { id } = useParams(); // id del curso
  const navigate = useNavigate();
  const [examen, setExamen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getExamenFinal(id)
      .then((res) => {
        setExamen(res.data);
        console.log("Examen recibido:", res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar la evaluación final.");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <p className="text-secondary">Cargando evaluación final...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!examen) return null;

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{
        background: "#111",
        minHeight: "100vh",
        padding: "32px 0", 
        position: "relative",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: 700,
          background: "#111",
          borderRadius: 18,
          padding: "32px 24px",
          boxShadow: "0 2px 16px #0006",
          position: "relative",
        }}
      >
        {/* Cabecera */}
        <h1
          className="mb-4 text-center"
          style={{
            color: "#fff",
            fontWeight: 900,
            fontSize: 33,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {examen.curso_titulo}
        </h1>
        <h2
          className="mb-3 text-center"
          style={{
            color: "#1cb0f6",
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 0.5,
          }}
        >
          Evaluación Final
        </h2>
        <div
          className="mb-4 text-center"
          style={{
            color: "#e0e0e0",
            fontSize: 17,
            lineHeight: 1.7,
            whiteSpace: "pre-line",
          }}
        >
          {examen.contenido}
        </div>
        <div className="text-center">
          <button
            className="btn fw-bold"
            style={{
              background: "#1cb0f6",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 17,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              minWidth: 180,
              padding: "10px 28px",
              fontWeight: 800,
              marginTop: 12,
            }}
            onClick={() => navigate(`/examen-final/${id}/quiz`)}
          >
            Comenzar
          </button>
        </div>
      </div>
    </div>
  );
}
