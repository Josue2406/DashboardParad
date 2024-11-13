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
            const response = await fetch('https://localhost:7062/WeatherForecast/request-token', { // Cambiado a http
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
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={e => setUserName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    );
};

export default Login;
