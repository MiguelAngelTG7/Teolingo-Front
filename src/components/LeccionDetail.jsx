import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLeccion } from "../api/axiosConfig";

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
    getLeccion(id)
      .then(res => setLeccion(res.data))
      .catch(err => {
        console.error('Error:', err);
        if (err.response && err.response.status === 401) {
          alert("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");
          navigate('/login');
        } else {
          alert("Error al cargar la lección. Por favor intenta nuevamente.");
        }
      });
  }, [id, navigate]);

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
  const xpTotal = correctas; // 1 XP por ejercicio correcto

  // Guardar progreso en el servidor
  const guardarProgreso = (resultado) => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const xpPorEjercicio = 1; // 1 XP por ejercicio correcto
    
    fetch(`${API_URL}/cursos/leccion/${id}/progreso/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ 
        puntaje: correctas, // 1 XP por ejercicio correcto
        ejercicios_completados: leccion.ejercicios.length,
        ejercicios_correctos: correctas
      })
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          if (res.status === 401 && data.code === "token_not_valid") {
            alert("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");
            navigate('/login');
            return;
          }
          throw new Error(data.detail || "Error al guardar el progreso");
        }
        return res.json();
      })
      .then(data => {
        console.log('Progreso guardado:', data);
      })
      .catch(err => {
        console.error('Error guardando progreso:', err);
        if (err.message) {
          alert(err.message);
        } else {
          alert("Error al guardar el progreso. Por favor intenta nuevamente.");
        }
      });
  };

  return (
    <div className="min-vh-100" style={{ background: '#111' }}>
      <div className="container py-5" style={{ maxWidth: 540 }}>
        {/* Lección X debajo del título, ocultar si es la última lección */}
        <div className="mb-1 text-center">
          {leccion && leccion.titulo !== 'EVALUACION FINAL' ? (
            <span style={{ color: '#1cb0f6', fontWeight: 700, fontSize: '2.3rem', letterSpacing: 1 }}>
              Lección {leccion.id || 1}: Quiz
            </span>
          ) : null}
        </div>
        <br />
        {/* Barra de progreso */}
        <div className="mb-2">
          <div
            className="progress"
            style={{
              height: 10,
              background: '#232323',
              borderRadius: 12,
              border: '2px solid #fff',
              boxShadow: '0 2px 8px #0005'
            }}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${((actual + 1) / total) * 100}%`,
                background: 'linear-gradient(90deg, #1cb0f6 60%, #81bfff 100%)',
                borderRadius: 10,
                boxShadow: '0 2px 8px #1cb0f633',
                transition: 'width 0.3s'
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
              <div className="duo-card text-center bg-dark text-white border-0" style={{ borderRadius: 18, boxShadow: 'none' }}>
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
                  {xpTotal}
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="duo-card text-center bg-dark text-white border-0" style={{ borderRadius: 18, boxShadow: 'none' }}>
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
                        ? "#d1caa3ff"
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
                  // Ir directamente a la página de progreso del curso
                  if (leccion.curso_id) {
                    navigate(`/cursos/${leccion.curso_id}/progreso`);
                  } else {
                    alert("No se pudo encontrar el curso asociado a esta lección.");
                  }
                }}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '2px solid #1cb0f6',
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  minWidth: 180,
                  padding: '8px 28px',
                  boxShadow: 'none',
                  outline: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                  marginTop: 8,
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                Terminar
              </button>
            </div>
          </div>
        ) : (
          <div className="duo-card bg-dark text-white border-0" style={{ borderRadius: 18, background: '#181818', color: '#fff', boxShadow: 'none', border: '2px solid #fff' }}>
            <p className="mb-4" style={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.15rem' }}>{leccion.introduccion}</p>
            <h3 className="fw-bold mb-4 text-center" style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem' }}>
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
                    background: opcionSeleccionada === op ? '#fff' : '#222',
                    color: opcionSeleccionada === op ? '#222' : '#fff',
                    border: '2px solid #fff',
                    borderRadius: 18,
                    boxShadow: 'none',
                    padding: '1.2rem 1rem',
                    minHeight: 60,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    transition: 'all 0.2s'
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
                  background: '#1cb0f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  minWidth: 160,
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  boxShadow: '0 2px 12px #0005'
                }}
              >
                Revisar
              </button>
            )}

            {/* Feedback y botón siguiente */}
            {mostrarFeedback && (
              <>
                <p
                  className={`mt-3 fw-bold text-center`}
                  style={{ fontSize: '1.5rem', color: respuestas[ejercicioActual.id] === ejercicioActual.respuesta_correcta ? '#d1d070ff' : '#ff7e7eff' }}
                >
                  {respuestas[ejercicioActual.id] === ejercicioActual.respuesta_correcta
                    ? ' ¡Correcto!'
                    : ` Incorrecto. Respuesta correcta: ${ejercicioActual.respuesta_correcta}`}
                </p>
                <button
                  onClick={siguiente}
                  className="btn btn-lg fw-bold mt-4"
                  style={{
                    background: '#1cb0f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    minWidth: 160,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    boxShadow: '0 2px 12px #0005'
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
