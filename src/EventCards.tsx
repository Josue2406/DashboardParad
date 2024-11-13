// import React, { useEffect, useState } from 'react';
// import * as signalR from '@microsoft/signalr';
// import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';

// type EventData = {
//     data: string;
//     isNew: boolean;
// };

// const EventCards = () => {
//     const [events, setEvents] = useState<EventData[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const connection = new signalR.HubConnectionBuilder()
//         .withUrl("https://localhost:7062/eventHub", {
//             skipNegotiation: true,
//             transport: signalR.HttpTransportType.WebSockets
//         })
//         .withAutomaticReconnect()
//         .build();
    
    

//         connection.start()
//             .then(() => {
//                 console.log("Conectado a SignalR");
//                 setLoading(false);

//                 // Recibir eventos a través de SignalR
//                 connection.on("ReceiveEvent", (eventData: EventData | EventData[]) => {
//                     const newEvents = Array.isArray(eventData) ? eventData : [eventData];
//                     setEvents((prevEvents) => [...newEvents, ...prevEvents]);
//                 });
//             })
//             .catch((error) => console.error("Error al conectar con SignalR:", error));

//         // Limpiar la conexión al desmontar el componente
//         return () => {
//             connection.stop();
//         };
//     }, []);

//     return (
//         <div>
//             {loading ? (
//                 <CircularProgress />
//             ) : (
//                 <Grid container spacing={2}>
//                     {events.map((event, index) => (
//                         <Grid item xs={12} sm={6} md={4} key={index}>
//                             <Card variant="outlined">
//                                 <CardContent>
//                                     <Typography variant="h6" component="div">
//                                         {event.isNew ? "Nuevo Evento" : "Evento Antiguo"}
//                                     </Typography>
//                                     <Typography variant="body2" color="text.secondary">
//                                         {event.data}
//                                     </Typography>
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     ))}
//                 </Grid>
//             )}
//         </div>
//     );
// };

// export default EventCards;

import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';

type EventData = {
    data: string;
    isNew: boolean;
};

const EventCards = () => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar los eventos antiguos desde la API
        const fetchOldEvents = async () => {
            try {
                const response = await fetch("https://localhost:7062/api/events/old", {
                    headers: {
                        'Authorization': 'Bearer YOUR_ACCESS_TOKEN_HERE'
                    }
                });
                const oldEvents: EventData[] = await response.json();
                setEvents(oldEvents);
            } catch (error) {
                console.error("Error al cargar eventos antiguos:", error);
            } finally {
                setLoading(false);
            }
        };
        

        fetchOldEvents();

        // Configurar la conexión de SignalR para los eventos nuevos
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7062/eventHub", {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log("Conectado a SignalR");

                // Recibir eventos nuevos a través de SignalR
                connection.on("ReceiveEvent", (eventData: EventData) => {
                    if (eventData.isNew) {
                        setEvents((prevEvents) => [eventData, ...prevEvents]);
                        console.log("Nuevo evento recibido:", eventData);
                    }
                });
            })
            .catch((error) => console.error("Error al conectar con SignalR:", error));

        // Limpiar la conexión al desmontar el componente
        return () => {
            connection.stop();
        };
    }, []);

    return (
        <div>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {events.map((event, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {event.isNew ? "Nuevo Evento" : "Evento Antiguo"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {event.data}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default EventCards;
