// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import type { ChartOptions } from 'chart.js';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from 'chart.js';
// import * as signalR from '@microsoft/signalr';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// interface ProductSales {
//   productId: number;
//   name: string;
//   count: number;
// }

// const DynamicChart: React.FC = () => {
//   const [chartData, setChartData] = useState({
//     labels: [] as string[],
//     datasets: [
//       {
//         label: 'Ventas por Producto',
//         data: [] as number[],
//         fill: true,
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         tension: 0.4,
//       },
//     ],
//   });

//   useEffect(() => {
//     // Configurar la conexión de SignalR
//     // const connection = new signalR.HubConnectionBuilder()
//     //   .withUrl('http://26.14.66.242:7062/eventHub') // Cambia la URL por la de tu servidor SignalR
//     //   .withAutomaticReconnect()
//     //   .build();

//     // connection.start()
//     //   .then(() => console.log('Conectado a SignalR'))
//     //   .catch((error) => console.error('Error al conectar con SignalR:', error));
//     const connection = new signalR.HubConnectionBuilder()
//     .withUrl("https://localhost:7062/eventHub", {
//         skipNegotiation: true,
//         transport: signalR.HttpTransportType.WebSockets
//     })
//     .withAutomaticReconnect()
//     .build();

// connection.start()
//   .then(() => console.log('Conectado a SignalR'))
//   .catch((error) => console.error('Error al conectar con SignalR:', error));


//     // Recibir datos de SignalR y actualizar la gráfica
//     connection.on('ReceiveProductSales', (data: ProductSales[]) => {
//       console.log('Datos recibidos de SignalR:', data);

//       const sortedProducts = data.sort((a, b) => a.productId - b.productId);
//       const labels = sortedProducts.map((product) => product.name);
//       const dataCounts = sortedProducts.map((product) => product.count);

//       setChartData({
//         labels,
//         datasets: [
//           {
//             label: 'Ventas por Producto',
//             data: dataCounts,
//             fill: true,
//             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//             borderColor: 'rgba(75, 192, 192, 1)',
//             tension: 0.4,
//           },
//         ],
//       });
//     });

//     // Limpiar la conexión al desmontar el componente
//     return () => {
//       connection.stop().then(() => console.log('Conexión de SignalR cerrada'));
//     };
//   }, []);

//   const options: ChartOptions<'line'> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           font: {
//             size: 14,
//             weight: 'bold',
//           },
//           color: '#333',
//         },
//       },
//       title: {
//         display: true,
//         text: 'Ventas por Producto',
//         font: {
//           size: 20,
//           weight: 'bold',
//         },
//         color: '#333',
//         padding: {
//           top: 10,
//           bottom: 30,
//         },
//       },
//     },
//     interaction: {
//       mode: 'index',
//       intersect: false,
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           font: {
//             size: 12,
//           },
//           color: '#666',
//         },
//       },
//       y: {
//         grid: {
//           color: 'rgba(200, 200, 200, 0.2)',
//         },
//         ticks: {
//           font: {
//             size: 12,
//           },
//           color: '#666',
//         },
//       },
//     },
//   };

//   return (
//     <div
//       style={{
//         width: '50vw',
//         height: '50vh',
//         padding: '20px',
//         boxSizing: 'border-box',
//         backgroundColor: '#f8f9fa',
//         borderRadius: '10px',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         margin: '0 auto',
//       }}
//     >
//       <h1
//         style={{
//           textAlign: 'center',
//           color: '#333',
//           marginBottom: '20px',
//           fontSize: '24px',
//           fontWeight: 'bold',
//         }}
//       >
//         Ventas por Producto
//       </h1>
//       <div style={{ width: '100%', height: '100%', position: 'relative' }}>
//         <Line data={chartData} options={options} />
//       </div>
//     </div>
//   );
// };

// export default DynamicChart;

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import * as signalR from '@microsoft/signalr';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProductSales {
  productId: number;
  name: string;
  count: number;
}

const DynamicChart: React.FC = () => {
  const [salesData, setSalesData] = useState<Record<number, ProductSales>>({});
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Ventas por Producto',
        data: [] as number[],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    // Configurar la conexión de SignalR
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7062/eventHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log('Conectado a SignalR'))
      .catch((error) => console.error('Error al conectar con SignalR:', error));

    // Recibir datos de SignalR y actualizar la gráfica
    connection.on('ReceiveProductSales', (data: ProductSales[]) => {
      console.log('Datos recibidos de SignalR:', data);

      // Actualizar el conteo de ventas acumulado por producto
      const updatedSalesData = { ...salesData };
      data.forEach((item) => {
        if (updatedSalesData[item.productId]) {
          updatedSalesData[item.productId].count += item.count;
        } else {
          updatedSalesData[item.productId] = {
            productId: item.productId,
            name: item.name,
            count: item.count,
          };
        }
      });

      // Ordenar los productos por productId para mantener un orden constante en la gráfica
      const sortedProducts = Object.values(updatedSalesData).sort((a, b) => a.productId - b.productId);

      // Crear los datos de la gráfica
      const labels = sortedProducts.map((product) => product.name);
      const dataCounts = sortedProducts.map((product) => product.count);

      setSalesData(updatedSalesData);
      setChartData({
        labels,
        datasets: [
          {
            label: 'Ventas por Producto',
            data: dataCounts,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.4,
          },
        ],
      });
    });

    // Limpiar la conexión al desmontar el componente
    return () => {
      connection.stop().then(() => console.log('Conexión de SignalR cerrada'));
    };
  }, [salesData]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Ventas por Producto',
        font: {
          size: 20,
          weight: 'bold',
        },
        color: '#333',
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
        },
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
        },
      },
    },
  };

  return (
    <div
      style={{
        width: '50vw',
        height: '50vh',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        Ventas por Producto
      </h1>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DynamicChart;
