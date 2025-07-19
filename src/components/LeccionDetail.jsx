import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLeccion } from '../api/api';

export default function LeccionDetail() {
  const { id } = useParams();
  const [leccion, setLeccion] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [mostrarResultado, setMostrarResultado] = useState(false);

  useEffect(() => {
    getLeccion(id).then(res => setLeccion(res.data));
  }, [id]);

  const handleSeleccion = (ejercicioId, opcion) => {
    setRespuestas(prev => ({
      ...prev,
      [ejercicioId]: opcion
    }));
  };

  const calcularResultado = () => {
    setMostrarResultado(true);
  };

  if (!leccion) return <p className="p-4">Cargando lección...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{leccion.titulo}</h2>
      <p className="text-gray-700 mb-4">{leccion.introduccion}</p>

      {leccion.ejercicios.map(ej => (
        <div key={ej.id} className="border p-4 mb-6 rounded shadow-sm bg-white">
          <p className="font-semibold mb-2">{ej.pregunta || ej.versiculo}</p>
          <div className="space-y-1">
            {ej.opciones.map((op, idx) => (
              <label key={idx} className="block">
                <input
                  type="radio"
                  name={`ejercicio-${ej.id}`}
                  value={op}
                  onChange={() => handleSeleccion(ej.id, op)}
                  className="mr-2"
                  checked={respuestas[ej.id] === op}
                />
                {op}
              </label>
            ))}
          </div>

          {mostrarResultado && (
            <p
              className={`mt-2 font-medium ${
                respuestas[ej.id] === ej.respuesta_correcta
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {respuestas[ej.id] === ej.respuesta_correcta
                ? '✅ ¡Correcto!'
                : `❌ Incorrecto. Respuesta correcta: ${ej.respuesta_correcta}`}
            </p>
          )}
        </div>
      ))}

      {!mostrarResultado && (
        <button
          onClick={calcularResultado}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
        >
          Ver Resultados
        </button>
      )}
    </div>
  );
}
