import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Leaf,
  Loader2,
  AlertCircle,
} from "lucide-react";

import PlantCard from "../components/PlantCard";
import { getPlants, deletePlant } from "../api/plantApi";

function Plants() {
  const navigate = useNavigate();

  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PLANTS
  // ==========================================

  const fetchPlants = async () => {
    try {
      setLoading(true);
      setError("");

      // Clerk completely loaded?
      if (!isLoaded) {
        return;
      }

      // User signed in?
      if (!isSignedIn) {
        setError("Please sign in first.");
        setLoading(false);
        return;
      }

      // Get Clerk session token
      const token = await getToken();

      if (!token) {
        setError(
          "Authentication token not available. Please sign in again."
        );

        setLoading(false);
        return;
      }

      console.log("Clerk token received ✅");

      const data = await getPlants(token);

      console.log("Plants API response:", data);

      setPlants(data?.plants || []);
    } catch (error) {
      console.error("Failed to fetch plants:", error);

      if (error?.response?.status === 401) {
        setError(
          "Authentication failed. Please sign out and sign in again."
        );
      } else {
        setError(
          error?.response?.data?.message ||
            "Failed to load plants."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PLANTS
  // ==========================================

  useEffect(() => {
    if (isLoaded) {
      fetchPlants();
    }
  }, [isLoaded, isSignedIn]);

  // ==========================================
  // DELETE PLANT
  // ==========================================

  const handleDelete = async (plantId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this plant?"
    );

    if (!confirmed) return;

    try {
      const token = await getToken();

      if (!token) {
        setError("Authentication token not available.");
        return;
      }

      await deletePlant(plantId, token);

      // Remove deleted plant from UI
      setPlants((prev) =>
        prev.filter((plant) => plant._id !== plantId)
      );
    } catch (error) {
      console.error("Delete plant error:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to delete plant."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FBF8]">
        <div className="flex items-center gap-3 text-[#166534]">
          <Loader2
            size={25}
            className="animate-spin"
          />

          <span className="font-semibold">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT SIGNED IN
  // ==========================================

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#F7FBF8] flex items-center justify-center p-6">
        <div className="bg-white rounded-[28px] p-8 max-w-md w-full text-center shadow-sm border border-[#DCEBE0]">

          <Leaf
            size={45}
            className="mx-auto text-[#49A86F] mb-4"
          />

          <h1 className="text-2xl font-bold text-[#123C2B]">
            Sign in required
          </h1>

          <p className="text-[#817D75] mt-2">
            Please sign in to view your plants.
          </p>

          <button
            onClick={() => navigate("/")}
            className="
              mt-6
              w-full
              h-[50px]
              rounded-full
              bg-[#166534]
              text-white
              font-semibold
              hover:bg-[#14532D]
              transition
            "
          >
            Go to Dashboard
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F7FBF8] px-4 sm:px-6 lg:px-10 py-8">

      <div className="max-w-7xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <p className="text-sm text-[#49A86F] font-semibold">
              EcoMinds 🌱
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#123C2B] mt-1">
              My Plants
            </h1>

            <p className="text-[#817D75] mt-2">
              Monitor and take care of your plants.
            </p>
          </div>

          <button
            onClick={() => navigate("/add-plant")}
            className="
              flex
              items-center
              justify-center
              gap-2
              h-[50px]
              px-6
              rounded-full
              bg-[#166534]
              text-white
              font-semibold
              hover:bg-[#14532D]
              transition
              shadow-sm
            "
          >
            <Plus size={20} />

            Add Plant
          </button>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">

            <AlertCircle
              size={20}
              className="text-red-500 mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold text-red-700">
                {error}
              </p>

              {error.includes("Authentication") && (
                <button
                  onClick={fetchPlants}
                  className="mt-2 text-sm font-semibold text-red-700 underline"
                >
                  Try Again
                </button>
              )}
            </div>

          </div>
        )}

        {/* ======================================
            LOADING
        ====================================== */}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2
              size={35}
              className="animate-spin text-[#49A86F]"
            />
          </div>
        ) : plants.length === 0 ? (

          /* ======================================
             EMPTY STATE
          ====================================== */

          <div className="bg-white rounded-[28px] border border-[#DCEBE0] p-10 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-[#EFF7F1] flex items-center justify-center">
              <Leaf
                size={38}
                className="text-[#49A86F]"
              />
            </div>

            <h2 className="text-2xl font-bold text-[#123C2B] mt-5">
              No plants yet 🌱
            </h2>

            <p className="text-[#817D75] mt-2">
              Add your first plant to start monitoring it.
            </p>

            <button
              onClick={() => navigate("/add-plant")}
              className="
                mt-6
                px-7
                h-[48px]
                rounded-full
                bg-[#166534]
                text-white
                font-semibold
                hover:bg-[#14532D]
                transition
              "
            >
              Add Your First Plant
            </button>

          </div>

        ) : (

          /* ======================================
             PLANT GRID
          ====================================== */

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
              gap-6
            "
          >

            {plants.map((plant) => (
              <PlantCard
                key={plant._id}
                plant={plant}
                onViewDetails={() =>
                  navigate(`/plants/${plant._id}`)
                }
                onDelete={() =>
                  handleDelete(plant._id)
                }
              />
            ))}

          </div>

        )}

      </div>
    </div>
  );
}

export default Plants;