import React from "react";
import { VULN_STATUS, EQUIPMENT_STATUS, VULN_SEVERITY } from "../data/constants.js";

const STATUS_STYLES = {
  [VULN_STATUS.NEW]: "bg-red-100 text-red-700 border border-red-200",
  [VULN_STATUS.ACTIVE]: "bg-orange-100 text-orange-800 border border-orange-200",
  [VULN_STATUS.RESURFACED]: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  [VULN_STATUS.FIXED]: "bg-green-100 text-green-700 border border-green-200",
  [EQUIPMENT_STATUS.OPERATIONAL]: "bg-green-100 text-green-700",
  [VULN_SEVERITY.CRITICAL]: "bg-red-100 text-red-800 font-bold",
  [VULN_SEVERITY.HIGH]: "bg-orange-100 text-orange-800",
  [VULN_SEVERITY.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [VULN_SEVERITY.LOW]: "bg-green-100 text-green-800",
};

export const StatusBadge = ({ status }) => {
  const normalizedStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
        STATUS_STYLES[normalizedStatus] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};
