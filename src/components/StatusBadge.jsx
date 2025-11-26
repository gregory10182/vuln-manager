import React from "react";

export const StatusBadge = ({ status }) => {
  const styles = {
    // Estados de vulnerabilidad
    New: "bg-red-100 text-red-700 border border-red-200",
    Active: "bg-orange-100 text-orange-800 border border-orange-200",
    Resurfaced: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    Fixed: "bg-green-100 text-green-700 border border-green-200",

    // Estados de equipo
    Operational: "bg-green-100 text-green-700", // Renombrado para evitar conflicto

    // Severidad
    Critical: "bg-red-100 text-red-800 font-bold",
    High: "bg-orange-100 text-orange-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };

  // Normalizar el estado para matchear keys (Capitalize)
  const normalizedStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[normalizedStatus] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};
