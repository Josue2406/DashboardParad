/*import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, PieController, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, PieController, ArcElement, Tooltip, Legend);

interface PurchaseData {
  customerId: number;
  customerName: string;
  productId: number;
  productName: string;
  amount: number;
}

const DashboardMetrics: React.FC = () => {
  const [purchases, setPurchases] = useState<PurchaseData[]>([]); // Todas las compras recibidas
  const [highestPurchase, setHighestPurchase] = useState<PurchaseData | null>(null); // Compra más cara
  const [topProduct, setTopProduct] = useState<{ name: string; count: number } | null>(null); // Producto más vendido
  const [topCustomer, setTopCustomer] = useState<{ name: string; count: number } | null>(null); // Persona que más compró
  const [highestSpender, setHighestSpender] = useState<{ name: string; total: number } | null>(null); // Persona que más gastó

  const [connection, setConnection] = useState<HubConnection | null>(null); // Conexión con SignalR

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("") // Reemplaza con la URL correcta
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Conexión a SignalR establecida");

          connection.on("NewPurchase", (newData: PurchaseData) => {
            console.log("Datos recibidos:", newData);
            setPurchases((prevData) => {
              const updatedData = [...prevData, newData];
              calculateMetrics(updatedData); // Calcular métricas con los nuevos datos
              return updatedData;
            });
          });
        })
        .catch((err) => console.error("Error al conectar a SignalR:", err));
    }

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  const calculateMetrics = (data: PurchaseData[]) => {
    if (data.length === 0) return;

    // Compra más cara
    const maxPurchase = data.reduce((max, item) => (item.amount > max.amount ? item : max), data[0]);
    setHighestPurchase(maxPurchase);

    // Producto más vendido
    const productCounts = data.reduce((counts: { [key: string]: number }, item) => {
      counts[item.productName] = (counts[item.productName] || 0) + 1;
      return counts;
    }, {});
    const topProductEntry = Object.entries(productCounts).reduce((top, entry) => (entry[1] > top[1] ? entry : top), ["", 0]);
    setTopProduct({ name: topProductEntry[0], count: topProductEntry[1] });

    // Persona que más compró
    const customerCounts = data.reduce((counts: { [key: string]: number }, item) => {
      counts[item.customerName] = (counts[item.customerName] || 0) + 1;
      return counts;
    }, {});
    const topCustomerEntry = Object.entries(customerCounts).reduce((top, entry) => (entry[1] > top[1] ? entry : top), ["", 0]);
    setTopCustomer({ name: topCustomerEntry[0], count: topCustomerEntry[1] });

    // Persona que más gastó
    const customerTotals = data.reduce((totals: { [key: string]: number }, item) => {
      totals[item.customerName] = (totals[item.customerName] || 0) + item.amount;
      return totals;
    }, {});
    const highestSpenderEntry = Object.entries(customerTotals).reduce((top, entry) => (entry[1] > top[1] ? entry : top), ["", 0]);
    setHighestSpender({ name: highestSpenderEntry[0], total: highestSpenderEntry[1] });
  };

  const productChartData = {
    labels: purchases.map((purchase) => purchase.productName),
    datasets: [
      {
        label: "Ventas por Producto",
        data: purchases.reduce((counts: { [key: string]: number }, purchase) => {
          counts[purchase.productName] = (counts[purchase.productName] || 0) + 1;
          return counts;
        }, {}),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h2>Compra más cara</h2>
        {highestPurchase ? (
          <p>
            <strong>Producto:</strong> {highestPurchase.productName} - <strong>Precio:</strong> ${highestPurchase.amount.toFixed(2)}
          </p>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </div>

      <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h2>Producto más vendido</h2>
        {topProduct ? (
          <p>
            <strong>Producto:</strong> {topProduct.name} - <strong>Ventas:</strong> {topProduct.count}
          </p>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </div>

      <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h2>Persona con más compras</h2>
        {topCustomer ? (
          <p>
            <strong>Cliente:</strong> {topCustomer.name} - <strong>Compras:</strong> {topCustomer.count}
          </p>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </div>

      <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h2>Persona que más gastó</h2>
        {highestSpender ? (
          <p>
            <strong>Cliente:</strong> {highestSpender.name} - <strong>Total Gastado:</strong> ${highestSpender.total.toFixed(2)}
          </p>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </div>

      <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h2>Productos Vendidos</h2>
        <Pie data={productChartData} />
      </div>
    </div>
  );
};

export default DashboardMetrics;
*/



