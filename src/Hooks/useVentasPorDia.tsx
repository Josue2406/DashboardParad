import { useEffect, useState } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

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

export const useVentasPorDia = () => {
  // Estado inicial con persistencia desde localStorage
  const [ventasPorDia, setVentasPorDia] = useState<{ [fecha: string]: number }>(() => {
    const storedData = localStorage.getItem("ventasPorDia");
    return storedData ? JSON.parse(storedData) : {};
  });

  useEffect(() => {
    // Cargar eventos históricos desde la API
    const fetchOldEvents = async () => {
      try {
        const response = await axios.get<EventData[]>("https://localhost:7062/api/events/old");
        const oldEvents = response.data;

        console.log("Datos históricos recibidos:", oldEvents); // Depuración

        const ventasActualizadas = procesarVentasPorDia(oldEvents);
        setVentasPorDia(ventasActualizadas);

        // Guardar datos procesados en localStorage
        localStorage.setItem("ventasPorDia", JSON.stringify(ventasActualizadas));
      } catch (error) {
        console.error("Error al cargar eventos antiguos:", error);
      }
    };

    fetchOldEvents();

    // Configurar conexión con SignalR
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
        console.log("Conexión SignalR establecida.");

        connection.on("ReceiveEvent", (eventData: { data: string; isNew: boolean }) => {
          try {
            const parsedData: EventData = JSON.parse(eventData.data);
            console.log("Evento recibido:", parsedData); // Depuración
            actualizarVentasPorDia(parsedData);
          } catch (error) {
            console.error("Error al procesar evento de SignalR:", error);
          }
        });
      })
      .catch((error) => console.error("Error al conectar con SignalR:", error));

    // Limpiar conexión al desmontar
    return () => {
      connection.stop().then(() => console.log("Conexión SignalR cerrada."));
    };
  }, []);

  // Función para procesar ventas históricas agrupadas por día
  const procesarVentasPorDia = (eventos: EventData[]): { [fecha: string]: number } => {
    const ventasAgrupadas: { [fecha: string]: number } = {};

    eventos.forEach((event) => {
      const fecha = new Date(event.Date).toISOString().split("T")[0]; // Formato: YYYY-MM-DD
      const montoTotal = event.Products.reduce((total, product) => total + product.Price, 0);

      ventasAgrupadas[fecha] = (ventasAgrupadas[fecha] || 0) + montoTotal;
    });

    return ventasAgrupadas;
  };

  // Función para actualizar ventas por día en tiempo real
  const actualizarVentasPorDia = (eventData: EventData) => {
    setVentasPorDia((prevVentasPorDia) => {
      const fecha = new Date(eventData.Date).toISOString().split("T")[0]; // Formato: YYYY-MM-DD
      const montoTotal = eventData.Products.reduce((total, product) => total + product.Price, 0);

      const ventasActualizadas = {
        ...prevVentasPorDia,
        [fecha]: (prevVentasPorDia[fecha] || 0) + montoTotal,
      };

      // Guardar en localStorage
      localStorage.setItem("ventasPorDia", JSON.stringify(ventasActualizadas));

      return ventasActualizadas;
    });
  };

  return { ventasPorDia };
};
