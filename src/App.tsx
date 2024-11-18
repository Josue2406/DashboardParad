
// src/App.tsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Sidebar from './sidebar';

import Login from './Login';
import Dashboard from './Dashboard';
import ProductosDashboard from './ProductosDashboard'; // Importa el componente de Productos
import ClientesDashboard from './ClientesDashboard'; // Importa el componente de Clientes

function App() {
    const [token, setToken] = useState<string | null>(null);

    return (
        <Router>
            <div className="flex-1 p-4">
                

                {/* Configuración de las rutas */}
                <Routes>
                 


            {/* Ruta para el Login */}
            <Route path="/" element={<Login onLoginSuccess={setToken} />} />

            {/* Nueva ruta para Productos */}
            <Route path="/productos" element={<ProductosDashboard />} />

            {/* Nueva ruta para Clientes */}
            <Route path="/clientes" element={<ClientesDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );

}

export default App;

