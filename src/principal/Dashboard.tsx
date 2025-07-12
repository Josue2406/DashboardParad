import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Charts from '../Charts/Charts';
// import DynamicChart from './DynamicChart';
// import SummaryCards from './summaryCards';
import DashboardTR from "../Charts/DashboardTR";
import ProductCharts from '../Charts/ProductCharts';
import TopCustomersChart from '../Charts/TopCustomersChart';
import EventViewer from '../events/EventView';
import SummaryCards from '../events/summaryCards';
import Header from './Header';
import Sidebar from './sidebar';


interface DashboardProps {
    token: string | null;
}

const Dashboard: React.FC<DashboardProps> = () => {
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
                <div className="p-4 overflow-y-auto h-[calc(100vh-80px)] mt-28">
                    <Routes>
                        <Route path="/" element={<><SummaryCards/><Charts /></>} />
                        
                        {/* Ruta para mostrar solo las gráficas */}
                        <Route path="graficas" element={<Charts />} />
                         {/* Ruta para el DashboardTR */}
                        <Route path="dashboard-tr" element={<DashboardTR />} />
                        
                        <Route path="customer-si" element={<TopCustomersChart/>} />

                        <Route path="baratos-vendidos" element={<ProductCharts />} />
                        
                        {/* Ruta para mostrar solo productos */}
                        <Route path="productos" element={<div>Productos agregados</div>} />

                        {/* Ruta para mostrar solo views */}
                        <Route path="event-viewer" element={<EventViewer />} />


                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
