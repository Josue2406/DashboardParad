import * as signalR from "@microsoft/signalr";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Charts = () => {
  const [ventasMensuales, setVentasMensuales] = useState(Array(12).fill(0)); // Ventas por mes
  const [ventasPorProducto, setVentasPorProducto] = useState<{ [key: string]: number }>({}); // Ventas por producto
  const [selectedYear] = useState(new Date().getFullYear()); // Año seleccionado
  const [selectedMonth] = useState<string | "All">("All"); // Mes seleccionado para Pie Chart
  const [allData, setAllData] = useState<any[]>([]); // Almacenar todos los datos
  const [salesComparison, setSalesComparison] = useState<any[]>([]); // Datos para la nueva gráfica de comparación

  // Conexión a SignalR y Solicitud de Datos Iniciales
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7062/statisticsHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Solicitar datos iniciales del backend
    fetch("https://localhost:7062/api/events")
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos iniciales recibidos:", data);
        setAllData(data.purchasesByMonth || []); // Guardar los datos de ventas mensuales
        setSalesComparison(data.salesStatisticsByYear || []); // Guardar los datos de comparación de ventas por año
        actualizarDatosGraficas(data.purchasesByMonth, data.salesStatisticsByYear, selectedYear, selectedMonth);
      })
      .catch((error) => console.error("Error al cargar datos iniciales:", error));

    // Conectar a SignalR
    connection
      .start()
      .then(() => {
        console.log("Conectado a SignalR");

        // Escuchar eventos en tiempo real
        connection.on("ReceiveStatistics", (statistics: any) => {
          console.log("Datos en tiempo real recibidos:", statistics);
          setAllData(statistics.purchasesByMonth || []); // Actualizar los datos de ventas mensuales
          setSalesComparison(statistics.salesStatisticsByYear || []); // Actualizar la comparación de ventas por año
          actualizarDatosGraficas(statistics.purchasesByMonth, statistics.salesStatisticsByYear, selectedYear, selectedMonth);
        });
      })
      .catch((error) => {
        console.error("Error al conectar con SignalR:", error);
      });

    return () => {
      connection.stop().catch((error) => console.error("Error al detener la conexión:", error));
    };
  }, []);

  // Actualizar los datos cuando se cambia el año o mes
  useEffect(() => {
    actualizarDatosGraficas(allData, salesComparison, selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, allData, salesComparison]);

  const actualizarDatosGraficas = (purchasesByMonth: any[], _salesStats: any[], year: number, month: string | "All") => {
    if (!purchasesByMonth) return;

    // Filtrar datos por el año seleccionado
    const filteredData = purchasesByMonth.filter(({ month: monthKey }: any) => {
      const [dataYear] = monthKey.split("-");
      return parseInt(dataYear, 10) === year;
    });

    // Filtrar datos adicionales para el Pie Chart si un mes específico está seleccionado
    const pieChartData =
      month === "All"
        ? filteredData
        : filteredData.filter(({ month: monthKey }: any) => {
            const [, dataMonth] = monthKey.split("-");
            return parseInt(dataMonth, 10) === parseInt(month, 10);
          });

    actualizarVentasMensuales(filteredData);
    actualizarVentasPorProducto(pieChartData);
  };

  const actualizarVentasMensuales = (purchasesByMonth: any[]) => {
    const nuevasVentasMensuales = Array(12).fill(0);

    purchasesByMonth.forEach(({ month, totalAmount }: any) => {
      const [, monthString] = month.split("-");
      const mesIndex = parseInt(monthString, 10) - 1; // Convertir el mes a índice (0-11)
      nuevasVentasMensuales[mesIndex] = totalAmount;
    });

    setVentasMensuales(nuevasVentasMensuales);
  };

  const actualizarVentasPorProducto = (purchasesByMonth: any[]) => {
    const nuevasVentasPorProducto: { [key: string]: number } = {};

    purchasesByMonth.forEach(({ products }: any) => {
      products.forEach(({ name, price }: any) => {
        nuevasVentasPorProducto[name] = (nuevasVentasPorProducto[name] || 0) + price;
      });
    });

    setVentasPorProducto(nuevasVentasPorProducto);
  };

  // Datos para la nueva gráfica de comparación de meses


  const barData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        label: "Total Ventas por Mes",
        data: ventasMensuales,
        backgroundColor: "#84cc16",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(ventasPorProducto),
    datasets: [
      {
        data: Object.values(ventasPorProducto),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0", "#9966FF", "#FF9F80"],
      },
    ],
  };

  return (
    <section className="grid grid-cols-1 gap-6">
      {/* Filtro de Año 
      <div className="flex justify-end mb-4">
        <select
          className="border border-gray-300 p-2 rounded-md"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
        >
          {[...new Set(allData.map(({ month }: any) => month.split("-")[0]))].map((year: string) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div> */}

      {/* Gráficas Existentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
          <h2 className="text-lg font-semibold mb-4">Resumen de Ventas (Total por Mes)</h2>
          <Bar data={barData} options={{ maintainAspectRatio: false }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md w-full h-[400px]">
          <h2 className="text-lg font-semibold mb-4">Ventas por Producto</h2>
          <Pie data={pieData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

  
    </section>
  );
};

export default Charts;
