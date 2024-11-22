
import * as signalR from "@microsoft/signalr";
import React, { useEffect, useState } from "react";
// Interfaz genérica para eventos
interface ViewerEvent {
  [key: string]: any; // Acepta cualquier estructura JSON
}

const EventViewer: React.FC = () => {
  const [events, setEvents] = useState<ViewerEvent[]>([]);
  const [connectionState, setConnectionState] = useState<string>("Conectando...");

  useEffect(() => {
    // Configurar la conexión SignalR
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7062/eventHub") // URL del Hub SignalR
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Manejar el estado de conexión
    connection.onreconnecting(() => setConnectionState("Reconectando..."));
    connection.onreconnected(() => setConnectionState("Conexión restablecida"));
    connection.onclose(() => setConnectionState("Conexión cerrada"));

    // Iniciar la conexión
    connection
      .start()
      .then(() => {
        console.log("Conexión establecida");
        setConnectionState("Conexión establecida");

        // Solicitar eventos antiguos
        connection.invoke("RequestOldEvents").catch((err) =>
          console.error("Error al solicitar eventos antiguos:", err)
        );
      })
      .catch((err) => {
        console.error("Error al conectar", err);
        setConnectionState("Error al conectar");
      });

    // Escuchar eventos antiguos y nuevos
    connection.on("ReceiveEvent", (receivedEvents: string[]) => {
      console.log("Eventos recibidos:", receivedEvents);
      // Parsear los eventos recibidos como JSON
      const parsedEvents = receivedEvents.map((event) => JSON.parse(event));
      setEvents((prev) => [...prev, ...parsedEvents]);
    });

    // Limpieza al desmontar
    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Gestión de Eventos</h1>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <strong>Estado de la conexión:</strong> {connectionState}
      </div>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {events.length === 0 ? (
          <p style={{ textAlign: "center" }}>No hay eventos disponibles.</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {events.map((event, index) => (
              <li
                key={index}
                style={{
                  padding: "15px",
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <span>
                  <strong>Evento:</strong> {event.Message || "Sin mensaje"}
                </span>
                <span>
                  <strong>Fecha:</strong> {new Date(event.Date || Date.now()).toLocaleString()}
                </span>
                {event.Products && event.Products.length > 0 && (
                  <div>
                    <strong>Productos:</strong>
                    <ul>
                      {event.Products.map((product: any, idx: number) => (
                        <li key={idx}>
                          {product.Name} - ${product.Price?.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventViewer;
