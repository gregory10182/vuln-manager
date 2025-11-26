import React from "react";

import { Monitor, AppWindow, AlertTriangle, Upload } from "lucide-react";

export const Dashboard = ({ stats, fileInputRef, handleFileUpload }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Assets */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-gray-500 text-sm font-medium">
            Total Asignado
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-gray-900">
              {stats.totalAssets}
            </span>
            <Monitor className="text-blue-500 opacity-20" size={32} />
          </div>
        </div>

        {/* Critical Apps */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <span
            className="text-gray-500 text-sm font-medium"
            title="Vulns en Chrome, Edge, Office, Teams"
          >
            Apps Críticas
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-gray-900">
              {stats.appVulns}
            </span>
            <AppWindow className="text-orange-500 opacity-20" size={32} />
          </div>
        </div>

        {/* Critical Assets */}
        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-red-500 opacity-5 rounded-bl-full"></div>
          <span className="text-red-600 text-sm font-medium">
            Equipos Críticos
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-red-600">
              {stats.criticalAssets}
            </span>
            <AlertTriangle className="text-red-500 opacity-20" size={32} />
          </div>
        </div>

        {/* Avg Risk */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-gray-500 text-sm font-medium">
            Score Promedio
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-gray-900">
              {stats.avgRisk}
            </span>
            <div className="text-xs text-gray-400 mb-1">/ 100 Riesgo</div>
          </div>
          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${stats.avgRisk}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Action: Upload */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-blue-800 font-semibold text-lg">
            Actualizar Inventario
          </h3>
          <p className="text-blue-600 text-sm mt-1">
            Carga un reporte CSV para actualizar el estado de seguridad.
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current.click()}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm font-medium flex items-center justify-center gap-2"
        >
          <Upload size={18} />
          Cargar Reporte
        </button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
