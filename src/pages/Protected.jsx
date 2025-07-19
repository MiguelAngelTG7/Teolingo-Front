function Protected({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    onLogout();
  };

  return (
    <div>
      <h2>Bienvenido a BibleLingo</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Protected;
