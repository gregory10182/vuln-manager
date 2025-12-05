// vista donde el usuario va a pegar un set de nombres de maquinas seleccionara la vulnerabilidad y podra modificar la fecha de parchado masivamente
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import api from "../data/api.js";
export const Parchados = ({ currentUser }) => {
  const [vulnerabilidades, setVulnerabilidades] = useState([]);
  const [selectedVuln, setSelectedVuln] = useState(null);
  const [machineNames, setMachineNames] = useState("");
  const [patchDate, setPatchDate] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    api.getVulnerabilidades(currentUser.id).then((data) => {
      // extraer solo las vulnerabilidades unicas basado en el productName
      const uniqueVulns = [];
      data.forEach((equipo) => {
        equipo.vulnerabilidades.forEach((vuln) => {
          if(!uniqueVulns.find((v) => v === vuln.productName)) {
            uniqueVulns.push(vuln.productName);
          }
        });
      });
      setVulnerabilidades(uniqueVulns);
    });
  }, [currentUser]);
  const handlePatch = () => {

    api.parcharVulnerabilidadesMasivo(selectedVuln, machineNames.split("\n")).then((response) => {
      setMessage("Vulnerabilidades parchadas exitosamente.");
      console.log(response);
    }).catch((error) => {
      setMessage("Error parchando vulnerabilidades." + error.message);
    });

  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Parchar Vulnerabilidades</h2>
      {message && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          {message}
        </div>
      )}
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Selecciona Vulnerabilidad
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedVuln || ""}
          onChange={(e) => setSelectedVuln(e.target.value)}
        >
          <option value="" disabled>
            -- Selecciona una vulnerabilidad --
          </option>
          {vulnerabilidades.map((vuln) => (
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
          className="w-full p-2 border border-gray-300 rounded h-32"
          value={machineNames}
          onChange={(e) => setMachineNames(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Fecha de Parchado</label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded"
          value={patchDate}
          onChange={(e) => setPatchDate(e.target.value)}
        />
      </div>
      <button
        onClick={handlePatch}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Parchar
      </button>
    </div>
  );
};
