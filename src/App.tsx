import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './sidebar';
import Login from './Login';
import Dashboard from './Dashboard';
import DynamicChart from './DynamicChart';

function App() {
  // Estado para almacenar el token de inicio de sesión
  const [token, setToken] = useState<string | null>(null);

  return (
    <Router>
      <div className="App flex">
        
        <div className="flex-1 p-4">
          <Header />

          {/* Configuración de las rutas */}
          <Routes>
            {/* Ruta para el Dashboard que incluye todos los componentes */}
            <Route path="/Dashboard" element={<Dashboard token={token} />} />

            {/* Ruta para el Login */}
            <Route path="/" element={<Login onLoginSuccess={setToken} />} />

            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
