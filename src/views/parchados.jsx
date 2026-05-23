import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import api from "../data/api.js";

export const Parchados = ({ currentUser, activeTab, onComplete }) => {
  const [vulnerabilidades, setVulnerabilidades] = useState([]);
  const [selectedVuln, setSelectedVuln] = useState("");
  const [machineNames, setMachineNames] = useState("");
  const [patchDate, setPatchDate] = useState("");
  const [message, setMessage] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api.getVulnerabilidades(currentUser.id).then((data) => {
      if (cancelled) return;
      const uniqueVulns = [];
      data.forEach((equipo) => {
        equipo.vulnerabilidades.forEach((vuln) => {
          if (!uniqueVulns.find((v) => v === vuln.productName)) {
            uniqueVulns.push(vuln.productName);
          }
        });
      });
      setVulnerabilidades(uniqueVulns);
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const validate = () => {
    if (!selectedVuln) {
      setValidationError("Selecciona una vulnerabilidad.");
      return false;
    }
    const machines = machineNames.trim();
    if (!machines) {
      setValidationError("Ingresa al menos un nombre de máquina.");
      return false;
    }
    if (activeTab === "errores" && !errorDescription.trim()) {
      setValidationError("Describe el error a reportar.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleRequest = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      if (activeTab === "errores") {
        await api.reportarErroresMasivo(
          selectedVuln,
          machineNames.split("\n").filter(Boolean),
          errorDescription,
          currentUser.id
        );
        setMessage("Errores reportados exitosamente.");
      } else {
        await api.parcharVulnerabilidadesMasivo(
          selectedVuln,
          machineNames.split("\n").filter(Boolean),
          patchDate || null,
          currentUser.id
        );
        setMessage("Vulnerabilidades parchadas exitosamente.");
      }
      onComplete?.();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Error desconocido";
      setMessage(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {activeTab === "errores"
          ? "Reportar Errores"
          : "Parchar Vulnerabilidades"}
      </h2>

      {message && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          {message}
        </div>
      )}

      {validationError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {validationError}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Selecciona Vulnerabilidad
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded disabled:opacity-50"
          value={selectedVuln}
          onChange={(e) => setSelectedVuln(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="" disabled>
            -- Selecciona una vulnerabilidad --
          </option>
          {vulnerabilidades?.map((vuln) => (
            <option key={vuln} value={vuln}>
              {vuln}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Nombres de Máquinas (una por línea)
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded h-32 disabled:opacity-50"
          value={machineNames}
          onChange={(e) => setMachineNames(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
      </div>

      {activeTab !== "errores" && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Fecha de Parchado</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded disabled:opacity-50"
            value={patchDate}
            onChange={(e) => setPatchDate(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      )}

      {activeTab === "errores" && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Descripción del Error
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded h-24 disabled:opacity-50"
            placeholder="Describe el error que deseas reportar..."
            value={errorDescription}
            onChange={(e) => setErrorDescription(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
        </div>
      )}

      <button
        onClick={handleRequest}
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        {activeTab === "errores"
          ? "Reportar Errores"
          : "Parchar Vulnerabilidades"}
      </button>
    </div>
  );
};
