// src/ClientesDashboard.tsx

import React from 'react';

const ClientesDashboard = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Clientes</h1>
            
            {/* Lista de clientes */}
            <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista de Clientes</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li className="hover:text-gray-800 cursor-pointer">Cliente 1 - cliente1@email.com</li>
                    <li className="hover:text-gray-800 cursor-pointer">Cliente 2 - cliente2@email.com</li>
                    <li className="hover:text-gray-800 cursor-pointer">Cliente 3 - cliente3@email.com</li>
                    <li className="hover:text-gray-800 cursor-pointer">Cliente 4 - cliente4@email.com</li>
                    <li className="hover:text-gray-800 cursor-pointer">Cliente 5 - cliente5@email.com</li>
                    {/* Puedes agregar más clientes o hacer esta lista dinámica */}
                </ul>
            </section>

            {/* Estadísticas de clientes */}
            <section className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Estadísticas de Clientes</h2>
                <p className="text-gray-600">Total de clientes: 150</p>
                <p className="text-gray-600">Clientes activos: 120</p>
                <p className="text-gray-600">Clientes inactivos: 30</p>
                {/* Estas estadísticas pueden ser dinámicas */}
            </section>
        </div>
    );
};

export default ClientesDashboard;
