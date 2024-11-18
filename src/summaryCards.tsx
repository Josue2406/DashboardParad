import React, { useState } from "react";
import { useResumenVentas } from "./Hooks/useResumenVentas";
import { useClientesActivos } from "./Hooks/useClientesActivos";
import { useVentasPorDia } from "./Hooks/useVentasPorDia";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

const SummaryCards = () => {
  const { ventasMesesActuales, mesesTexto } = useResumenVentas();
  const { totalClientes } = useClientesActivos();
  const { ventasPorDia } = useVentasPorDia();

  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const fechaSeleccionada = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;
  const ventasDelDia = fechaSeleccionada && ventasPorDia[fechaSeleccionada] ? ventasPorDia[fechaSeleccionada] : 0;

  const cards = [
    {
      title: `Ventas (${mesesTexto})`,
      value: `${ventasMesesActuales.toLocaleString("es-ES")}`,
      change: "",
    },
    {
      title: "Ventas Por día",
      value: `${ventasDelDia.toLocaleString("es-ES")}`,
      change: (
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
      ),
    },
    {
      title: "Clientes Activos",
      value: `${totalClientes}`,
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
