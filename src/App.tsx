import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import DashboardTR from "./Charts/DashboardTR";
import EventViewer from "./events/EventView";
import Dashboard from "./principal/Dashboard";
 // Importa EventViewer

function App() {
  const [token, setToken] = useState<string | null>(null);

  return (
    <Router>
      <div className="flex-1 p-4">
        {/* Configuración de las rutas */}
        <Routes>
          {/* Ruta para el Login */}
          <Route path="/" element={<Login onLoginSuccess={setToken} />} />

          {/* Ruta para el Dashboard, que contiene las rutas secundarias */}
          <Route path="/dashboard/*" element={<Dashboard token={token} />} />

          {/* Ruta para EventViewer */}
          <Route path="/event-viewer" element={<EventViewer />} />

          <Route path="/dashboard-tr" element={<DashboardTR />} />



        </Routes>
      </div>
    </Router>
  );
}

export default App;

