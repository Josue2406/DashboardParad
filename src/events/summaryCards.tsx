// import React, { useState, useEffect } from "react";
// import * as signalR from "@microsoft/signalr";

// const SummaryCards = () => {
//   // Estados para almacenar las métricas
//   const [totalVentasMesActual, setTotalVentasMesActual] = useState(0); // Ventas del mes actual
//   const [totalVentasGeneral, setTotalVentasGeneral] = useState(0); // Ventas generales
//   const [totalCustomersMesActual, setTotalCustomersMesActual] = useState(0); // Total de clientes únicos del mes actual

//   // Solicitar datos iniciales del backend
//   useEffect(() => {
//     fetch("https://localhost:7062/api/events") // Cambia la URL al endpoint correcto
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Datos iniciales recibidos:", data);
//         actualizarDatosResumen(data);
//       })
//       .catch((error) => console.error("Error al cargar datos iniciales:", error));
//   }, []);

//   // Conexión a SignalR para datos en tiempo real
//   useEffect(() => {
//     const connection = new signalR.HubConnectionBuilder()
//       .withUrl("https://localhost:7062/statisticsHub", {
//         skipNegotiation: true,
//         transport: signalR.HttpTransportType.WebSockets,
//       })
//       .withAutomaticReconnect()
//       .configureLogging(signalR.LogLevel.Information)
//       .build();

//     connection
//       .start()
//       .then(() => {
//         console.log("Conectado a SignalR");

//         // Escuchar eventos de estadísticas en tiempo real
//         connection.on("ReceiveStatistics", (statistics: any) => {
//           console.log("Estadísticas recibidas en tiempo real:", statistics);
//           actualizarDatosResumen(statistics);
//         });
//       })
//       .catch((error) => {
//         console.error("Error al conectar con SignalR:", error);
//       });

//     return () => {
//       connection.stop().catch((error) => console.error("Error al detener la conexión:", error));
//     };
//   }, []);

//   // Actualizar las métricas
//   const actualizarDatosResumen = (statistics: any) => {
//     if (!statistics || !statistics.purchasesByMonth) return;

//     const mesActual = new Date().toISOString().slice(0, 7); // Formato YYYY-MM

//     // Calcula las métricas
//     const totalVentasMesActual = calcularVentasMesActual(statistics.purchasesByMonth, mesActual);
//     const totalVentasGeneral = calcularVentasGenerales(statistics.purchasesByMonth);
//     const totalCustomersMesActual = calcularCustomersMesActual(statistics.purchasesByMonth, mesActual);

//     // Actualiza los estados
//     setTotalVentasMesActual(totalVentasMesActual);
//     setTotalVentasGeneral(totalVentasGeneral);
//     setTotalCustomersMesActual(totalCustomersMesActual);
//   };

//   // Calcular el total de ventas del mes actual
//   const calcularVentasMesActual = (purchasesByMonth: any[], mesActual: string) => {
//     const mesActualData = purchasesByMonth.find((mes: any) => mes.month === mesActual);
//     return mesActualData ? mesActualData.totalAmount : 0;
//   };

//   // Calcular el total de ventas en general
//   const calcularVentasGenerales = (purchasesByMonth: any[]) => {
//     return purchasesByMonth.reduce((total: number, mes: any) => total + mes.totalAmount, 0);
//   };

//   // Calcular el total de clientes únicos del mes actual
//   const calcularCustomersMesActual = (purchasesByMonth: any[], mesActual: string) => {
//     const mesActualData = purchasesByMonth.find((mes: any) => mes.month === mesActual);
//     return mesActualData ? mesActualData.totalCustomers : 0;
//   };

//   // Configuración de las tarjetas
//   const cards = [
//       {
//         title: "Ventas Generales",
//         value: `${totalVentasGeneral.toLocaleString("es-ES")}`,
//         change: "",
//       },
//     {
//       title: "Ventas del Mes Actual",
//       value: `${totalVentasMesActual.toLocaleString("es-ES")}`,
//       change: "",
//     },
//     {
//       title: "Clientes Únicos del Mes Actual",
//       value: `${totalCustomersMesActual}`,
//       change: "",
//     },
//   ];

//   return (
//     <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
//       {cards.map((card, index) => (
//         <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
//           <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
//           <p className="text-2xl font-bold mt-2">{card.value}</p>
//           {card.change && <div className="mt-4">{card.change}</div>}
//         </div>
//       ))}
//     </section>
//   );
// };

// export default SummaryCards;

import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";

