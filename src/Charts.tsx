/*
import { useEffect, useState } from "react";
import axios from "axios";
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

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Product {
  Id: number;
  ProductId: number;
  Name: string;
  Price: number;
}

interface EventData {
  PurchaseId: number;
  CustomerId: number;
  Products: Product[];
  Date: string;
}

const Charts = () => {
  const [ventasMensuales, setVentasMensuales] = useState(Array(12).fill(0)); // Datos mensuales inicializados en 0
  const [ventasPorCategoria, setVentasPorCategoria] = useState<{ [key: string]: number }>({});
  const [cargaInicialCompleta, setCargaInicialCompleta] = useState(false); // Control de carga inicial

  // Cargar eventos antiguos al montar el componente
  useEffect(() => {
    const fetchOldEvents = async () => {
      try {
        const response = await axios.get<EventData[]>("https://localhost:7062/api/events/old");
        const oldEvents = response.data;

        oldEvents.forEach((event) => {
          console.log("Procesando evento antiguo:", event);
          actualizarDatosGraficas(event);
        });

        setCargaInicialCompleta(true); // Habilitar la recepción de eventos en tiempo real
      } catch (error) {
        console.error("Error al cargar eventos antiguos:", error);
      }
    };

    fetchOldEvents();
  }, []);

  // Conectar a SignalR para recibir eventos en tiempo real
  useEffect(() => {
    if (!cargaInicialCompleta) return; // Evitar conexión hasta que termine la carga inicial

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7062/eventHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => {
        console.log("Conectado a SignalR");
        connection.on("ReceiveEvent", (eventData: { data: string; isNew: boolean }) => {
          console.log("Evento en tiempo real recibido:", eventData);
          actualizarDatosGraficas(eventData);
        });
      })
      .catch((error) => console.error("Error al conectar con SignalR:", error));

    return () => {
      connection.stop();
    };
  }, [cargaInicialCompleta]);

  const actualizarDatosGraficas = (eventData: EventData | { data: string; isNew: boolean }) => {
    let parsedData: EventData;

    if ("data" in eventData) {
      try {
        parsedData = JSON.parse(eventData.data);
      } catch (error) {
        console.error("Error al parsear el evento:", error);
        return;
      }
    } else {
      parsedData = eventData;
    }

    const { Products, Date: eventDate } = parsedData;

    if (!Array.isArray(Products) || Products.length === 0) {
      console.warn("El evento no contiene productos válidos:", parsedData);
      return;
    }

    const mes = new Date(eventDate).getMonth();
    const montoTotal = Products.reduce((total, product) => total + product.Price, 0);

    setVentasMensuales((prevVentasMensuales) => {
      const nuevasVentasMensuales = [...prevVentasMensuales];
      nuevasVentasMensuales[mes] += montoTotal;
      console.log("Ventas mensuales actualizadas:", nuevasVentasMensuales);
      return nuevasVentasMensuales;
    });

    Products.forEach((product) => {
      const categoria = product.Name;
      setVentasPorCategoria((prevVentasPorCategoria) => {
        const nuevasVentasPorCategoria = {
          ...prevVentasPorCategoria,
          [categoria]: (prevVentasPorCategoria[categoria] || 0) + product.Price,
        };
        console.log("Ventas por categoría actualizadas:", nuevasVentasPorCategoria);
        return nuevasVentasPorCategoria;
      });
    });
  };

  const dynamicColors = (numColors: number) => {
    return Array.from({ length: numColors }, () =>
      `#${Math.floor(Math.random() * 16777215).toString(16)}`
    );
  };

  const barData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        label: "Ventas",
        data: ventasMensuales,
        backgroundColor: "#84cc16",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(ventasPorCategoria),
    datasets: [
      {
        data: Object.values(ventasPorCategoria),
        backgroundColor: dynamicColors(Object.keys(ventasPorCategoria).length),
      },
    ],
  };

  if (!cargaInicialCompleta) {
    return <div className="text-center mt-10">Cargando datos...</div>;
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
        <h2 className="text-lg font-semibold mb-4">Resumen de Ventas</h2>
        <Bar data={barData} options={{ maintainAspectRatio: false }} style={{ height: "200px" }} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md w-full h-[400px]">
        <h2 className="text-lg font-semibold mb-4">Ventas por Categoría</h2>
        <Pie data={pieData} options={{ maintainAspectRatio: false }} style={{ height: "300px" }} />
      </div>
    </section>
  );
};

export default Charts;
*/
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

interface Product {
  Id: number;
  ProductId: number;
  Name: string;
  Price: number;
}

interface EventData {
  data: string; // Evento en formato JSON (como string)
  isNew: boolean; // Indica si el evento es nuevo o antiguo
}

const Charts = () => {
  const [ventasMensuales, setVentasMensuales] = useState(Array(12).fill(0)); // Datos inicializados
  const [ventasPorCategoria, setVentasPorCategoria] = useState<{ [key: string]: number }>({});

  // Conexión a SignalR
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7062/eventHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => {
        console.log("Conectado a SignalR");

        // Recibir eventos antiguos y nuevos
        connection.on("ReceiveEvent", (eventData: EventData | EventData[]) => {
          if (Array.isArray(eventData)) {
            // Procesar lotes de eventos antiguos
            eventData.forEach((event) => actualizarDatosGraficas(event));
          } else {
            // Procesar evento individual (nuevo o antiguo)
            actualizarDatosGraficas(eventData);
          }
        });
      })
      .catch((error) => console.error("Error al conectar con SignalR:", error));

    return () => {
      connection.stop();
    };
  }, []);

  const actualizarDatosGraficas = (eventData: EventData) => {
    console.log(`Procesando evento (${eventData.isNew ? "Nuevo" : "Antiguo"}):`, eventData);

    try {
      const parsedData = JSON.parse(eventData.data); // Parsear el JSON recibido
      const { Products, Date: eventDate } = parsedData;

      if (!Array.isArray(Products) || Products.length === 0) return;

      const mes = new Date(eventDate).getMonth();
      const montoTotal = Products.reduce((total: number, product: Product) => total + product.Price, 0);

      // Actualizar datos de ventas mensuales
      setVentasMensuales((prevVentasMensuales) => {
        const nuevasVentasMensuales = [...prevVentasMensuales];
        nuevasVentasMensuales[mes] += montoTotal;
        return nuevasVentasMensuales;
      });

      // Actualizar datos de ventas por categoría
      Products.forEach((product: Product) => {
        const categoria = product.Name;
        setVentasPorCategoria((prevVentasPorCategoria) => {
          const nuevasVentasPorCategoria = {
            ...prevVentasPorCategoria,
            [categoria]: (prevVentasPorCategoria[categoria] || 0) + product.Price,
          };
          return nuevasVentasPorCategoria;
        });
      });
    } catch (error) {
      console.error("Error al procesar el evento:", error);
    }
  };

  const barData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        label: "Ventas",
        data: ventasMensuales,
        backgroundColor: "#84cc16",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(ventasPorCategoria),
    datasets: [
      {
        data: Object.values(ventasPorCategoria),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40"],
      },
    ],
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-md w-full h-96">
        <h2 className="text-lg font-semibold mb-4">Resumen de Ventas</h2>
        <Bar data={barData} options={{ maintainAspectRatio: false }} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md w-full h-[400px]">
        <h2 className="text-lg font-semibold mb-4">Ventas por Categoría</h2>
        <Pie data={pieData} options={{ maintainAspectRatio: false }} />
      </div>
    </section>
  );
};

export default Charts;