/*
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, Title, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, Title, Tooltip, Legend);

interface Statistics {
  purchasesByMonth: { month: string; totalAmount: number; totalPurchases: number; }[];
  mostExpensiveProduct: {
    productId: number;
    productName: string;
    productPrice: number;
    productCount: number;
    productCategory: string;
    commerceId: number;
  } | null;
  topProvince: { province: string; totalPurchases: number; }[];
  salesStatisticsByYear: { year: number; maxSalesMonth: { month: string; totalAmount: number; }; minSalesMonth: { month: string; totalAmount: number; }; }[];
}

const DashboardTR: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7062/api/events") // Reemplaza con la URL de tu SignalR Hub
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Conexión establecida con SignalR");

          connection.on("ReceiveStatistics", (data: Statistics) => {
            console.log("Datos recibidos desde el servidor:", data);
            setStatistics(data);
          });
        })
        .catch((error) =>
          console.error("Error al conectar con SignalR:", error)
        );
    }

    return () => {
      connection?.stop();
    };
  }, [connection]);

  if (!statistics) {
    return <div>Cargando estadísticas...</div>;
  }

  // Preparar datos para los gráficos
  const provinceChartData = {
    labels: statistics.topProvince.map((province) => province.province),
    datasets: [
      {
        label: "Total de Compras por Provincia",
        data: statistics.topProvince.map((province) => province.totalPurchases),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  };

  const productsChartData = {
    labels: statistics.purchasesByMonth.map((month) => month.month),
    datasets: [
      {
        label: "Total de Ventas (Monto)",
        data: statistics.purchasesByMonth.map((data) => data.totalAmount),
        fill: false,
        borderColor: "#36A2EB",
        tension: 0.1,
      },
    ],
  };

  const purchasesChartData = {
    labels: statistics.purchasesByMonth.map((month) => month.month),
    datasets: [
      {
        label: "Total de Compras (Cantidad)",
        data: statistics.purchasesByMonth.map((data) => data.totalPurchases),
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard - Tiempo Real</h1>

      {/* Producto más caro /}
      <div style={{ marginBottom: "20px" }}>
        <h2>Producto más caro</h2>
        {statistics.mostExpensiveProduct ? (
          <div>
            <p>Producto: {statistics.mostExpensiveProduct.productName}</p>
            <p>Precio: ${statistics.mostExpensiveProduct.productPrice}</p>
            <p>Categoría: {statistics.mostExpensiveProduct.productCategory}</p>
          </div>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </div>

      {/* Gráfico de Barras: Compras por Provincia /}
      <div style={{ marginBottom: "40px" }}>
        <h2>Total de Compras por Provincia</h2>
        <Bar data={provinceChartData} />
      </div>

      {/* Gráfico de Líneas: Total de Ventas por Mes /}
      <div style={{ marginBottom: "40px" }}>
        <h2>Total de Ventas (Monto) por Mes</h2>
        <Line data={productsChartData} />
      </div>

      {/* Gráfico de Barras: Total de Compras por Mes /}
      <div style={{ marginBottom: "40px" }}>
        <h2>Total de Compras (Cantidad) por Mes</h2>
        <Bar data={purchasesChartData} />
      </div>
    </div>
  );
};

export default DashboardTR;
*/

