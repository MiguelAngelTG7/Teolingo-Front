import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCursos } from '../api/api';
import { useAuth } from '../context/AuthContext';
import '../App.css';

export default function CursosList() {
  const { accessToken, logout, user } = useAuth();
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

  if (loading) return <p className="text-secondary">Cargando cursos...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="duo-title mb-1">
            Bienvenido{user?.username ? `, ${user.username}` : ''} 
          </h2>
          <p className="text-secondary">Explora nuestros cursos disponibles:</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger rounded-pill fw-bold"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="row g-4">
        {cursos.map(curso => (
          <div key={curso.id} className="col-12 col-md-6">
            <div
              className="card shadow-sm border-0 rounded-4 h-100"
              style={{ background: "#f8fbff" }}
            >
              <div className="card-body d-flex flex-column">
                <h3 className="fw-bold mb-2" style={{ color: "rgb(128,191,255)" }}>{curso.titulo}</h3>
                <p className="text-secondary mb-4">{curso.descripcion}</p>
                <Link
                  to={`/cursos/${curso.id}`}
                  className="btn btn-primary rounded-pill mt-auto"
                  style={{ backgroundColor: "rgb(128,191,255)", borderColor: "rgb(128,191,255)", fontWeight: 700 }}
                >
                  Ver lecciones →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
