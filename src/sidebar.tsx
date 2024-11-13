import { FaTachometerAlt, FaBoxOpen, FaUsers, FaChartLine, FaCog } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white p-6 shadow-lg h-screen">
            <h2 className="text-2xl font-bold mb-8">Mi Tienda</h2>
            <nav className="flex flex-col space-y-6 text-gray-600">
                <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-900">
                    <FaTachometerAlt /> <span>Dashboard</span>
                </div>
                <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-900">
                    <FaBoxOpen /> <span>Productos</span>
                </div>
                <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-900">
                    <FaUsers /> <span>Clientes</span>
                </div>
                <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-900">
                    <FaChartLine /> <span>Análisis</span>
                </div>
                <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-900">
                    <FaCog /> <span>Configuración</span>
                </div>
            </nav>
            <button className="mt-auto bg-gray-100 py-2 rounded-lg w-full hover:bg-gray-200 text-gray-700 font-semibold">
                Cerrar Sesión
            </button>
        </aside>
    );
};

export default Sidebar;
