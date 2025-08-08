// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import CursosList from './components/CursosList';
import CursoDetail from './components/CursoDetail'; 
import LeccionDetail from './components/LeccionDetail';
import CursoProgreso from './components/CursoProgreso';

function App() {
  const { accessToken } = useAuth();

  return (
    <Routes>
      {/* Redirección inteligente desde "/" */}
      <Route
        path="/"
        element={<Navigate to={accessToken ? "/cursos" : "/login"} replace />}
      />

      {/* Ruta de login */}
      <Route
        path="/login"
        element={accessToken ? <Navigate to="/cursos" /> : <Login />}
      />

      {/* Lista de cursos protegida */}
      <Route
        path="/cursos"
        element={accessToken ? <CursosList /> : <Navigate to="/login" />}
      />

      {/* Detalle de curso con parámetro :id */}
      <Route
        path="/cursos/:id"
        element={accessToken ? <CursoDetail /> : <Navigate to="/login" />}
      />
      
      <Route
        path="/lecciones/:id"
        element={accessToken ? <LeccionDetail /> : <Navigate to="/login" />}
      />

      <Route
        path="/cursos/:id/progreso"
        element={accessToken ? <CursoProgreso /> : <Navigate to="/login" />}
      />

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;