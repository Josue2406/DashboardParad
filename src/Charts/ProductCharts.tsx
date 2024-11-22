/*import {
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

// Registrar componentes necesarios de ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Product {
  productId: number;
  productName: string;
  productCategory: string;
  totalSold?: number; // Para productos menos vendidos
  price?: number; // Para productos más baratos
}

interface Statistics {
  leastSoldProducts: Product[];
  cheapestProducts: Product[];
}

const ProductCharts: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para obtener datos de la API
  const fetchStatistics = async () => {
    try {
      const response = await fetch("https://localhost:7062/api/events"); // URL del endpoint
      if (!response.ok) {
        throw new Error("Error al obtener datos de la API");
      }
      const data = await response.json();
      console.log("Datos recibidos del servidor:", data);
      setStatistics(data); // Guardar estadísticas en el estado
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Mostrar mensaje de carga mientras los datos se obtienen
  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  // Mostrar mensaje si no hay datos disponibles
  if (!statistics) {
    return <div>No se encontraron datos disponibles.</div>;
  }

  // Preparar los datos para las gráficas
  const leastSoldData = {
    labels: statistics.leastSoldProducts.map((product) => product.productName),
    datasets: [
      {
        label: "Cantidad Vendida",
        data: statistics.leastSoldProducts.map((product) => product.totalSold),
        backgroundColor: "#FF6384",
        hoverBackgroundColor: "#FF6384CC",
      },
    ],
  };

  const cheapestData = {
    labels: statistics.cheapestProducts.map((product) => product.productName),
    datasets: [
      {
        label: "Precio ($)",
        data: statistics.cheapestProducts.map((product) => product.price),
        backgroundColor: "#36A2EB",
        hoverBackgroundColor: "#36A2EBCC",
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Productos - Estadísticas</h1>

      {/* Gráfico para productos menos vendidos /}
      <div style={{ marginBottom: "40px" }}>
        <h2>Productos Menos Vendidos</h2>
        <Bar
          data={leastSoldData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const product =
                      statistics.leastSoldProducts[context.dataIndex];
                    return `Categoría: ${product.productCategory} - Vendidos: ${product.totalSold}`;
                  },
                },
              },
            },
          }}
        />
      </div>

      {/* Gráfico para productos más baratos /}
      <div>
        <h2>Productos Más Baratos</h2>
        <Bar
          data={cheapestData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const product =
                      statistics.cheapestProducts[context.dataIndex];
                    return `Categoría: ${product.productCategory} - Precio: $${product.price?.toFixed(
                      2
                    )}`;
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

export default ProductCharts;*/


/*
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

// Registrar componentes necesarios de ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Product {
  productId: number;
  productName: string;
  productCategory: string;
  totalSold?: number; // Para productos menos vendidos
  price?: number; // Para productos más baratos
}

interface Statistics {
  leastSoldProducts: Product[];
  cheapestProducts: Product[];
}

const ProductCharts: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para obtener datos de la API
  const fetchStatistics = async () => {
    try {
      const response = await fetch("https://localhost:7062/api/events"); // URL del endpoint
      if (!response.ok) {
        throw new Error("Error al obtener datos de la API");
      }
      const data = await response.json();
      console.log("Datos recibidos del servidor:", data);
      setStatistics(data); // Guardar estadísticas en el estado
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Mostrar mensaje de carga mientras los datos se obtienen
  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  // Mostrar mensaje si no hay datos disponibles
  if (!statistics) {
    return <div>No se encontraron datos disponibles.</div>;
  }

  // Asignar colores a cada categoría
  const categoryColors: { [key: string]: string } = {
    "Movies, Outdoors & Toys": "#FF6384",
    Automotive: "#36A2EB",
    "Shoes & Computers": "#FFCE56",
    "Industrial & Grocery": "#4BC0C0",
    Clothing: "#9966FF",
    // Añade más categorías y colores aquí
  };

  const getColorForCategory = (category: string): string => {
    return categoryColors[category] || "#CCCCCC"; // Color por defecto si no hay coincidencia
  };

  // Datos para productos menos vendidos
  const leastSoldData = {
    labels: statistics.leastSoldProducts.map((product) => product.productName),
    datasets: [
      {
        label: "Cantidad Vendida",
        data: statistics.leastSoldProducts.map((product) => product.totalSold),
        backgroundColor: statistics.leastSoldProducts.map((product) =>
          getColorForCategory(product.productCategory)
        ),
        hoverBackgroundColor: statistics.leastSoldProducts.map((product) =>
          getColorForCategory(product.productCategory)
        ),
      },
    ],
  };

  // Datos para productos más baratos
  const cheapestData = {
    labels: statistics.cheapestProducts.map((product) => product.productName),
    datasets: [
      {
        label: "Precio ($)",
        data: statistics.cheapestProducts.map((product) => product.price),
        backgroundColor: statistics.cheapestProducts.map((product) =>
          getColorForCategory(product.productCategory)
        ),
        hoverBackgroundColor: statistics.cheapestProducts.map((product) =>
          getColorForCategory(product.productCategory)
        ),
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Productos - Estadísticas</h1>

      {/* Gráfico para productos menos vendidos /}
      <div style={{ marginBottom: "40px" }}>
        <h2>Productos Menos Vendidos</h2>
        <Bar
          data={leastSoldData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const product =
                      statistics.leastSoldProducts[context.dataIndex];
                    return `Categoría: ${product.productCategory} - Vendidos: ${product.totalSold}`;
                  },
                },
              },
            },
          }}
        />
      </div>

      {/* Gráfico para productos más baratos /}
      <div>
        <h2>Productos Más Baratos</h2>
        <Bar
          data={cheapestData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const product =
                      statistics.cheapestProducts[context.dataIndex];
                    return `Categoría: ${product.productCategory} - Precio: $${product.price?.toFixed(
                      2
                    )}`;
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

export default ProductCharts;

*/


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

