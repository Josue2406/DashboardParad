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

export const useResumenVentas = () => {
  // Inicialización desde localStorage o con valores por defecto
  const [ventasMensuales, setVentasMensuales] = useState<number[]>(() => {
    const storedData = localStorage.getItem("ventasMensuales");
    return storedData ? JSON.parse(storedData) : Array(12).fill(0);
  });

  useEffect(() => {
    // Función para obtener eventos antiguos del backend
    const fetchOldEvents = async () => {
      try {
        const response = await axios.get<EventData[]>("https://localhost:7062/api/events/old");
        const oldEvents = response.data;

        console.log("Eventos antiguos recibidos del backend:", oldEvents); // Log para verificar datos

        // Procesar cada evento y actualizar el estado
        oldEvents.forEach((event) => actualizarDatos(event));
      } catch (error) {
        console.error("Error al cargar eventos antiguos:", error);
      }
    };

    fetchOldEvents();

    // Configuración de conexión con SignalR para eventos en tiempo real
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
            actualizarDatos(parsedData);
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

  // Función para actualizar los datos de ventas mensuales
  const actualizarDatos = (eventData: EventData) => {
    const { Products, Date: eventDate } = eventData;
    const mes = new Date(eventDate).getMonth();
    const montoTotal = Products.reduce((total, product) => total + (product.Price || 0), 0);

    setVentasMensuales((prev) => {
      const actualizadas = [...prev];
      actualizadas[mes] = (actualizadas[mes] || 0) + montoTotal;

      // Guardar las ventas actualizadas en localStorage
      localStorage.setItem("ventasMensuales", JSON.stringify(actualizadas));

      console.log("Ventas actualizadas:", actualizadas); // Log para verificar datos
      return actualizadas;
    });
  };

  // Calcular total de ventas y nombres de meses
  const totalVentas = ventasMensuales.reduce((total, ventas) => total + ventas, 0);
  const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const mesActual = new Date().getMonth();
  const mesesRango = [(mesActual - 2 + 12) % 12, (mesActual - 1 + 12) % 12, mesActual].sort((a, b) => a - b);

  const ventasMesesActuales = mesesRango.reduce((total, mes) => total + (ventasMensuales[mes] || 0), 0);
  const mesesTexto = mesesRango.map((mes) => nombresMeses[mes]).join(", ");

  return { ventasMensuales, totalVentas, ventasMesesActuales, mesesTexto };
};
