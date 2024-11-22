
const Header = () => {
    return (
        <header className="flex justify-between items-center bg-gradient-to-r from-green-500 to-green-700 p-6 rounded-lg shadow-md text-white mb-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">
                    Dashboard
                </h1>
                <p className="text-lg font-light opacity-90">Bienvenido de nuevo, ¡esperamos que tengas un gran día!</p>
            </div>
            
        </header>
    );
};

export default Header;
