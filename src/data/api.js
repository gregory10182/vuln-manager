import axios from "axios";

const apiUrl = "http://localhost:3000/";

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

export default {
  getEquipos,
  getAnalistas,
};
