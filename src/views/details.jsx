import React from "react";

import { Laptop, MoreVertical, CheckCircle } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { RiskMeter } from "../components/RiskMeter.jsx";

export const Details = ({ selectedAsset, setSelectedAsset }) => {
  return (
    <div className="animate-fade-in pb-8">
      <button
        onClick={() => setSelectedAsset(null)}
        className="mb-4 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
      >
        ← Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Laptop size={32} />
              </div>
              <div className="text-right">
                <StatusBadge status={selectedAsset.status} />
                <div className="mt-2 text-sm text-gray-400">
                  ID: #{selectedAsset.id}
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1 truncate">
              {selectedAsset.name}
            </h2>
            <p className="text-gray-500 mb-6">{selectedAsset.os}</p>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Analista</span>
                <span className="text-sm text-purple-700 font-medium">
                  {selectedAsset.analyst}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Usuario</span>
                <span className="text-sm text-gray-900 font-medium">
                  {selectedAsset.user}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">IP Address</span>
                <span className="font-mono text-sm text-gray-900">
                  {selectedAsset.ip}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-gray-500 text-sm block mb-2">
                  Nivel de Riesgo
                </span>
                <RiskMeter score={selectedAsset.riskScore} />
              </div>
            </div>
          </div>
          <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2">Acciones</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="bg-blue-700 hover:bg-blue-800 py-2 rounded-lg text-sm font-medium transition-colors">
                Registrar Parche
              </button>
              <button className="bg-white text-blue-700 hover:bg-gray-100 py-2 rounded-lg text-sm font-medium transition-colors">
                Contactar Usuario
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Vulnerabilidades</h3>
              <button className="text-blue-600 text-sm hover:underline">
                + Nota
              </button>
            </div>
            {selectedAsset.vulnerabilities.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-20" />
                <h4 className="text-lg font-medium text-gray-900">
                  Sin Riesgos
                </h4>
                <p className="text-gray-500">Equipo limpio.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {selectedAsset.vulnerabilities?.map((vuln) => {
                  const isOffice =
                    vuln.name.toLowerCase().includes("office") ||
                    vuln.name.toLowerCase().includes("outlook");
                  const isBrowser =
                    vuln.name.toLowerCase().includes("chrome") ||
                    vuln.name.toLowerCase().includes("edge");
                  const isAdobe = vuln.name.toLowerCase().includes("adobe");
                  return (
                    <div
                      key={vuln.id}
                      className={`p-4 hover:bg-gray-50 flex flex-col sm:flex-row gap-4 sm:items-center border-l-4 ${
                        isOffice
                          ? "border-orange-400 bg-orange-50"
                          : isBrowser
                          ? "border-blue-400 bg-blue-50"
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <StatusBadge status={vuln.severity} />
                          <span className="font-mono text-sm text-gray-500 font-medium">
                            {vuln.cve}
                          </span>
                          {isOffice && (
                            <span className="text-[10px] font-bold text-orange-600 bg-white px-2 rounded border border-orange-200">
                              OFFICE
                            </span>
                          )}
                          {isBrowser && (
                            <span className="text-[10px] font-bold text-blue-600 bg-white px-2 rounded border border-blue-200">
                              WEB
                            </span>
                          )}
                          {isAdobe && (
                            <span className="text-[10px] font-bold text-red-600 bg-white px-2 rounded border border-red-200">
                              PDF
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                          {vuln.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Detectado: {vuln.date}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Último Parchado: {vuln.lastPatched || "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <StatusBadge status={vuln.status} />
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
