import { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

const fmtDate = (iso) => {
  if (!iso) return "N/A";
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${d}-${m}-${y}`;
};

const fmtDateTime = (iso) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleString("es-CL");
};

export const Historial = ({ historial, loading, isAnalyst }) => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">
          Historial de Acciones
        </h2>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Cargando historial...</p>
        </div>
      ) : historial.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Clock size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">Sin acciones registradas.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Fecha</th>
                {!isAnalyst && <th className="px-6 py-3">Analista</th>}
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Máquinas</th>
                <th className="px-6 py-3">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historial.map((h) => (
                <>
                  <tr
                    key={h.id}
                    onClick={() =>
                      setExpanded(expanded === h.id ? null : h.id)
                    }
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-600">
                      {fmtDateTime(h.createdAt)}
                    </td>
                    {!isAnalyst && (
                      <td className="px-6 py-3 text-gray-700">{h.analista}</td>
                    )}
                    <td className="px-6 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          h.tipo === "parchado"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {h.tipo === "parchado"
                          ? "Parchado"
                          : "Reporte Error"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{h.producto}</td>
                    <td className="px-6 py-3 text-gray-600">
                      <span className="flex items-center gap-1">
                        {h.cantidad} equipos
                        {expanded === h.id ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {h.tipo === "parchado"
                        ? h.fechaParchado
                          ? fmtDate(h.fechaParchado)
                          : "Hoy"
                        : h.errorDescripcion
                        ? h.errorDescripcion.length > 40
                          ? h.errorDescripcion.substring(0, 40) + "..."
                          : h.errorDescripcion
                        : "--"}
                    </td>
                  </tr>
                  {expanded === h.id && (
                    <tr key={`${h.id}-expanded`} className="bg-gray-50">
                      <td
                        colSpan={isAnalyst ? 5 : 6}
                        className="px-6 py-3"
                      >
                        <div className="text-sm">
                          <p className="font-medium text-gray-700 mb-2">
                            Máquinas afectadas:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {h.maquinas.map((m, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono text-gray-600"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                          {h.tipo === "reporte_error" && h.errorDescripcion && (
                            <div className="mt-3">
                              <p className="font-medium text-gray-700 mb-1">
                                Descripción:
                              </p>
                              <p className="text-gray-600 bg-white p-2 rounded border border-gray-200">
                                {h.errorDescripcion}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
