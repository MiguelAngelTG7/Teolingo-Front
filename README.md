# Teolingo

## Requisitos
- Python 3.10+
- PostgreSQL
- Node.js (para el frontend)

## Instalación

### Backend

1. Crear y activar entorno virtual:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
Crear archivo `.env` en la carpeta backend con:
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/teolingo_dev
```

4. Aplicar migraciones:
```bash
python manage.py migrate
```

5. Crear superusuario:
```bash
python manage.py createsuperuser
```

6. Iniciar servidor:
```bash
python manage.py runserver
```

### Frontend

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Configurar variables de entorno:
Crear archivo `.env` en la carpeta frontend con:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

## Desarrollo

- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- Admin: http://localhost:8000/admin