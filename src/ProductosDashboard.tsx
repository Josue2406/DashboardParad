// src/ProductosDashboard.tsx

import React from 'react';

const ProductosDashboard = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Productos</h1>
            
            {/* Lista de categorías de productos */}
            <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Categorías de Productos</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li className="hover:text-gray-800 cursor-pointer">Electrónica</li>
                    <li className="hover:text-gray-800 cursor-pointer">Ropa</li>
                    <li className="hover:text-gray-800 cursor-pointer">Hogar</li>
                    <li className="hover:text-gray-800 cursor-pointer">Deportes</li>
                    {/* Agrega más categorías aquí */}
                </ul>
            </section>

            {/* Sección de productos más vendidos */}
            <section className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Top 5 Productos Más Vendidos</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li className="hover:text-gray-800 cursor-pointer">Producto A - $1000</li>
                    <li className="hover:text-gray-800 cursor-pointer">Producto B - $850</li>
                    <li className="hover:text-gray-800 cursor-pointer">Producto C - $750</li>
                    <li className="hover:text-gray-800 cursor-pointer">Producto D - $500</li>
                    <li className="hover:text-gray-800 cursor-pointer">Producto E - $300</li>
                    {/* Esta lista puede ser dinámica, mostrando los productos más vendidos */}
                </ol>
            </section>
        </div>
    );
};

export default ProductosDashboard;

