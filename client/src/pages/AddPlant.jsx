import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { createPlant } from "../api/plantApi";

function AddPlant() {
  const navigate = useNavigate();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [formData, setFormData] = useState({
    plantName: "",
    plantType: "",
    location: "",
    wateringFrequency: 7,
    image: null,
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // IMAGE CHANGE
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allow only images
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setError("");

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    // Preview
    const imageURL = URL.createObjectURL(file);
    setPreview(imageURL);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!isLoaded) {
      setError("Authentication is still loading. Please wait.");
      return;
    }

    if (!isSignedIn) {
      setError("Please login first.");
      return;
    }

    if (!formData.plantName.trim()) {
      setError("Plant name is required.");
      return;
    }

    try {
      setLoading(true);

      // Get Clerk token
      const token = await getToken();

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      console.log("Clerk token received ✅");

      const response = await createPlant(formData, token);

      console.log("Plant created:", response);

      // Go to My Plants
      navigate("/plants");

    } catch (error) {
      console.error("Add plant error:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to add plant. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-green-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-800">
            Add New Plant 🌱
          </h1>

          <p className="mt-2 text-gray-600">
            Add your plant and start taking care of it.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-8">

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ================================= */}
            {/* PLANT IMAGE */}
            {/* ================================= */}

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Plant Image
              </label>

              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-green-50 p-5">

                {preview ? (
                  <img
                    src={preview}
                    alt="Plant preview"
                    className="mb-4 h-48 w-full rounded-2xl object-cover sm:h-56"
                  />
                ) : (
                  <div className="mb-4 flex h-40 w-full items-center justify-center rounded-2xl bg-green-100 text-6xl">
                    🌱
                  </div>
                )}

                <label className="cursor-pointer rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700">
                  {preview ? "Change Image" : "Choose Plant Image"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG, WEBP • Maximum 5 MB
                </p>
              </div>
            </div>

            {/* ================================= */}
            {/* PLANT NAME */}
            {/* ================================= */}

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Plant Name *
              </label>

              <input
                type="text"
                name="plantName"
                value={formData.plantName}
                onChange={handleChange}
                placeholder="e.g. Money Plant"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>

            {/* ================================= */}
            {/* PLANT TYPE */}
            {/* ================================= */}

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Plant Type
              </label>

              <input
                type="text"
                name="plantType"
                value={formData.plantType}
                onChange={handleChange}
                placeholder="e.g. Indoor, Flowering, Vegetable"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>

            {/* ================================= */}
            {/* LOCATION */}
            {/* ================================= */}

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Balcony"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>

            {/* ================================= */}
            {/* WATERING FREQUENCY */}
            {/* ================================= */}

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Watering Frequency
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="wateringFrequency"
                  min="1"
                  max="30"
                  value={formData.wateringFrequency}
                  onChange={handleChange}
                  className="w-28 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
                />

                <span className="text-gray-600">
                  days
                </span>
              </div>
            </div>

            {/* ================================= */}
            {/* BUTTONS */}
            {/* ================================= */}

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">

              <button
                type="button"
                onClick={() => navigate("/plants")}
                className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Adding Plant..." : "Add Plant 🌱"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPlant;