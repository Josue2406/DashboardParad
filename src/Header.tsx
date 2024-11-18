
const Header = () => {
    return (
        <header className="flex justify-between items-center bg-gradient-to-r from-green-500 to-green-700 p-6 rounded-lg shadow-md text-white mb-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">
                    Dashboard
                </h1>
                <p className="text-lg font-light opacity-90">Bienvenido de nuevo, ¡esperamos que tengas un gran día!</p>
            </div>
            
            {/* Imagen de perfil */}
            <div className="flex items-center space-x-4">
                <img 
                    src="https://via.placeholder.com/50" 
                    alt="User Profile" 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
                <div className="text-right">
                    <p className="font-semibold">Usuario</p>
                    <p className="text-sm opacity-80">Perfil activo</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
