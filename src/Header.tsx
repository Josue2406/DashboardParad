
const Header = () => {
    return (
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">
                Configuración
            </button>
        </header>
    );
};

export default Header;
