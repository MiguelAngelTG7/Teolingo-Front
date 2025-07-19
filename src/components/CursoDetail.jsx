import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurso } from '../api/api';
import { useAuth } from '../context/AuthContext'; // IMPORTANTE

export default function CursoDetail() {
  const { id } = useParams();
  const { accessToken } = useAuth(); // OBTENEMOS EL TOKEN
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      setError("Debes iniciar sesión para ver el curso.");
      return;
    }

    getCurso(id, accessToken)
      .then(res => setCurso(res.data))
      .catch(err => {
        console.error('Error al cargar el curso:', err);
        setError('No se pudo cargar el curso.');
      });
  }, [id, accessToken]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!curso) return <p>Cargando...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{curso.titulo}</h1>
      <p className="text-gray-700">{curso.descripcion}</p>

      <h2 className="mt-6 text-xl font-semibold">Lecciones</h2>

      {curso.lecciones?.length > 0 ? (
        <div className="mt-4 space-y-4">
          {curso.lecciones.map(leccion => (
            <div
              key={leccion.id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold">
                {leccion.orden}. {leccion.titulo}
              </h3>
              <Link
                to={`/lecciones/${leccion.id}`}
                className="text-blue-500 hover:underline"
              >
                Ver Lección →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-gray-500">No hay lecciones disponibles aún.</p>
      )}
    </div>
  );
}
