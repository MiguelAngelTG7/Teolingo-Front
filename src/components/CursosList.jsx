import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCursos } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function CursosList() {
  const { accessToken, logout, user } = useAuth(); // asumimos que 'user' viene del contexto
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      setError("Debes iniciar sesión.");
      setLoading(false);
      return;
    }

    getCursos()
      .then(res => {
        setCursos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar los cursos:', err);
        setError('No se pudieron cargar los cursos.');
        setLoading(false);
      });
  }, [accessToken]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <p className="text-gray-500">Cargando cursos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            Bienvenido{user?.username ? `, ${user.username}` : ''} 👋
          </h2>
          <p className="text-gray-600">Explora nuestros cursos disponibles:</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cursos.map(curso => (
          <div
            key={curso.id}
            className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{curso.titulo}</h3>
            <p className="text-gray-600 mb-4">{curso.descripcion}</p>
            <Link
              to={`/cursos/${curso.id}`}
              className="text-blue-600 hover:underline"
            >
              Ver lecciones →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
