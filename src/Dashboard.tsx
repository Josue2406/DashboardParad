import React from 'react';
import Charts from './Charts';
import DynamicChart from './DynamicChart';
import SummaryCards from './summaryCards';
import Sidebar from './sidebar';

interface DashboardProps {
    token: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
    return (
        <div>
            <SummaryCards /> {/* Sección de tarjetas de resumen */}
            <Charts /> {/* Sección de gráficas */}
            <Sidebar/>
            
            {/* Mostrar DynamicChart solo si hay un token */}
            {token && <DynamicChart />}
        </div>
    );
};

export default Dashboard;
