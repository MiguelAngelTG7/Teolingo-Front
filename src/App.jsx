// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';  // Agregamos este import
import PrivateRoute from './routes/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/auth/ResetPassword';
import VerificarEmail from './components/auth/VerificarEmail';
import SolicitarResetPassword from './components/auth/SolicitarResetPassword';
import CursosList from './components/CursosList';
import CursoDetail from './components/CursoDetail';
import CursoProgreso from './components/CursoProgreso';  // Agregamos este import
import LeccionDetail from './components/LeccionDetail';
import ExamenFinal from './components/ExamenFinal';
import ExamenFinalQuiz from './components/ExamenFinalQuiz';

function App() {
  const { accessToken } = useAuth();  // Podemos usar useAuth aquí si lo necesitamos

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verificar-email/:token" element={<VerificarEmail />} />
      <Route path="/solicitar-reset-password" element={<SolicitarResetPassword />} />

      {/* Rutas protegidas */}
      <Route path="/" element={
        <PrivateRoute>
          <CursosList />
        </PrivateRoute>
      } />
      <Route path="/cursos" element={
        <PrivateRoute>
          <CursosList />
        </PrivateRoute>
      } />
      <Route path="/cursos/:id" element={
        <PrivateRoute>
          <CursoDetail />
        </PrivateRoute>
      } />
      <Route path="/cursos/:id/progreso" element={
        <PrivateRoute>
          <CursoProgreso />
        </PrivateRoute>
      } />
      <Route path="/lecciones/:id" element={
        <PrivateRoute>
          <LeccionDetail />
        </PrivateRoute>
      } />
      <Route path="/examen-final/:id" element={
        <PrivateRoute>
          <ExamenFinal />
        </PrivateRoute>
      } />
      <Route path="/examen-final/:id/quiz" element={
        <PrivateRoute>
          <ExamenFinalQuiz />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;