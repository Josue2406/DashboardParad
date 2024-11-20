// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from "chart.js";
// import { Bar, Pie } from "react-chartjs-2";
// import * as signalR from "@microsoft/signalr";
// import { useEffect, useState } from "react";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// const Charts = () => {
//   const [ventasMensuales, setVentasMensuales] = useState(Array(12).fill(0)); // Ventas por mes
//   const [ventasPorProducto, setVentasPorProducto] = useState<{ [key: string]: number }>({}); // Ventas por producto

//   // Conexión a SignalR
//   useEffect(() => {
//     const connection = new signalR.HubConnectionBuilder()
//       .withUrl("https://localhost:7062/statisticsHub", {
//         skipNegotiation: true,
//         transport: signalR.HttpTransportType.WebSockets,
//       })
//       .withAutomaticReconnect()
//       .configureLogging(signalR.LogLevel.Information)
//       .build();
  
//     let isMounted = true; // Variable para controlar el desmontaje del componente
  
//     connection
//       .start()
//       .then(() => {
//         if (isMounted) {
//           console.log("Conectado a SignalR");
//           connection.on("ReceiveStatistics", (statistics: any) => {
//             console.log("Datos recibidos:", statistics);
//             actualizarDatosGraficas(statistics);
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("Error al conectar con SignalR:", error);
//       });
  
//     return () => {
//       isMounted = false; // Marcar como desmontado antes de detener la conexión
//       connection.stop().catch((error) => console.error("Error al detener la conexión:", error));
//     };
//   }, []);
  

//   const actualizarDatosGraficas = (statistics: any) => {
//     if (statistics.purchasesByMonth) {
//       actualizarVentasMensuales(statistics.purchasesByMonth);
//       actualizarVentasPorProducto(statistics.purchasesByMonth);
//     }
//   };

//   const actualizarVentasMensuales = (purchasesByMonth: any[]) => {
//     const nuevasVentasMensuales = Array(12).fill(0);

//     purchasesByMonth.forEach(({ month, totalAmount }: any) => {
//       const [year, monthString] = month.split("-");
//       const mesIndex = parseInt(monthString, 10) - 1; // Convertir el mes a índice (0-11)
//       nuevasVentasMensuales[mesIndex] = totalAmount;
//     });

//     setVentasMensuales(nuevasVentasMensuales);
//   };

//   const actualizarVentasPorProducto = (purchasesByMonth: any[]) => {
//     const nuevasVentasPorProducto: { [key: string]: number } = {};

//     purchasesByMonth.forEach(({ products }: any) => {
//       products.forEach(({ productId, name, price }: any) => {
//         nuevasVentasPorProducto[name] = (nuevasVentasPorProducto[name] || 0) + price;
//       });
//     });

//     setVentasPorProducto(nuevasVentasPorProducto);
//   };

//   const barData = {
//     labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
//     datasets: [
//       {
//         label: "Total Ventas por Mes",
//         data: ventasMensuales,
//         backgroundColor: "#84cc16",
//       },
//     ],
//   };

//   const pieData = {
//     labels: Object.keys(ventasPorProducto),
//     datasets: [
//       {
//         data: Object.values(ventasPorProducto),
//         backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0", "#9966FF", "#FF9F80"],
//       },
//     ],
//   };

//   return (
//     <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
//         <h2 className="text-lg font-semibold mb-4">Resumen de Ventas (Total por Mes)</h2>
//         <Bar data={barData} options={{ maintainAspectRatio: false }} />
//       </div>
//       <div className="bg-white p-4 rounded-lg shadow-md w-full h-[400px]">
//         <h2 className="text-lg font-semibold mb-4">Ventas por Producto</h2>
//         <Pie data={pieData} options={{ maintainAspectRatio: false }} />
//       </div>
//     </section>
//   );
// };

// export default Charts;


import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import * as signalR from "@microsoft/signalr";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Charts = () => {
  const [ventasMensuales, setVentasMensuales] = useState(Array(12).fill(0)); // Ventas por mes
  const [ventasPorProducto, setVentasPorProducto] = useState<{ [key: string]: number }>({}); // Ventas por producto

  // Conexión a SignalR y Solicitud de Datos Iniciales
  useEffect(() => {
    // Configuración de la conexión a SignalR
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
        actualizarDatosGraficas(data);
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
          actualizarDatosGraficas(statistics);
        });
      })
      .catch((error) => {
        console.error("Error al conectar con SignalR:", error);
      });

    return () => {
      connection.stop().catch((error) => console.error("Error al detener la conexión:", error));
    };
  }, []);

  const actualizarDatosGraficas = (data: any) => {
    if (data.purchasesByMonth) {
      actualizarVentasMensuales(data.purchasesByMonth);
      actualizarVentasPorProducto(data.purchasesByMonth);
    }
  };

  const actualizarVentasMensuales = (purchasesByMonth: any[]) => {
    const nuevasVentasMensuales = Array(12).fill(0);

    purchasesByMonth.forEach(({ month, totalAmount }: any) => {
      const [year, monthString] = month.split("-");
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
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
        <h2 className="text-lg font-semibold mb-4">Resumen de Ventas (Total por Mes)</h2>
        <Bar data={barData} options={{ maintainAspectRatio: false }} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md w-full h-[400px]">
        <h2 className="text-lg font-semibold mb-4">Ventas por Producto</h2>
        <Pie data={pieData} options={{ maintainAspectRatio: false }} />
      </div>
    </section>
  );
};

export default Charts;
