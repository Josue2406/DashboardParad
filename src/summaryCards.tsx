// import React, { useState } from "react";
// import { useResumenVentas } from "./Hooks/useResumenVentas";
// import { useClientesActivos } from "./Hooks/useClientesActivos";
// import { useVentasPorDia } from "./Hooks/useVentasPorDia";
// import { TextField } from "@mui/material";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs, { Dayjs } from "dayjs";

// const SummaryCards = () => {
//   const { ventasMesesActuales, mesesTexto } = useResumenVentas();
//   const { totalClientes } = useClientesActivos();
//   const { ventasPorDia } = useVentasPorDia();

//   // Estado para la fecha seleccionada
//   const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
//   const fechaSeleccionada = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;
//   const ventasDelDia = fechaSeleccionada && ventasPorDia[fechaSeleccionada] ? ventasPorDia[fechaSeleccionada] : 0;

//   const cards = [
//     {
//       title: `Ventas (${mesesTexto})`,
//       value: `${ventasMesesActuales.toLocaleString("es-ES")}`,
//       change: "",
//     },
//     {
//       title: "Ventas Por día",
//       value: `${ventasDelDia.toLocaleString("es-ES")}`,
//       change: (
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <DatePicker
//             label="Selecciona una fecha"
//             value={selectedDate}
//             onChange={(newDate) => setSelectedDate(newDate)}
//             slotProps={{
//               textField: { fullWidth: true, size: "small" },
//             }}
//           />
//         </LocalizationProvider>
//       ),
//     },
//     {
//       title: "Clientes Activos",
//       value: `${totalClientes}`,
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

import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import * as signalR from "@microsoft/signalr";

const SummaryCards = () => {
  // Estado para almacenar los datos de SignalR
  const [ventasPorMes, setVentasPorMes] = useState(0); // Total de ventas del mes actual
  const [ventasPorDia, setVentasPorDia] = useState<{ [key: string]: number }>({}); // Ventas agrupadas por día
  const [clientesActivos, setClientesActivos] = useState(0); // Total de clientes activos

  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const fechaSeleccionada = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;
  const ventasDelDia = fechaSeleccionada && ventasPorDia[fechaSeleccionada] ? ventasPorDia[fechaSeleccionada] : 0;

  // Conexión a SignalR
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
          console.log("Estadísticas recibidas:", statistics);
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

  // Actualizar el estado con las estadísticas recibidas
  const actualizarDatosResumen = (statistics: any) => {
    if (!statistics || !statistics.purchasesByMonth) return;

    const ventasPorMesActual = calcularVentasMesActual(statistics.purchasesByMonth);
    const ventasPorDiaAgrupadas = calcularVentasPorDia(statistics.purchasesByMonth);
    const totalClientesActivos = calcularClientesActivos(statistics.purchasesByMonth);

    setVentasPorMes(ventasPorMesActual);
    setVentasPorDia(ventasPorDiaAgrupadas);
    setClientesActivos(totalClientesActivos);
  };

  // Función para calcular las ventas del mes actual
  const calcularVentasMesActual = (purchasesByMonth: any[]) => {
    const mesActual = dayjs().format("YYYY-MM");
    const mesActualData = purchasesByMonth.find((mes: any) => mes.month === mesActual);
    return mesActualData ? mesActualData.totalAmount : 0;
  };

  // Función para agrupar las ventas por día
  const calcularVentasPorDia = (purchasesByMonth: any[]) => {
    const ventasPorDia: { [key: string]: number } = {};

    purchasesByMonth.forEach((mes: any) => {
      mes.products.forEach((producto: any) => {
        const fecha = dayjs(mes.month).format("YYYY-MM-DD");
        ventasPorDia[fecha] = (ventasPorDia[fecha] || 0) + producto.price;
      });
    });

    return ventasPorDia;
  };

  // Función para calcular el total de clientes activos
  const calcularClientesActivos = (purchasesByMonth: any[]) => {
    const clientesUnicos = new Set<string>();

    purchasesByMonth.forEach((mes: any) => {
      mes.products.forEach((producto: any) => {
        clientesUnicos.add(producto.customerId);
      });
    });

    return clientesUnicos.size;
  };

  // Definición de las tarjetas de resumen
  const cards = [
    {
      title: `Ventas (Mes Actual)`,
      value: `${ventasPorMes.toLocaleString("es-ES")}`,
      change: "",
    },
    // {
    //   title: "Ventas Por día",
    //   value: `${ventasDelDia.toLocaleString("es-ES")}`,
    //   change: (
    //     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //       <DatePicker
    //         label="Selecciona una fecha"
    //         value={selectedDate}
    //         onChange={(newDate) => setSelectedDate(newDate)}
    //         slotProps={{
    //           textField: { fullWidth: true, size: "small" },
    //         }}
    //       />
    //     </LocalizationProvider>
    //   ),
    // },
    {
      title: "Clientes Activos",
      value: `${clientesActivos}`,
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