const SummaryCards = () => {
  // Estados para almacenar las métricas
  const [totalVentasMesActual, setTotalVentasMesActual] = useState(0); // Ventas del mes actual
  //const [totalVentasGeneral, setTotalVentasGeneral] = useState(0); // Ventas generales
  const [totalCustomersMesActual, setTotalCustomersMesActual] = useState(0); // Clientes únicos del mes actual
  const [totalProductsMesActual, setTotalProductsMesActual] = useState(0); // Productos del mes actual
  const [totalPurchasesMesActual, setTotalPurchasesMesActual] = useState(0); // Compras del mes actual

  // Solicitar datos iniciales del backend
  useEffect(() => {
    fetch("https://localhost:7062/api/events") // Cambia la URL al endpoint correcto
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos iniciales recibidos:", data);
        actualizarDatosResumen(data);
      })
      .catch((error) => console.error("Error al cargar datos iniciales:", error));
  }, []);

  // Conexión a SignalR para datos en tiempo real
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7062/statisticsHub", {
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

        // Escuchar eventos de estadísticas en tiempo real
        connection.on("ReceiveStatistics", (statistics: any) => {
          console.log("Estadísticas recibidas en tiempo real:", statistics);
          actualizarDatosResumen(statistics);
        });
      })
      .catch((error) => {
        console.error("Error al conectar con SignalR:", error);
      });

    return () => {
      connection.stop().catch((error) => console.error("Error al detener la conexión:", error));
    };
  }, []);

  // Actualizar las métricas
  const actualizarDatosResumen = (statistics: any) => {
    if (!statistics || !statistics.purchasesByMonth) return;

    const mesActual = new Date().toISOString().slice(0, 7); // Formato YYYY-MM

    // Calcula las métricas
    const totalVentasMesActual = calcularVentasMesActual(statistics.purchasesByMonth, mesActual);
    //const totalVentasGeneral = calcularVentasGenerales(statistics.purchasesByMonth);
    const totalCustomersMesActual = calcularCustomersMesActual(statistics.purchasesByMonth, mesActual);
    const totalProductsMesActual = calcularProductsMesActual(statistics.purchasesByMonth, mesActual);
    const totalPurchasesMesActual = calcularPurchasesMesActual(statistics.purchasesByMonth, mesActual);

    // Actualiza los estados
    setTotalVentasMesActual(totalVentasMesActual);
    //setTotalVentasGeneral(totalVentasGeneral);
    setTotalCustomersMesActual(totalCustomersMesActual);
    setTotalProductsMesActual(totalProductsMesActual);
    setTotalPurchasesMesActual(totalPurchasesMesActual);
  };

  // Calcular el total de ventas del mes actual
  const calcularVentasMesActual = (purchasesByMonth: any[], mesActual: string) => {
    const mesActualData = purchasesByMonth.find((mes: any) => mes.month === mesActual);
    return mesActualData ? mesActualData.totalAmount : 0;
  };

  // Calcular el total de ventas en general
 /* const calcularVentasGenerales = (purchasesByMonth: any[]) => {
    return purchasesByMonth.reduce((total: number, mes: any) => total + mes.totalAmount, 0);
  };*/

  // Calcular el total de clientes únicos del mes actual
  const calcularCustomersMesActual = (purchasesByMonth: any[], mesActual: string) => {
    const mesActualData = purchasesByMonth.find((mes: any) => mes.month === mesActual);
    return mesActualData ? mesActualData.totalCustomers : 0;
  };

  // Calcular el total de productos del mes actual
  const calcularProductsMesActual = (purchasesByMonth: any[], mesActual: string) => {
    const mesActualData = purchasesByMonth.find((mes: any) => mes.month === mesActual);
    return mesActualData ? mesActualData.totalProducts : 0;
  };

  // Calcular el total de compras del mes actual
  const calcularPurchasesMesActual = (purchasesByMonth: any[], mesActual: string) => {
    const mesActualData = purchasesByMonth.find((mes: any) => mes.month === mesActual);
    return mesActualData ? mesActualData.totalPurchases : 0;
  };

  // Configuración de las tarjetas
  const cards = [
    /*{
      title: "Ventas Generales",
      value: `${totalVentasGeneral.toLocaleString("es-ES")}`,
      change: "",
    },*/
    {
      title: "Ventas del Mes Actual",
      value: `${totalVentasMesActual.toLocaleString("es-ES")}`,
      change: "",
    },
    {
      title: "Clientes Únicos del Mes Actual",
      value: `${totalCustomersMesActual}`,
      change: "",
    },
    {
      title: "Productos comprados del Mes Actual",
      value: `${totalProductsMesActual}`,
      change: "",
    },
    {
      title: "Compras del Mes Actual",
      value: `${totalPurchasesMesActual}`,
      change: "",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
          <p className="text-2xl font-bold mt-2">{card.value}</p>
          {card.change && <div className="mt-4">{card.change}</div>}
        </div>
      ))}
    </section>
  );
};

export default SummaryCards;
