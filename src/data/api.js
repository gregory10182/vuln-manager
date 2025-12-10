import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URIAPI;

const getEquiposAnalista = async (analistaId) => {
  try {
    const response = await axios.get(apiUrl + "equipos/analista/" + analistaId);
    return response.data;
  } catch (error) {
    console.error("Error fetching equipos:", error);
    throw error;
  }
};

const getEquipos = async () => {
  try {
    const response = await axios.get(apiUrl + "equipos");
    return response.data;
  } catch (error) {
    console.error("Error fetching equipos:", error);
    throw error;
  }
};

const getAnalistas = async () => {
  try {
    const response = await axios.get(apiUrl + "analistas");
    return response.data;
  } catch (error) {
    console.error("Error fetching analistas:", error);
    throw error;
  }
};

const getVulnerabilidades = async (analistaId) => {
  try {
    const response = await axios.get(apiUrl + "vulns/" + analistaId);
    return response.data;
  } catch (error) {
    console.error("Error fetching vulnerabilidades:", error);
    throw error;
  }
};

const parcharVulnerabilidadesMasivo = async (
  producto,
  machineNames,
  patchDate
) => {
  try {
    const response = await axios.patch(apiUrl + "vulns/parchar-masivo", {
      producto,
      machineNames,
      fechaParchado: patchDate || null,
    });
    return response.data;
  } catch (error) {
    console.error("Error parchando vulnerabilidades:", error);
    throw error;
  }
};

const reportarErroresMasivo = async (
  producto,
  machineNames,
  errorDescription
) => {
  try {
    const response = await axios.patch(apiUrl + "vulns/reportar-error", {
      producto,
      machineNames,
      mensaje: errorDescription,
    });
    return response.data;
  }
  catch (error) {
    console.error("Error reportando errores:", error);
    throw error;
  }
};

export default {
  getEquipos,
  getEquiposAnalista,
  getAnalistas,
  getVulnerabilidades,
  parcharVulnerabilidadesMasivo,
  reportarErroresMasivo,
};
