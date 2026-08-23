import axios from "axios";


const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";


// ==================================================
// IMAGE AI
// ==================================================

export const getAISuggestion =
  async ({
    image,
    token,
  }) => {

    const formData =
      new FormData();

    formData.append(
      "image",
      image
    );


    const response =
      await axios.post(

        `${BACKEND_URL}/api/ai/analyze-image`,

        formData,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    return response.data;
  };


// ==================================================
// DAILY HEALTH AI
// ==================================================

export const analyzePlantHealth =
  async ({
    plantId,
    token,
  }) => {

    const response =
      await axios.post(

        `${BACKEND_URL}/api/ai/analyze/${plantId}`,

        {},

        {
          headers: {

            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    return response.data;
  };


// ==================================================
// GET LATEST HEALTH
// ==================================================

export const getLatestPlantHealth =
  async ({
    plantId,
    token,
  }) => {

    const response =
      await axios.get(

        `${BACKEND_URL}/api/ai/health/${plantId}`,

        {
          headers: {

            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    return response.data;
  };


// ==================================================
// GET HEALTH HISTORY
// ==================================================

export const getPlantHealthHistory =
  async ({
    plantId,
    token,
  }) => {

    const response =
      await axios.get(

        `${BACKEND_URL}/api/ai/health/${plantId}/history`,

        {
          headers: {

            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    return response.data;
  };