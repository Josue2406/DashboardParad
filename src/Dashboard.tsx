import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Charts from './Charts';
import SummaryCards from './summaryCards';
import Sidebar from './sidebar';
import Header from './Header';

interface DashboardProps {
    token: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar fijo en el lado izquierdo */}
            <div className="w-64 h-screen fixed top-0 left-0 bg-white shadow-lg">
                <Sidebar />
            </div>

            {/* Contenedor principal al lado derecho */}
            <div className="flex-1 ml-64 flex flex-col">
                {/* Header fijo en la parte superior */}
                <div className="fixed top-0 left-64 right-0 z-10">
                    <Header />
                </div>

                {/* Contenido desplazable debajo del Header */}
                <div className="p-4 overflow-y-auto h-[calc(100vh-80px)] mt-28"> {/* Ajuste mt-24 para añadir más espacio debajo del header */}
                    <Routes>
                        <Route path="/" element={<><SummaryCards /><Charts /></>} />
                        <Route path="graficas" element={<Charts />} />
                        <Route path="clientes" element={<SummaryCards />} />
                        <Route path="productos" element={<div>Productos agregados</div>} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
