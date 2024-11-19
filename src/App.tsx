import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import EventViewer from "./EventView";
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
