import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";


// ============================================================
// GET ALL PLANTS MONITORING
// ============================================================

export const getAllPlantsMonitoring =
  async (token) => {
    const response =
      await axios.get(
        `${BACKEND_URL}/api/monitoring`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };


// ============================================================
// GET SINGLE PLANT MONITORING
// ============================================================

export const getPlantMonitoring =
  async (
    plantId,
    token
  ) => {
    const response =
      await axios.get(
        `${BACKEND_URL}/api/monitoring/${plantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };


// ============================================================
// ADD SENSOR DATA
// ============================================================

export const addSensorData =
  async (
    sensorData,
    token
  ) => {
    const response =
      await axios.post(
        `${BACKEND_URL}/api/monitoring/sensor`,
        sensorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

    return response.data;
  };