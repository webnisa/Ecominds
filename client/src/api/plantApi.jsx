import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const plantApi = axios.create({
  baseURL: API_URL,
});

// ==========================================
// GET ALL PLANTS
// ==========================================

export const getPlants = async (token) => {
  const response = await plantApi.get("/plants", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ==========================================
// GET SINGLE PLANT
// ==========================================

export const getPlantById = async (id, token) => {
  const response = await plantApi.get(`/plants/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ==========================================
// CREATE PLANT
// ==========================================

export const createPlant = async (plantData, token) => {
  const formData = new FormData();

  formData.append("plantName", plantData.plantName);
  formData.append("plantType", plantData.plantType || "");
  formData.append("location", plantData.location || "");
  formData.append(
    "wateringFrequency",
    plantData.wateringFrequency || 7
  );

  if (plantData.image) {
    formData.append("image", plantData.image);
  }

  const response = await plantApi.post("/plants", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ==========================================
// DELETE PLANT
// ==========================================

export const deletePlant = async (id, token) => {
  const response = await plantApi.delete(`/plants/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};