/*
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";

// Registra todos los componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Statistics {
  mostExpensiveProduct: {
    productId: number;
    productName: string;
    productPrice: number;
    productCount: number;
    productCategory: string;
    commerceId: number;
  } | null;
  purchasesByMonth: { month: string; totalAmount: number }[];
  topProvince: { province: string; totalPurchases: number } | null;
}

const DashboardTR: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch datos desde el backend
  const fetchStatistics = async () => {
    try {
      const response = await fetch("https://localhost:7062/api/events"); // URL del endpoint
      const data = await response.json();
      console.log("Eventos recibidos del servidor:", data);
      setStatistics(data); // Guardar estadísticas directamente
    } catch (error) {
      console.error("Error al obtener eventos:", error);
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

  if (!statistics) {
    return <div>No se encontraron estadísticas para mostrar.</div>;
  }

  // Preparar datos para las gráficas
  const purchasesByMonthChartData = {
    labels: statistics.purchasesByMonth.map((entry) => entry.month),
    datasets: [
      {
        label: "Total de Ventas por Mes",
        data: statistics.purchasesByMonth.map((entry) => entry.totalAmount),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        fill: true,
      },
    ],
  };

  const topProvinceChartData = {
    labels: [statistics.topProvince?.province || "Sin datos"],
    datasets: [
      {
        label: "Total de Compras por Provincia",
        data: [statistics.topProvince?.totalPurchases || 0],
        backgroundColor: ["#FF6384"],
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard - Estadísticas</h1>

      {/* Producto más caro /}
      <div style={{ marginBottom: "20px" }}>
        <h2>Producto más caro</h2>
        {statistics.mostExpensiveProduct ? (
          <div>
            <p>
              <strong>Producto:</strong> {statistics.mostExpensiveProduct.productName}
            </p>
            <p>
              <strong>Precio:</strong> ${statistics.mostExpensiveProduct.productPrice.toFixed(2)}
            </p>
            <p>
              <strong>Categoría:</strong> {statistics.mostExpensiveProduct.productCategory}
            </p>
          </div>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </div>

      {/* Gráfico de Líneas: Total de Ventas por Mes /}
      <div style={{ marginBottom: "40px" }}>
        <h2>Total de Ventas por Mes</h2>
        <Line data={purchasesByMonthChartData} key={JSON.stringify(purchasesByMonthChartData)} />
      </div>

      {/* Gráfico de Barras: Total de Compras por Provincia /}
      <div style={{ marginBottom: "40px" }}>
        <h2>Total de Compras por Provincia</h2>
        <Bar data={topProvinceChartData} key={JSON.stringify(topProvinceChartData)} />
      </div>
    </div>
  );
};

export default DashboardTR;
*/



import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

// Registrar componentes necesarios
ChartJS.register(CategoryScale, LinearScale,PointElement, BarElement,LineElement, Title, Tooltip, Legend);

interface Product {
  productId: number;
  productName: string;
  productCategory: string;
  totalPrice: number;
}

interface Statistics {
  topFiveExpensiveProducts: Product[];
  purchasesByMonth: { month: string; totalAmount: number }[];
  topProvince: { province: string; totalPurchases: number } | null;
}


const DashboardTR: React.FC = () => {
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

  if (!statistics || !statistics.topFiveExpensiveProducts || statistics.topFiveExpensiveProducts.length === 0) {
    return <div>No hay datos disponibles para los productos más caros.</div>;
  }

  // Preparar los datos de la gráfica
  const topProducts = statistics.topFiveExpensiveProducts;
  const chartData = {
    labels: topProducts.map((product) => product.productName), // Nombres de los productos
    datasets: [
      {
        label: "Precio Total ($)",
        data: topProducts.map((product) => product.totalPrice), // Precios totales
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", // Colores únicos para cada barra
        ],
        hoverBackgroundColor: [
          "#FF6384CC", "#36A2EBCC", "#FFCE56CC", "#4BC0C0CC", "#9966FFCC", // Colores al pasar el mouse
        ],
      },
    ],
  };

  const topProvinceChartData = {
    labels: [statistics.topProvince?.province || "Sin datos"],
    datasets: [
      {
        label: "Total de Compras por Provincia",
        data: [statistics.topProvince?.totalPurchases || 0],
        backgroundColor: ["#FF6384"],
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard - Productos más caros</h1>

      {/* Gráfico de Barras: Productos más caros */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Top 5 Productos más Caros</h2>
        <Bar
          data={chartData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const product = topProducts[context.dataIndex];
                    return `Categoría: ${product.productCategory} - Precio: $${product.totalPrice.toFixed(2)}`;
                  },
                },
              },
            },
          }}
        />
      </div>
      {/* Gráfico de Barras: Total de Compras por Provincia */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Total de Compras por Provincia</h2>
        <Bar data={topProvinceChartData} key={JSON.stringify(topProvinceChartData)} />
      </div>
    </div>
  );
};

export default DashboardTR;
