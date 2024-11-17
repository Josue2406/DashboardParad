import React, { useState } from "react";
import { useVentasPorDia } from "./Hooks/useVentasPorDia";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

const VentasPorDia = () => {
  const { ventasPorDia } = useVentasPorDia();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  // Formatear la fecha seleccionada
  const fechaSeleccionada = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;

  // Obtener ventas del día seleccionado
  const ventasDelDia = fechaSeleccionada && ventasPorDia[fechaSeleccionada] 
    ? ventasPorDia[fechaSeleccionada] 
    : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-gray-500 text-sm font-medium mb-4">Ventas por Día</h3>
      
      {/* Selector de fecha */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Selecciona una fecha"
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          slotProps={{
            textField: { fullWidth: true, size: "small" },
          }}
        />
      </LocalizationProvider>

      {/* Mostrar resultados */}
      {ventasDelDia !== null ? (
        <p className="text-2xl font-bold mt-4">
          Ventas: ${ventasDelDia.toLocaleString("es-ES")}
        </p>
      ) : (
        <p className="text-gray-500 mt-4">No hay datos disponibles para esta fecha.</p>
      )}
    </div>
  );
};

export default VentasPorDia;
