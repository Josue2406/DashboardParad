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
          
          {/* Configuración de las rutas */}
          <Routes>
                    {/* Ruta para el login */}
                    <Route path="/" element={<Login onLoginSuccess={setToken} />} />

                    {/* Ruta para el Dashboard, que contiene las rutas secundarias */}
                    <Route path="/dashboard/*" element={<Dashboard token={token} />} />
                </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
