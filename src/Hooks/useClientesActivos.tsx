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

interface ClienteActivo {
  customerId: number;
  totalCompras: number;
}

export const useClientesActivos = () => {
  // Estado inicializado desde localStorage
  const [clientesActivos, setClientesActivos] = useState<ClienteActivo[]>(() => {
    const storedData = localStorage.getItem("clientesActivos");
    return storedData ? JSON.parse(storedData) : [];
  });

  useEffect(() => {
    // Función para cargar eventos antiguos
    const fetchOldEvents = async () => {
      try {
        const response = await axios.get<EventData[]>("https://localhost:7062/api/events/old");
        const oldEvents = response.data;

        console.log("Datos históricos recibidos:", oldEvents); // Log para depuración

        const clientes = procesarClientes(oldEvents);
        setClientesActivos(clientes);

        // Guardar datos en localStorage
        localStorage.setItem("clientesActivos", JSON.stringify(clientes));
      } catch (error) {
        console.error("Error al cargar eventos antiguos:", error);
      }
    };

    fetchOldEvents();

    // Configuración de SignalR
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
            console.log("Evento recibido:", parsedData); // Log para depuración
            actualizarClientes(parsedData);
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

  // Procesar clientes desde eventos
  const procesarClientes = (eventos: EventData[]): ClienteActivo[] => {
    const clientes: { [key: number]: number } = {};

    eventos.forEach((event) => {
      const totalCompra = event.Products.reduce((total, product) => total + (product.Price || 0), 0);
      clientes[event.CustomerId] = (clientes[event.CustomerId] || 0) + totalCompra;
    });

    return convertirClientesArray(clientes);
  };

  // Actualizar clientes activos en tiempo real
  const actualizarClientes = (eventData: EventData) => {
    setClientesActivos((prevClientes) => {
      const clientesMap = prevClientes.reduce<{ [key: number]: number }>((map, cliente) => {
        map[cliente.customerId] = cliente.totalCompras;
        return map;
      }, {});

      const totalCompra = eventData.Products.reduce((total, product) => total + (product.Price || 0), 0);
      clientesMap[eventData.CustomerId] = (clientesMap[eventData.CustomerId] || 0) + totalCompra;

      const actualizados = convertirClientesArray(clientesMap);

      // Guardar cambios en localStorage
      localStorage.setItem("clientesActivos", JSON.stringify(actualizados));
      return actualizados;
    });
  };

  // Convertir mapa de clientes a array ordenado
  const convertirClientesArray = (clientesMap: { [key: number]: number }): ClienteActivo[] => {
    return Object.entries(clientesMap)
      .map(([customerId, totalCompras]) => ({
        customerId: Number(customerId),
        totalCompras,
      }))
      .sort((a, b) => b.totalCompras - a.totalCompras); // Ordenar de mayor a menor totalCompras
  };

  const totalClientes = clientesActivos.length;

  return { clientesActivos, totalClientes };
};
