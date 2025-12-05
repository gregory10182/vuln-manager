import React from "react";

import { Laptop, Search, ChevronRight, Filter, X } from "lucide-react";

import { RiskMeter } from "../components/RiskMeter.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";

export const Inventory = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  filteredAssets,
  setTimedNotification,
  isAnalyst,
  resetFilters,
  analystsList,
  setSelectedAsset,
}) => {
  console.log("Filtered Assets:", filteredAssets);
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar usuario, IP..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Toolbar Actions */}
        <div className="flex gap-2 relative flex-wrap">
          <button
            onClick={() => {
              const assetNames = filteredAssets.map((a) => a.name).join("\n");
              navigator.clipboard.writeText(assetNames);
              setTimedNotification({
                message: "Lista de workstations copiada.",
                type: "success",
              });
            }}
            className="flex-1 sm:flex-none justify-center px-3 py-2 border rounded-lg text-sm flex items-center gap-2 transition-colors bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Copiar Equipos
          </button>

          <button
            onClick={() => {
              const assetIPs = filteredAssets.map((a) => a.ip).join("\n");
              navigator.clipboard.writeText(assetIPs);
              setTimedNotification({
                message: "Lista de IPs copiada.",
                type: "success",
              });
            }}
            className="flex-1 sm:flex-none justify-center px-3 py-2 border rounded-lg text-sm flex items-center gap-2 transition-colors bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Copiar IPs
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 sm:flex-none justify-center px-3 py-2 border rounded-lg text-sm flex items-center gap-2 transition-colors ${
              showFilters ||
              filters.analyst !== "Todos" ||
              filters.vulnName !== "" ||
              filters.minRisk > 0
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter size={16} />
            Filtros
          </button>

          {showFilters && (
            <div className="absolute right-0 top-12 w-full sm:w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {!isAnalyst && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Analista
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      value={filters.analyst}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          analyst: e.target.value,
                        })
                      }
                    >
                      <option value="Todos">Todos</option>
                      {analystsList.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Software
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej: Chrome"
                    value={filters.vulnName}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        vulnName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 flex justify-between">
                    <span>Riesgo Mínimo</span>
                    <span className="text-blue-600">{filters.minRisk}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={filters.minRisk}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minRisk: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="pt-2 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-50 border border-gray-300 rounded-lg"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Listo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Workstation</th>
              {!isAnalyst && <th className="px-6 py-3">Analista</th>}
              <th className="px-6 py-3">Usuario</th>
              <th className="px-6 py-3">IP</th>
              <th className="px-6 py-3">Riesgo</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="hover:bg-blue-50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <Laptop size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {asset.name}
                        </div>
                        <div className="text-xs text-gray-500">{asset.os}</div>
                      </div>
                    </div>
                  </td>
                  {!isAnalyst && (
                    <td className="px-6 py-4 text-gray-700">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                        {asset.analyst}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 text-gray-600">{asset.user}</td>
                  <td className="px-6 py-4 font-mono text-gray-500">
                    {asset.ip}
                  </td>
                  <td className="px-6 py-4">
                    <RiskMeter score={asset.riskScore} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight
                      className="inline-block text-gray-300 group-hover:text-blue-500"
                      size={20}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search size={48} className="text-gray-200 mb-4" />
                    <p>No se encontraron resultados.</p>
                    <button
                      onClick={resetFilters}
                      className="text-blue-600 text-sm mt-2 hover:underline"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
