import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        nombre_completo: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Validate passwords match
        if (formData.password !== formData.confirm_password) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        try {
            const result = await register(
                formData.email,
                formData.password,
                formData.nombre_completo
            );
            
            setSuccess('¡Registro exitoso!');
            
            // Redirect to login immediately
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: '¡Registro exitoso! Por favor inicia sesión' 
                    }
                });
            }, 3000);
            
        } catch (error) {
            setError(error.response?.data?.error || 'Error al registrar usuario');
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex flex-column align-items-center justify-content-center"
            style={{ background: '#111' }}
        >
            <div className="container" style={{ maxWidth: 400 }}>
                <h1
                    className="text-center mb-4"
                    style={{
                        color: '#fff',
                        fontWeight: 900,
                        fontSize: '33px',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                    }}
                >
                    Crear Cuenta
                </h1>

                {error && (
                    <pre
                        className="alert"
                        style={{
                            background: '#ff5b5b20',
                            color: '#ff5b5b',
                            border: '1px solid #ff5b5b',
                            borderRadius: '10px',
                            padding: '10px 15px',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {error}
                    </pre>
                )}

                {success && (
                    <div
                        className="alert"
                        style={{
                            background: '#1cb0f620',
                            color: '#1cb0f6',
                            border: '1px solid #1cb0f6',
                            borderRadius: '10px',
                            padding: '10px 15px'
                        }}
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label style={{ color: '#fff', marginBottom: '6px', display: 'block' }}>
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            style={{
                                background: '#232323',
                                border: '2px solid #1cb0f6',
                                color: '#fff',
                                borderRadius: '10px',
                                padding: '12px'
                            }}
                        />
                    </div>

                    <div className="mb-3">
                        <label style={{ color: '#fff', marginBottom: '6px', display: 'block' }}>
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.nombre_completo}
                            onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                            required
                            style={{
                                background: '#232323',
                                border: '2px solid #1cb0f6',
                                color: '#fff',
                                borderRadius: '10px',
                                padding: '12px'
                            }}
                        />
                    </div>

                    <div className="mb-3">
                        <label style={{ color: '#fff', marginBottom: '6px', display: 'block' }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            style={{
                                background: '#232323',
                                border: '2px solid #1cb0f6',
                                color: '#fff',
                                borderRadius: '10px',
                                padding: '12px'
                            }}
                        />

                    </div>

                    <div className="mb-4">
                        <label style={{ color: '#fff', marginBottom: '6px', display: 'block' }}>
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            value={formData.confirm_password}
                            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                            required
                            style={{
                                background: '#232323',
                                border: '2px solid #1cb0f6',
                                color: '#fff',
                                borderRadius: '10px',
                                padding: '12px'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100"
                        style={{
                            background: '#1cb0f6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '12px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link
                        to="/login"
                        style={{
                            color: '#1cb0f6',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        ¿Ya tienes una cuenta? Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
