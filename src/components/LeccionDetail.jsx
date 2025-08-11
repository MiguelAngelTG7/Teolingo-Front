import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLeccion } from '../api/api';

export default function LeccionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leccion, setLeccion] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [actual, setActual] = useState(0);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);

  useEffect(() => {
    getLeccion(id).then(res => setLeccion(res.data));
  }, [id]);

  if (!leccion) return <p className="p-4">Cargando lección...</p>;

  const ejercicioActual = leccion.ejercicios[actual];

  // Cambia handleSeleccion para solo seleccionar la opción
  const handleSeleccion = (opcion) => {
    setOpcionSeleccionada(opcion);
  };

  // Nuevo handler para revisar/calificar
  const handleRevisar = () => {
    setRespuestas(prev => ({
      ...prev,
      [ejercicioActual.id]: opcionSeleccionada
    }));
    setMostrarFeedback(true);
  };

  const siguiente = () => {
    if (actual + 1 < leccion.ejercicios.length) {
      setActual(prev => prev + 1);
      setMostrarFeedback(false);
    } else {
      setTerminado(true);
      guardarProgreso(porcentaje); // <-- Guarda el progreso al finalizar
    }
  };

  const reiniciar = () => {
    setActual(0);
    setRespuestas({});
    setMostrarFeedback(false);
    setTerminado(false);
  };

  const correctas = leccion.ejercicios.filter(
    ej => respuestas[ej.id] === ej.respuesta_correcta
  ).length;

  const total = leccion.ejercicios.length;
  const porcentaje = Math.round((correctas / total) * 100);

  // Guardar progreso en el servidor
  const guardarProgreso = (resultado) => {
    fetch(`http://localhost:8000/api/lecciones/${id}/respuesta/`, { // <-- URL completa al backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ puntaje: resultado })
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        // éxito: puedes mostrar mensaje o redirigir
      })
      .catch(err => {
        alert("Error al guardar el progreso: " + err.message);
      });
  };

  return (
    <div className="min-vh-100" style={{ background: "#111" }}>
      <div className="container py-5" style={{ maxWidth: 540 }}>
        {/* Lección X debajo del título */}
        <div className="mb-1 text-center">
          <span style={{ color: '#b0e3faff', fontWeight: 700, fontSize: '2rem', letterSpacing: 1}}>
            Lección {leccion.numero || 1 }:  Quiz
          </span>
        </div>
        <br></br>
        {/* Barra de progreso */}
        <div className="mb-2">
          <div
            className="progress"
            style={{
              height: 10,
              background: "#d4e8fcff",
              borderRadius: 12,
              border: "2px solid #90a0b0ff",
              boxShadow: "0 2px 8px rgba(128,191,255,0.15)"
            }}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${((actual + 1) / total) * 100}%`,
                background: "rgba(172, 187, 201, 1)",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(128,191,255,0.18)",
                transition: "width 0.3s"
              }}
              aria-valuenow={actual + 1}
              aria-valuemin={1}
              aria-valuemax={total}
            />
          </div>
        </div>
        {/* Pregunta Y de Z debajo de la barra de progreso */}
        <div className="mb-4 text-center">
          <span style={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem', letterSpacing: 0.5 }}>
            Pregunta {actual + 1} de {total}
          </span>
        </div>

        {terminado ? (
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 mb-4">
              <div className="duo-card text-center bg-dark text-white border-0" style={{ borderRadius: 18 }}>
                <h4 className="fw-bold mb-2">Total XP</h4>
                <p
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    margin: "32px 0",
                    color:
                      porcentaje === 100
                        ? "#58cc02"
                        : porcentaje >= 76
                        ? "#ffd700"
                        : porcentaje >= 51
                        ? "#1cb0f6"
                        : "#fa5252"
                  }}
                >
                  {porcentaje}
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="duo-card text-center bg-dark text-white border-0" style={{ borderRadius: 18 }}>
                <h4 className="fw-bold mb-2">
                  {porcentaje === 100
                    ? "Perfecto"
                    : porcentaje >= 76
                    ? "Muy bien"
                    : porcentaje >= 51
                    ? "Regular"
                    : "Mejorar"}
                </h4>
                <p
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    margin: "32px 0",
                    color:
                      porcentaje === 100
                        ? "#58cc02"
                        : porcentaje >= 76
                        ? "#ffd700"
                        : porcentaje >= 51
                        ? "#1cb0f6"
                        : "#fa5252"
                  }}
                >
                  {porcentaje}%
                </p>
              </div>
            </div>
            <div className="col-12 text-center">
              <button
                onClick={() => {
                  if (leccion.curso_id) {
                    navigate(`/cursos/${leccion.curso_id}/progreso`);
                  } else {
                    alert("No se encontró el curso de esta lección.");
                  }
                }}
                className="duo-btn mt-2"
              >
                Continuar
              </button>
            </div>
          </div>
        ) : (
          <div className="duo-card bg-dark text-white border-0" style={{ borderRadius: 18, background: '#111', color: '#fff' }}>
            <p className="mb-4" style={{ color: "#fff", fontWeight: 600, fontSize: '1.15rem' }}>{leccion.introduccion}</p>
            <h3 className="fw-bold mb-4 text-center" style={{ color: "#fff", fontWeight: 900, fontSize: '1.4rem' }}>
              {ejercicioActual.pregunta || ejercicioActual.versiculo}
            </h3>
            <div className="d-flex flex-column gap-4 align-items-center mb-4">
              {ejercicioActual.opciones.map((op, idx) => (
                <div
                  key={idx}
                  className={`duo-alt-card w-100 ${opcionSeleccionada === op ? 'selected' : ''}`}
                  onClick={() => !mostrarFeedback && handleSeleccion(op)}
                  style={{
                    cursor: mostrarFeedback ? 'default' : 'pointer',
                    background: opcionSeleccionada === op ? "#fff" : "#222",
                    color: opcionSeleccionada === op ? "#222" : "#fff",
                    border: "2px solid #fff",
                    borderRadius: 18,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                    padding: "1.2rem 1rem",
                    minHeight: 60,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    transition: "all 0.2s"
                  }}
                >
                  {op}
                </div>
              ))}
            </div>

            {/* Botón Revisar/Calificar antes del feedback */}
            {!mostrarFeedback && opcionSeleccionada && (
              <button
                onClick={handleRevisar}
                className="btn btn-lg fw-bold mt-2"
                style={{
                  background: "#1cb0f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  minWidth: 160
                }}
              >
                Revisar
              </button>
            )}

            {/* Feedback y botón siguiente */}
            {mostrarFeedback && (
              <>
                <p
                  className={`mt-3 fw-bold text-center ${
                    respuestas[ejercicioActual.id] === ejercicioActual.respuesta_correcta
                      ? 'text-success'
                      : 'text-danger'
                  }`}
                  style={{ fontSize: '1.1rem' }}
                >
                  {respuestas[ejercicioActual.id] === ejercicioActual.respuesta_correcta
                    ? '✅ ¡Correcto!'
                    : `❌ Incorrecto. Respuesta correcta: ${ejercicioActual.respuesta_correcta}`}
                </p>
                <button
                  onClick={siguiente}
                  className="btn btn-lg fw-bold mt-4"
                  style={{
                    background: "#1cb0f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    minWidth: 160
                  }}
                >
                  {actual + 1 === total ? 'Finalizar' : 'Siguiente'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
