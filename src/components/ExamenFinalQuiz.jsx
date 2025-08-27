import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamenFinal } from "../api/axiosConfig";
import { jsPDF } from "jspdf";
import logoImage from '../assets/teolingo-logo.png'; // Asegúrate de que la ruta sea correcta

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
        console.log('Examen completo:', res.data);
        console.log('Preguntas del examen:', res.data.preguntas);
        if (res.data.preguntas && res.data.preguntas.length > 0) {
          console.log('Primera pregunta:', res.data.preguntas[0]);
          console.log('Respuesta correcta de primera pregunta:', res.data.preguntas[0].respuesta_correcta);
        }
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
    console.log('Revisando respuesta:', {
      preguntaId: preguntaActual.id,
      opcionSeleccionada: opcionSeleccionada,
      respuestaCorrecta: preguntaActual.respuesta_correcta
    });
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

  console.log('Pregunta actual (estructura completa):', JSON.stringify(preguntaActual, null, 2));
  console.log('Respuesta correcta:', preguntaActual?.respuesta_correcta);
  console.log('Respuesta seleccionada:', respuestas[preguntaActual?.id]);

  const generarCertificado = () => {
    if (!user) {
      console.error('No se encontró información del usuario');
      return;
    }
    
    // Crear el documento PDF en modo paisaje
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Fondo gris claro
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Marco doble
    doc.setDrawColor(80, 80, 80);
    doc.setLineWidth(2);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
    doc.setDrawColor(160, 160, 160);
    doc.setLineWidth(0.8);
    doc.rect(22, 22, pageWidth - 44, pageHeight - 44);

    // Agregar el logo
    const img = new Image();
    img.src = logoImage;
    img.onload = function() {
      // Calcular dimensiones para mantener la proporción
      const maxWidth = 50;  // ancho máximo del logo en el PDF
      const aspectRatio = img.height / img.width;
      const logoWidth = maxWidth;
      const logoHeight = logoWidth * aspectRatio;

      // Posicionar el logo en la esquina superior derecha con un margen
      doc.addImage(img, 'PNG', pageWidth - 30 - logoWidth, 30, logoWidth, logoHeight);

      // Continuar con el resto del certificado
      renderCertificateContent();
    };

    // Función para renderizar el contenido del certificado
    const renderCertificateContent = () => {

      // Contenido del certificado
      const lines = [ 
        { text: "TEOLINGO.edu", font: ['helvetica', 'bold'], size: 40, spacing: -18 },
        { text: "CERTIFICA QUE:", font: ['helvetica', 'normal'], size: 18, spacing: -6 },
        { text: `${(user?.nombre_completo || "ALUMNO").toUpperCase()}`, font: ['helvetica', 'bolditalic'], size: 18, spacing: 10 },
        { text: "Ha completado satisfactoriamente el curso:", font: ['helvetica', 'normal'], size: 16, spacing: -3 },
        { text: `${(examen.curso_titulo || "CURSO").toUpperCase()}`, font: ['helvetica', 'bold'], size: 16, spacing: 10 },
        { text: `Fecha: ${new Date().toLocaleDateString()}`, font: ['helvetica', 'normal'], size: 14, spacing: 8 },
        { text: "¡Felicitaciones por tu logro!", font: ['helvetica', 'normal'], size: 14, spacing: 0 }
      ];

      // Calcular y centrar el contenido
      let totalHeight = 0;
      lines.forEach(line => {
        totalHeight += line.size + line.spacing;
      });

      let startY = (pageHeight - totalHeight) / 2 + lines[0].size / 2 - 10;
      let posY = startY;

      // Dibujar cada línea del contenido principal
      lines.forEach(line => {
        doc.setFont(line.font[0], line.font[1]);
        doc.setFontSize(line.size);
        doc.text(line.text, pageWidth / 2, posY, { align: 'center' });
        posY += line.size + line.spacing;
      });

      // Agregar "DIRECCIÓN ACADEMICA" en la esquina inferior derecha
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('DIRECCIÓN ACADEMICA', pageWidth - 30, pageHeight - 30, { align: 'right' });

      // Guardar el PDF
      doc.save("certificado.pdf");
    };
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
        {examen.curso_titulo && (
          <h1 className="mb-4 text-center" style={{ color: '#fff', fontWeight: 900, fontSize: 33, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            {examen.curso_titulo}
          </h1>
        )}
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
            {/* Mover el botón Inicio aquí, dentro del bloque terminado */}
            <div className="mt-4">
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
                Inicio
              </button>
            </div>
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
                  {console.log('Respuesta del usuario:', respuestas[preguntaActual.id])}
                  {console.log('Respuesta correcta actual:', preguntaActual.respuesta_correcta)}
                  {respuestas[preguntaActual.id] === preguntaActual.respuesta_correcta
                    ? '¡Correcto :)!'
                    : `Incorrecto :( Respuesta correcta: ${preguntaActual.respuesta_correcta || 'No disponible'}`}
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
        {/* Eliminar el botón Inicio que estaba aquí fuera */}
      </div>
    </div>
  );
}
