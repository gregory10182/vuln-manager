import axios from "axios";

const apiUrl = "http://localhost:3000/";

export const getEquipos = async () => {
  try {
    const response = await axios.get(apiUrl + "equipos");
    return response.data;
  } catch (error) {
    console.error("Error fetching equipos:", error);
    throw error;
  }
};
