import React from 'react';
import { FaTachometerAlt, FaBoxOpen, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate(); // Hook para redirigir

    const handleLogout = () => {
        // Aquí podrías limpiar el token o cualquier dato de autenticación si es necesario
        navigate('/login'); // Redirige al login
    };

    return (
        <aside className="w-64 bg-white p-6 shadow-lg h-screen">
            <h2 className="text-2xl font-bold mb-8">Mi Tienda</h2>
            <nav className="flex flex-col space-y-6 text-gray-600">
                <div 
                    className="flex items-center space-x-3 cursor-pointer hover:text-gray-900"
                    onClick={() => navigate('/Dashboard')} // Redirige al Dashboard
                >
                    <FaTachometerAlt /> <span>Dashboard</span>
                </div>
                
                <div 
                    className="flex items-center space-x-3 cursor-pointer hover:text-gray-900"
                    onClick={() => navigate('/productos')} // Redirige a ProductosDashboard
                >
                    <FaBoxOpen /> <span>Productos</span>
                </div>

                <div 
                    className="flex items-center space-x-3 cursor-pointer hover:text-gray-900"
                    onClick={() => navigate('/clientes')} // Redirige a ClientesDashboard
                >
                    <FaUsers /> <span>Clientes</span>
                </div>
            </nav>
            <button 
                onClick={handleLogout} 
                className="mt-auto bg-gray-100 py-2 rounded-lg w-full hover:bg-gray-200 text-gray-700 font-semibold"
            >
                Cerrar Sesión
            </button>
        </aside>
    );
};

export default Sidebar;
