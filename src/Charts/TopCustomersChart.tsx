import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

// Registrar componentes necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Customer {
  customerId: number;
  customerName: string;
  totalSpent: number;
}

interface Statistics {
  topFiveCustomers: Customer[];
}

const TopCustomersChart: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch datos desde el backend
  const fetchStatistics = async () => {
    try {
      const response = await fetch("https://localhost:7062/api/events"); // URL del endpoint
      const data = await response.json();
      console.log("Datos recibidos del servidor:", data);
      setStatistics(data); // Guardar estadísticas directamente
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (!statistics || !statistics.topFiveCustomers || statistics.topFiveCustomers.length === 0) {
    return <div>No hay datos disponibles para los clientes que más compran.</div>;
  }

  // Preparar los datos de la gráfica
  const topCustomers = statistics.topFiveCustomers;
  const chartData = {
    labels: topCustomers.map((customer) => customer.customerName), // Nombres de los clientes
    datasets: [
      {
        label: "Total Gastado ($)",
        data: topCustomers.map((customer) => customer.totalSpent), // Totales gastados
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", // Colores únicos para cada barra
        ],
        hoverBackgroundColor: [
          "#FF6384CC", "#36A2EBCC", "#FFCE56CC", "#4BC0C0CC", "#9966FFCC", // Colores al pasar el mouse
        ],
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard - Clientes que más compran</h1>

      {/* Gráfico de Barras: Clientes que más gastan */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Top 5 Clientes</h2>
        <Bar
          data={chartData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const customer = topCustomers[context.dataIndex];
                    return `Gastado: $${customer.totalSpent.toFixed(2)}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default TopCustomersChart;
