import { FaChartLine, FaTachometerAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {

    const navigate = useNavigate(); // Hook para redirigir

    const handleLogout = () => {
        // Aquí podrías limpiar el token o cualquier dato de autenticación si es necesario
        navigate('/'); // Redirige al login
    };

    return (
        <aside className="flex flex-col justify-between w-64 bg-white p-6 shadow-lg h-screen">
            <div>
                <h2 className="text-2xl font-bold mb-8 text-green-600">Mi Tienda</h2>
                <nav className="flex flex-col space-y-4 text-gray-600">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-green-100 ${
                                isActive ? 'text-green-700 font-semibold' : 'text-gray-600'
                            }`
                        }
                    >
                        <FaTachometerAlt />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/dashboard/graficas"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-green-100 ${
                                isActive ? 'text-green-700 font-semibold' : 'text-gray-600'
                            }`
                        }
                    >
                        <FaChartLine />
                        <span>Gráficas</span>
                    </NavLink>
                        {/* <NavLink
                        to="/dashboard/clientes"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-green-100 ${
                                isActive ? 'text-green-700 font-semibold' : 'text-gray-600'
                            }`
                        }
                    >
                        <FaUsers />
                        <span>Clientes</span>
                    </NavLink>
                    <NavLink
                        to="/dashboard/productos"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-green-100 ${
                                isActive ? 'text-green-700 font-semibold' : 'text-gray-600'
                            }`
                        }
                    >

                        <FaBoxOpen />
                        <span>Productos</span>
                    </NavLink> */}
                    <NavLink
                        to="/dashboard/event-viewer"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-green-100 ${
                                isActive ? 'text-green-700 font-semibold' : 'text-gray-600'
                            }`
                        }
                    >
                        <FaTachometerAlt />
                        <span>Eventos</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/dashboard-tr"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-green-100 ${
                                isActive ? 'text-green-700 font-semibold' : 'text-gray-600'
                            }`
                        }
                    >
                        <FaTachometerAlt />
                        <span>Mayores Compras</span>
                    </NavLink>
                    <NavLink
                        to="/dashboard/customer-si"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-green-100 ${
                                isActive ? 'text-green-700 font-semibold' : 'text-gray-600'
                            }`
                        }
                    >
                        <FaTachometerAlt />
                        <span>Mejores Clientes</span>
                    </NavLink>
                    <NavLink
                        to="/dashboard/baratos-vendidos"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-green-100 ${
                                isActive ? 'text-green-700 font-semibold' : 'text-gray-600'
                            }`
                        }
                    >
                        <FaTachometerAlt />
                        <span>Productos baratos y menos vendidos</span>
                    </NavLink>

                </nav>
            </div>

            <button
                onClick={handleLogout} // Vinculamos el método aquí
                className="bg-red-100 py-2 rounded-lg w-full hover:bg-red-200 text-red-600 font-semibold"
            >
                Cerrar Sesión
            </button>
        </aside>
    );
};

export default Sidebar;
