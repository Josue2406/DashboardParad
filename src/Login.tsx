import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

interface LoginProps {
    onLoginSuccess: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para redirigir después del login

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
    
        try {
            const response = await fetch('http://localhost:7062/WeatherForecast/request-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });
    
            if (!response.ok) {
                setErrorMessage(`Error de autenticación: ${response.statusText}`);
                return;
            }
    
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("text/plain")) {
                const token = await response.text();
                if (token) {
                    onLoginSuccess(token);
                    setIsAuthenticated(true);
                } else {
                    setErrorMessage("El token de acceso no está presente en la respuesta.");
                }
            } else {
                setErrorMessage("La respuesta del servidor no es JSON ni texto válido.");
            }
        } catch (error) {
            console.error('Error en el proceso de login:', error);
            setErrorMessage("Error en el proceso de login: No se pudo conectar con el servidor.");
        }
    };
    

    // Si el usuario está autenticado, redirige al Dashboard
    if (isAuthenticated) {
        return <Navigate to="/Dashboard" replace />;
    }

    return (
        <form onSubmit={handleLogin} style={formStyles}>
            <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                style={inputStyles}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyles}
            />
            <button type="submit" style={buttonStyles}>Login</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    );
};

// Estilos básicos para mejorar la apariencia del formulario
const formStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    maxWidth: '300px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
};

const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
};

const buttonStyles: React.CSSProperties = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
};

export default Login;
