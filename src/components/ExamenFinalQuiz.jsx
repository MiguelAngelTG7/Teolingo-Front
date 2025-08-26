import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamenFinal } from '../api/api';
import { jsPDF } from "jspdf";

export default function ExamenFinalQuiz() {
  const { id } = useParams(); // id del curso
  const navigate = useNavigate();
  const [examen, setExamen] = useState(null);
  const [actual, setActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    getExamenFinal(id)
      .then(res => {
        setExamen(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar la evaluación final.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-secondary">Cargando preguntas...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!examen || !examen.preguntas || examen.preguntas.length === 0) return <p>No hay preguntas en la evaluación final.</p>;

  const preguntaActual = examen.preguntas[actual];

  const handleSeleccion = (opcion) => {
    setOpcionSeleccionada(opcion);
  };

  const handleRevisar = () => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaActual.id]: opcionSeleccionada
    }));
    setMostrarFeedback(true);
  };

  const siguiente = () => {
    if (actual + 1 < examen.preguntas.length) {
      setActual(prev => prev + 1);
      setMostrarFeedback(false);
      setOpcionSeleccionada(null);
    } else {
      setTerminado(true);
    }
  };

  const reiniciar = () => {
    setActual(0);
    setRespuestas({});
    setMostrarFeedback(false);
    setTerminado(false);
    setOpcionSeleccionada(null);
  };

  const correctas = examen.preguntas.filter(
    p => respuestas[p.id] === p.respuesta_correcta
  ).length;
  const total = examen.preguntas.length;
  const porcentaje = Math.round((correctas / total) * 100);

  const generarCertificado = () => {
  // Obtener usuario
    const user = JSON.parse(localStorage.getItem('user'));
  // Landscape
  const doc = new jsPDF({ orientation: 'landscape' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Fondo gris claro (plizo)
  doc.setFillColor(240, 240, 240); // Gris claro
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Marco doble
  // Primer marco (externo)
  doc.setDrawColor(80, 80, 80); // Gris oscuro
  doc.setLineWidth(2);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
  // Segundo marco (interno)
  doc.setDrawColor(160, 160, 160); // Gris medio
  doc.setLineWidth(0.8);
  doc.rect(22, 22, pageWidth - 44, pageHeight - 44);

  // Definir líneas de contenido y espaciados personalizados
  // Espaciado menor entre 2-3 y 4-5
  const lines = [
    { text: "Certificado", font: ['helvetica', 'bold'], size: 40, spacing: -18 },
    { text: "OTORGADO A:", font: ['helvetica', 'normal'], size: 18, spacing: -6 }, // Sin espacio extra
    { text: `${(user?.username || "ALUMNO").toUpperCase()}`, font: ['helvetica', 'bolditalic'], size: 18, spacing: 10 }, // Espacio mayor después
    { text: "Por haber completado satisfactoriamente el curso:", font: ['helvetica', 'normal'], size: 16, spacing: -3 }, // Sin espacio extra
    { text: `${(examen.curso_titulo || "CURSO").toUpperCase()}`, font: ['helvetica', 'bold'], size: 16, spacing: 10 }, // Espacio mayor después
    { text: `Fecha: ${new Date().toLocaleDateString()}`, font: ['helvetica', 'normal'], size: 14, spacing: 8 },
    { text: "¡Felicitaciones por tu logro!", font: ['helvetica', 'normal'], size: 14, spacing: 0 }
  ];

  // Calcular altura total del bloque de texto
  let totalHeight = 0;
  lines.forEach(line => {
    totalHeight += line.size + line.spacing;
  });

  // Calcular posición inicial para que 'CERTIFICADO' esté más arriba
  let startY = (pageHeight - totalHeight) / 2 + lines[0].size / 2 - 10;

  // Dibujar cada línea centrada
  let currentY = startY;
  lines.forEach(line => {
    doc.setFont(line.font[0], line.font[1]);
    doc.setFontSize(line.size);
    doc.text(line.text, pageWidth / 2, currentY, { align: 'center' });
    currentY += line.size + line.spacing;
  });

  doc.save("certificado.pdf");
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" 
         style={{ background: '#111', minHeight: '100vh', padding: '32px 0', position: 'relative' }}>
      <div className="container" style={{ maxWidth: 700, background: '#111', borderRadius: 18, padding: '32px 24px', boxShadow: '0 2px 16px #0006', position: 'relative' }}>
        <h1 className="mb-4 text-center" style={{ color: '#fff', fontWeight: 900, fontSize: 33, letterSpacing: 0.5, textTransform: 'uppercase' }}>{examen.curso.titulo}</h1>
        <h2 className="mb-3 text-center" style={{ color: '#1cb0f6', fontWeight: 800, fontSize: 28, letterSpacing: 0.5 }}>Evaluación Final</h2>
        {terminado ? (
          <div className="text-center">
            <h3 className="fw-bold mb-4" style={{ color: porcentaje >= 80 ? '#58cc02' : '#fa5252' }}>
              {porcentaje >= 80 ? '¡Curso aprobado!' : 'No aprobado'}
            </h3>
            <p style={{ color: '#e0e0e0', fontSize: 18 }}>
              {porcentaje >= 80
                ? `¡Felicidades! Has aprobado el curso con ${porcentaje}% de respuestas correctas.`
                : `Necesitas al menos 80% de respuestas correctas para aprobar. Tu resultado: ${porcentaje}%.`}
            </p>
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
                minWidth: 180,
                padding: '10px 28px',
                fontWeight: 800,
                marginTop: 12,
              }}
              onClick={reiniciar}
            >
              Reintentar
            </button>
            {porcentaje >= 80 && (
              <div className="mt-4">
                <a
                  href="#" // Aquí irá la lógica para descargar el certificado
                  className="btn fw-bold"
                  style={{
                    background: '#58cc02',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 17,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    minWidth: 180,
                    padding: '10px 28px',
                    fontWeight: 800,
                  }}
                  onClick={generarCertificado}
                >
                  Descargar Certificado
                </a>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Barra de progreso */}
            <div className="mb-2" style={{ width: '100%' }}>
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
                    borderRadius: 8
                  }}
                  aria-valuenow={actual + 1}
                  aria-valuemin={1}
                  aria-valuemax={total}
                />
              </div>
            </div>
            <div className="mb-4 text-center">
              <span style={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem', letterSpacing: 0.5 }}>
                Pregunta {actual + 1} de {total}
              </span>
            </div>
            <h3 className="fw-bold mb-4 text-center" style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem' }}>
              {preguntaActual.pregunta}
            </h3>
            <div className="d-flex flex-column gap-4 align-items-center mb-4">
              {preguntaActual.opciones.map((op, idx) => (
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
                  style={{ fontSize: '2rem', color: respuestas[preguntaActual.id] === preguntaActual.respuesta_correcta ? '#58cc02' : '#fa5252' }}
                >
                  {respuestas[preguntaActual.id] === preguntaActual.respuesta_correcta
                    ? '¡Correcto :)!'
                    : `Incorrecto :( Respuesta correcta: ${preguntaActual.respuesta_correcta}`}
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
          </>
        )}
        {/* Agregar el botón Inicio al final del container */}
        <div className="text-center mt-4">
          <button
            className="btn fw-bold"
            style={{
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
            }}
            onClick={() => navigate('/')}
          >
            ← Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
