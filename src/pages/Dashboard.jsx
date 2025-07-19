import { useAuth } from '../context/AuthContext';
import CursosList from '../components/CursosList';

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Biblielingo</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Mis Cursos</h2>
      <CursosList />
    </div>
  );
}
