import axios from "axios";

const API_BASE_URL = "https://flight-status-mock.core.travelopia.cloud/flights";

export const fetchFlights = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw error;
  }
};

export const fetchFlightDetails = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching flight details:", error);
    throw error;
  }
};
