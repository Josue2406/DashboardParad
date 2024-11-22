import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface ProductSales {
  productId: number;
  name: string;
  count: number;
}

const SignalRDataDisplay: React.FC = () => {
  const [productSales, setProductSales] = useState<ProductSales[]>([]);

  useEffect(() => {
    // const connection = new signalR.HubConnectionBuilder()
    //   .withUrl('https://26.14.66.242:7062/eventHub') // Cambia a http si el servidor no tiene SSL
    //   .withAutomaticReconnect()
    //   .build();

    // connection.start()
    //   .then(() => console.log('Conectado a SignalR'))
    //   .catch((error) => console.error('Error al conectar con SignalR:', error));

//     const connection = new signalR.HubConnectionBuilder()
//     .withUrl('http://localhost:7062/eventHub', {
//       accessTokenFactory: () => {
//         // Devuelve el token de acceso aquí (reemplaza 'your_token' con el token real)
//         return "your_token";
//       },
//       transport: signalR.HttpTransportType.WebSockets
//     })
//     .withAutomaticReconnect()
//     .build();
  
//   connection.start()
//     .then(() => console.log('Conectado a SignalR'))
//     .catch((error) => console.error('Error al conectar con SignalR:', error));
//     // Escuchar el evento 'ReceiveProductSales' de SignalR
//     connection.on('ReceiveProductSales', (data: ProductSales[]) => {
//       console.log('Datos recibidos de SignalR:', data);
//       setProductSales(data); // Actualizar el estado con los datos recibidos
//     });

const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:7062/eventHub') // Usa la URL completa del hub
  .withAutomaticReconnect()
  .build();

connection.start()
  .then(() => console.log('Conectado a SignalR'))
  .catch(error => console.error('Error al conectar con SignalR:', error));

// connection.on('ReceiveEvent', (data) => {
//   console.log('Datos recibidos de SignalR:', data);
//   // Aquí puedes actualizar el estado de React o procesar los datos como necesites

connection.onclose(error => {
    console.error('Conexión cerrada. Intentando reconectar...', error);
    setTimeout(() => connection.start().catch(console.error), 5000);
  
});

    // Limpiar la conexión al desmontar el componente
    return () => {
      connection.stop().then(() => console.log('Conexión de SignalR cerrada'));
    };
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f1f1f1', borderRadius: '8px', marginTop: '20px' }}>
      <h2>Datos de Ventas Recibidos</h2>
      <ul>
        {productSales.map((product) => (
          <li key={product.productId}>
            Producto: {product.name} - Ventas: {product.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SignalRDataDisplay;