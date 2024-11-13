
const SummaryCards = () => {
    const cards = [
        { title: 'Ingresos Totales', value: `$45,231.89`, change: '+20.1% del mes pasado' },
        { title: 'Suscripciones', value: `+2350`, change: '+180.1% del mes pasado' },
        { title: 'Ventas', value: `+12,234`, change: '+19% del mes pasado' },
        { title: 'Clientes Activos', value: `+573`, change: '+201 desde la última hora' },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                    <p className="text-2xl font-bold mt-2">{card.value}</p>
                    <p className="text-green-500 text-sm mt-1">{card.change}</p>
                </div>
            ))}
        </section>
    );
};

export default SummaryCards;
