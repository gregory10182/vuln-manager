import React from "react";

export const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-green-100 text-green-700",
    Maintenance: "bg-yellow-100 text-yellow-700",
    Retired: "bg-gray-100 text-gray-700",
    Open: "bg-red-100 text-red-700",
    Patched: "bg-blue-100 text-blue-700",
    Critical: "bg-red-100 text-red-800 font-bold",
    High: "bg-orange-100 text-orange-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};