// Registrar componentes necesarios de ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Product {
  productId: number;
  productName: string;
  productCategory: string;
  totalSold?: number; // Para productos menos vendidos
  price?: number; // Para productos más baratos
}

interface Statistics {
  leastSoldProducts: Product[];
  cheapestProducts: Product[];
}

const ProductCharts: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para obtener datos de la API
  const fetchStatistics = async () => {
    try {
      const response = await fetch("https://localhost:7062/api/events"); // URL del endpoint
      if (!response.ok) {
        throw new Error("Error al obtener datos de la API");
      }
      const data = await response.json();
      console.log("Datos recibidos del servidor:", data);
      setStatistics(data); // Guardar estadísticas en el estado
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Mostrar mensaje de carga mientras los datos se obtienen
  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  // Mostrar mensaje si no hay datos disponibles
  if (!statistics) {
    return <div>No se encontraron datos disponibles.</div>;
  }

  // Asignar colores a cada categoría
  const categoryColors: { [key: string]: string } = {
    "Movies, Outdoors & Toys": "#FF6384",
    Automotive: "#36A2EB",
    "Shoes & Computers": "#FFCE56",
    "Industrial & Grocery": "#4BC0C0",
    Home: "#9966FF",
    "Sports, Health & Kids": "#FF9F40",
    Games: "#FFCD56",
    Clothing: "#4DC0B5",
    // Añade más categorías y colores aquí
  };

  const getColorForCategory = (category: string): string => {
    return categoryColors[category] || "#CCCCCC"; // Color por defecto si no hay coincidencia
  };

  // Datos para productos menos vendidos
  const leastSoldData = {
    labels: statistics.leastSoldProducts.map((product) => product.productName),
    datasets: [
      {
        label: "Cantidad Vendida",
        data: statistics.leastSoldProducts.map((product) => product.totalSold),
        backgroundColor: statistics.leastSoldProducts.map((product) =>
          getColorForCategory(product.productCategory)
        ),
        hoverBackgroundColor: statistics.leastSoldProducts.map((product) =>
          getColorForCategory(product.productCategory)
        ),
      },
    ],
  };

  // Datos para productos más baratos
  const cheapestData = {
    labels: statistics.cheapestProducts.map((product) => product.productName),
    datasets: [
      {
        label: "Precio ($)",
        data: statistics.cheapestProducts.map((product) => product.price),
        backgroundColor: statistics.cheapestProducts.map((product) =>
          getColorForCategory(product.productCategory)
        ),
        hoverBackgroundColor: statistics.cheapestProducts.map((product) =>
          getColorForCategory(product.productCategory)
        ),
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Productos - Estadísticas</h1>

      {/* Gráfico para productos menos vendidos */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Productos Menos Vendidos</h2>
        <Bar
          data={leastSoldData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const product =
                      statistics.leastSoldProducts[context.dataIndex];
                    return `Categoría: ${product.productCategory} - Vendidos: ${product.totalSold}`;
                  },
                },
              },
            },
          }}
        />
      </div>

      {/* Gráfico para productos más baratos */}
      <div>
        <h2>Productos Más Baratos</h2>
        <Bar
          data={cheapestData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const product =
                      statistics.cheapestProducts[context.dataIndex];
                    return `Categoría: ${product.productCategory} - Precio: $${product.price?.toFixed(
                      2
                    )}`;
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

export default ProductCharts;
