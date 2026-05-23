import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URIAPI;

const getEquiposAnalista = async (analistaId, signal) => {
  const response = await axios.get(apiUrl + "equipos/analista/" + analistaId, { signal });
  return response.data;
};

const getEquipos = async (signal) => {
  const response = await axios.get(apiUrl + "equipos", { signal });
  return response.data;
};

const getAnalistas = async (signal) => {
  const response = await axios.get(apiUrl + "analistas", { signal });
  return response.data;
};

const getVulnerabilidades = async (analistaId, signal) => {
  const response = await axios.get(apiUrl + "vulns/" + analistaId, { signal });
  return response.data;
};

const getHistorial = async (analistaId, signal) => {
  const params = analistaId ? `?analistaId=${analistaId}` : "";
  const response = await axios.get(apiUrl + "historial" + params, { signal });
  return response.data;
};

const parcharVulnerabilidadesMasivo = async (
  producto,
  machineNames,
  patchDate,
  analistaId
) => {
  const response = await axios.patch(apiUrl + "vulns/parchar-masivo", {
    producto,
    machineNames,
    fechaParchado: patchDate || null,
    analistaId,
  });
  return response.data;
};

const reportarErroresMasivo = async (
  producto,
  machineNames,
  errorDescription,
  analistaId
) => {
  const response = await axios.patch(apiUrl + "vulns/reportar-error", {
    producto,
    machineNames,
    mensaje: errorDescription,
    analistaId,
  });
  return response.data;
};

export default {
  getEquipos,
  getEquiposAnalista,
  getAnalistas,
  getVulnerabilidades,
  getHistorial,
  parcharVulnerabilidadesMasivo,
  reportarErroresMasivo,
};
