import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "@clerk/clerk-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Brain,
  Camera,
  Droplets,
  Sun,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Sprout,
} from "lucide-react";

import {
  getPlants,
} from "../api/plantApi";

import {
  getAISuggestion,
} from "../api/aiApi";


function AISuggestion() {

  const navigate =
    useNavigate();

  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();


  // ==================================================
  // STATE
  // ==================================================

  const [plants, setPlants] =
    useState([]);

  const [selectedPlant, setSelectedPlant] =
    useState("");

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loadingPlants, setLoadingPlants] =
    useState(true);

  const [loadingAI, setLoadingAI] =
    useState(false);

  const [suggestion, setSuggestion] =
    useState(null);

  const [error, setError] =
    useState("");


  // ==================================================
  // LOAD PLANTS
  // ==================================================

  useEffect(() => {

    const loadPlants =
      async () => {

        if (
          !isLoaded ||
          !isSignedIn
        ) {
          return;
        }

        try {

          setLoadingPlants(true);

          setError("");

          const token =
            await getToken();

          if (!token) {

            setError(
              "Authentication token not available."
            );

            return;
          }

          const data =
            await getPlants(
              token
            );

          const plantList =
            data?.plants || [];

          setPlants(
            plantList
          );

          if (
            plantList.length > 0
          ) {

            setSelectedPlant(
              plantList[0]._id
            );
          }

        } catch (err) {

          console.error(
            "❌ Failed to load plants:",
            err
          );

          setError(
            err?.response?.data?.message ||
            "Failed to load plants."
          );

        } finally {

          setLoadingPlants(false);
        }
      };

    loadPlants();

  }, [
    isLoaded,
    isSignedIn,
    getToken,
  ]);


  // ==================================================
  // IMAGE CHANGE
  // ==================================================

  const handleImageChange =
    (e) => {

      const file =
        e.target.files?.[0];

      if (!file) {
        return;
      }


      // File type

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        setError(
          "Please select a valid plant image."
        );

        return;
      }


      // File size

      if (
        file.size >
        5 * 1024 * 1024
      ) {

        setError(
          "Image must be smaller than 5 MB."
        );

        return;
      }


      setError("");

      setSuggestion(null);

      setImage(file);


      // Preview

      const url =
        URL.createObjectURL(
          file
        );

      setPreview(url);
    };


  // ==================================================
  // AI ANALYSIS
  // ==================================================

  const handleAnalyze =
    async () => {

      try {

        setError("");

        setSuggestion(null);


        // Authentication loading

        if (!isLoaded) {

          setError(
            "Authentication is loading. Please wait."
          );

          return;
        }


        // Login

        if (!isSignedIn) {

          setError(
            "Please login first."
          );

          return;
        }


        // IMAGE REQUIRED

        if (!image) {

          setError(
            "Please upload a plant image first 🌱"
          );

          return;
        }


        setLoadingAI(true);


        // TOKEN

        const token =
          await getToken();

        if (!token) {

          setError(
            "Authentication token not available. Please login again."
          );

          return;
        }


        console.log(
          "🌱 Sending image to AI..."
        );


        // API

        const data =
          await getAISuggestion({

            image,

            token,

          });


        console.log(
          "🤖 AI response:",
          data
        );


        if (!data?.success) {

          throw new Error(
            data?.message ||
            "AI analysis failed"
          );
        }


        setSuggestion(
          data.suggestion
        );


      } catch (err) {

        console.error(
          "❌ AI suggestion error:",
          err
        );


        const backendMessage =
          err?.response?.data?.message;

        const backendError =
          err?.response?.data?.error;


        setError(

          backendMessage ||

          backendError ||

          err?.message ||

          "AI suggestion failed. Please try again."

        );

      } finally {

        setLoadingAI(false);
      }
    };


  // ==================================================
  // LOADING
  // ==================================================

  if (
    !isLoaded ||
    loadingPlants
  ) {

    return (

      <div className="min-h-screen bg-[#F7FBF8] flex items-center justify-center">

        <div className="flex items-center gap-3 text-[#166534]">

          <Loader2
            size={28}
            className="animate-spin"
          />

          <span className="font-semibold">
            Loading AI Assistant...
          </span>

        </div>

      </div>
    );
  }


  // ==================================================
  // NOT SIGNED IN
  // ==================================================

  if (!isSignedIn) {

    return (

      <div className="min-h-screen bg-[#F7FBF8] flex items-center justify-center p-6">

        <div className="bg-white rounded-[28px] p-8 max-w-md w-full text-center shadow-sm border border-[#DCEBE0]">

          <Brain
            size={50}
            className="mx-auto text-[#49A86F] mb-4"
          />

          <h1 className="text-2xl font-bold text-[#123C2B]">
            Sign in required
          </h1>

          <p className="text-[#817D75] mt-2">
            Please sign in to use AI plant suggestions.
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
            className="mt-6 w-full h-[50px] rounded-full bg-[#166534] text-white font-semibold hover:bg-[#14532D] transition"
          >
            Go to Dashboard
          </button>

        </div>

      </div>
    );
  }


  // ==================================================
  // MAIN
  // ==================================================

  return (

    <div className="min-h-screen bg-[#F7FBF8] px-4 sm:px-6 lg:px-10 py-8">

      <div className="max-w-6xl mx-auto">


        {/* BACK */}

        <button
          onClick={() =>
            navigate("/plants")
          }
          className="mb-6 flex items-center gap-2 text-[#166534] font-semibold hover:gap-3 transition-all"
        >

          <ArrowLeft size={19} />

          Back to My Plants

        </button>


        {/* HEADER */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-[#E7F5EB] flex items-center justify-center">

              <Brain
                size={27}
                className="text-[#166534]"
              />

            </div>

            <div>

              <p className="text-sm font-semibold text-[#49A86F]">
                EcoMinds AI 🌱
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#123C2B]">
                AI Plant Suggestion
              </h1>

            </div>

          </div>


          <p className="mt-3 text-[#817D75] max-w-2xl">
            Upload a real plant photo and let AI
            inspect its visible condition and give
            personalized care suggestions.
          </p>

        </div>


        {/* ERROR */}

        {error && (

          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex gap-3">

            <AlertTriangle
              size={21}
              className="text-red-500 shrink-0"
            />

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

          </div>

        )}


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="rounded-[28px] bg-white border border-[#DCEBE0] shadow-sm p-5 sm:p-7">


            {/* TITLE */}

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-[#EFF7F1] flex items-center justify-center">

                <Leaf
                  size={21}
                  className="text-[#49A86F]"
                />

              </div>

              <div>

                <h2 className="font-bold text-[#123C2B]">
                  Analyze Your Plant
                </h2>

                <p className="text-xs text-[#817D75]">
                  Upload a clear plant photo
                </p>

              </div>

            </div>


            {/* PLANT SELECT */}

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Your Plant

              <span className="ml-1 text-gray-400 font-normal">
                (optional)
              </span>

            </label>


            <select
              value={selectedPlant}
              onChange={(e) =>
                setSelectedPlant(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-[#DCEBE0] bg-[#F7FBF8] px-4 py-3.5 outline-none focus:border-[#49A86F] focus:ring-2 focus:ring-[#DCEBE0]"
            >

              <option value="">
                Select a plant
              </option>

              {plants.map(
                (plant) => (

                  <option
                    key={plant._id}
                    value={plant._id}
                  >
                    {plant.plantName}
                  </option>

                )
              )}

            </select>


            {/* IMAGE */}

            <div className="mt-6">

              <label className="block text-sm font-semibold text-gray-700 mb-2">

                Plant Image

                <span className="ml-1 text-red-500">
                  *
                </span>

              </label>


              <div className="rounded-2xl border-2 border-dashed border-[#B9DCC4] bg-[#F7FBF8] p-4">


                {preview ? (

                  <img
                    src={preview}
                    alt="Plant preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />

                ) : (

                  <div className="h-64 rounded-xl bg-[#EAF6ED] flex flex-col items-center justify-center">

                    <Camera
                      size={42}
                      className="text-[#49A86F] mb-3"
                    />

                    <p className="text-sm font-medium text-[#4D6558]">
                      Upload plant photo
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG or WEBP • Max 5 MB
                    </p>

                  </div>

                )}


                <label className="mt-4 flex items-center justify-center gap-2 cursor-pointer rounded-xl bg-white border border-[#CFE5D5] px-4 py-3 text-sm font-semibold text-[#166534] hover:bg-[#EFF7F1] transition">

                  <Camera size={18} />

                  {preview
                    ? "Change Image"
                    : "Choose Image"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />

                </label>

              </div>

            </div>


            {/* BUTTON */}

            <button
              onClick={
                handleAnalyze
              }
              disabled={
                loadingAI ||
                !image
              }
              className="mt-6 w-full h-[52px] rounded-full bg-[#166534] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#14532D] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >

              {loadingAI ? (

                <>

                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  AI is analyzing...

                </>

              ) : (

                <>

                  <Sparkles size={20} />

                  Analyze Plant 🌱

                </>

              )}

            </button>


            <p className="text-xs text-center text-gray-400 mt-3">
              AI analyzes visible plant condition from
              your uploaded image.
            </p>

          </div>


          {/* ==================================================
              RIGHT
          ================================================== */}

          <div className="rounded-[28px] bg-white border border-[#DCEBE0] shadow-sm p-5 sm:p-7">


            {/* TITLE */}

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-[#FFF8E7] flex items-center justify-center">

                <Sparkles
                  size={21}
                  className="text-[#D69E2E]"
                />

              </div>

              <div>

                <h2 className="font-bold text-[#123C2B]">
                  AI Analysis
                </h2>

                <p className="text-xs text-[#817D75]">
                  Real image-based plant analysis
                </p>

              </div>

            </div>


            {/* EMPTY */}

            {!suggestion &&
              !loadingAI && (

                <div className="min-h-[450px] flex flex-col items-center justify-center text-center">

                  <div className="w-24 h-24 rounded-full bg-[#EFF7F1] flex items-center justify-center mb-5">

                    <Brain
                      size={45}
                      className="text-[#49A86F]"
                    />

                  </div>

                  <h3 className="text-xl font-bold text-[#123C2B]">
                    Ready to inspect 🌱
                  </h3>

                  <p className="text-sm text-[#817D75] max-w-sm mt-2">
                    Upload a clear photo of your
                    plant and click
                    <strong>
                      {" "}Analyze Plant
                    </strong>.
                  </p>

                </div>
              )}


            {/* LOADING */}

            {loadingAI && (

              <div className="min-h-[450px] flex flex-col items-center justify-center text-center">

                <Loader2
                  size={48}
                  className="animate-spin text-[#49A86F]"
                />

                <h3 className="mt-5 text-xl font-bold text-[#123C2B]">
                  Looking at your plant...
                </h3>

                <p className="mt-2 text-sm text-[#817D75]">
                  AI is checking visible leaves,
                  damage and plant condition 🌿
                </p>

              </div>
            )}


            {/* ==================================================
                RESULT
            ================================================== */}

            {suggestion &&
              !loadingAI && (

                <div className="space-y-4">


                  {/* PLANT IDENTIFICATION */}

                  <div className="rounded-2xl border border-[#DCEBE0] p-4">

                    <div className="flex gap-3">

                      <div className="w-10 h-10 rounded-xl bg-[#EFF7F1] flex items-center justify-center shrink-0">

                        <Sprout
                          size={21}
                          className="text-[#49A86F]"
                        />

                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Plant Identification
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#123C2B]">

                          {suggestion.plantName ||
                            "Uncertain"}

                        </p>

                        <p className="text-sm text-gray-500">

                          {suggestion.plantType ||
                            "Unknown"}

                        </p>

                        <p className="text-xs text-gray-400 mt-2">

                          Identification confidence:
                          {" "}
                          {suggestion.confidence ??
                            0}
                          %

                        </p>

                      </div>

                    </div>

                  </div>


                  {/* HEALTH */}

                  <div className="rounded-2xl bg-[#EFF7F1] p-4">

                    <div className="flex items-center gap-3">

                      <CheckCircle2
                        size={23}
                        className="text-[#49A86F]"
                      />

                      <div className="flex-1">

                        <p className="text-xs text-[#817D75]">
                          Plant Health
                        </p>

                        <p className="font-bold text-[#166534]">
                          {suggestion.healthStatus ||
                            "Uncertain"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">

                          Health Score:
                          {" "}
                          {suggestion.healthScore ??
                            0}
                          /100

                        </p>

                      </div>

                    </div>

                  </div>


                  {/* PROBLEMS */}

                  {Array.isArray(
                    suggestion.visibleProblems
                  ) &&
                    suggestion.visibleProblems.length >
                      0 && (

                      <div className="rounded-2xl bg-red-50 border border-red-100 p-4">

                        <div className="flex gap-3">

                          <AlertTriangle
                            size={21}
                            className="text-red-500 shrink-0"
                          />

                          <div>

                            <p className="font-semibold text-red-700">
                              Problems Detected
                            </p>

                            <ul className="mt-2 space-y-1">

                              {suggestion.visibleProblems.map(
                                (
                                  problem,
                                  index
                                ) => (

                                  <li
                                    key={
                                      index
                                    }
                                    className="text-sm text-red-600"
                                  >
                                    • {problem}
                                  </li>

                                )
                              )}

                            </ul>

                          </div>

                        </div>

                      </div>

                    )}


                  {/* WATERING */}

                  <div className="rounded-2xl border border-[#DCEBE0] p-4">

                    <div className="flex gap-3">

                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">

                        <Droplets
                          size={20}
                          className="text-blue-500"
                        />

                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Watering Advice
                        </p>

                        <p className="mt-1 text-sm text-gray-700 leading-6">
                          {suggestion.wateringAdvice ||
                            "Water according to the plant's needs and soil condition."}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* SUNLIGHT */}

                  <div className="rounded-2xl border border-[#DCEBE0] p-4">

                    <div className="flex gap-3">

                      <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">

                        <Sun
                          size={20}
                          className="text-yellow-500"
                        />

                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Sunlight Advice
                        </p>

                        <p className="mt-1 text-sm text-gray-700 leading-6">
                          {suggestion.sunlightAdvice ||
                            "Provide suitable sunlight for the plant."}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* SOIL */}

                  <div className="rounded-2xl border border-[#DCEBE0] p-4">

                    <div className="flex gap-3">

                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">

                        <Leaf
                          size={20}
                          className="text-amber-600"
                        />

                      </div>

                      <div>

                        <p className="text-xs text-gray-400">
                          Soil Advice
                        </p>

                        <p className="mt-1 text-sm text-gray-700 leading-6">
                          {suggestion.soilAdvice ||
                            "Use suitable well-draining soil."}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* CARE TIPS */}

                  {Array.isArray(
                    suggestion.careTips
                  ) &&
                    suggestion.careTips.length >
                      0 && (

                      <div className="rounded-2xl bg-[#F7FBF8] border border-[#DCEBE0] p-4">

                        <div className="flex gap-3">

                          <Sparkles
                            size={20}
                            className="text-[#49A86F] shrink-0 mt-1"
                          />

                          <div>

                            <p className="font-semibold text-[#123C2B]">
                              Care Tips 🌱
                            </p>

                            <ul className="mt-2 space-y-2">

                              {suggestion.careTips.map(
                                (
                                  tip,
                                  index
                                ) => (

                                  <li
                                    key={
                                      index
                                    }
                                    className="text-sm text-[#59685F]"
                                  >
                                    • {tip}
                                  </li>

                                )
                              )}

                            </ul>

                          </div>

                        </div>

                      </div>

                    )}


                  {/* RECOMMENDATION */}

                  <div className="rounded-2xl bg-[#EAF6ED] border border-[#D4EBDD] p-4">

                    <p className="font-semibold text-[#123C2B]">
                      🌱 AI Recommendation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#59685F]">

                      {suggestion.overallRecommendation ||
                        "Monitor the plant regularly and follow suitable care practices."}

                    </p>

                  </div>


                  {/* WARNING */}

                  {suggestion.warning && (

                    <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4">

                      <div className="flex gap-3">

                        <AlertTriangle
                          size={20}
                          className="text-orange-500 shrink-0"
                        />

                        <div>

                          <p className="font-semibold text-orange-700">
                            Important Note
                          </p>

                          <p className="mt-1 text-sm text-orange-600">
                            {suggestion.warning}
                          </p>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              )}

          </div>

        </div>


        {/* BOTTOM INFO */}

        <div className="mt-6 rounded-[24px] bg-[#EAF6ED] border border-[#D4EBDD] p-5 flex flex-col sm:flex-row gap-4 items-start">

          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">

            <Leaf
              size={21}
              className="text-[#49A86F]"
            />

          </div>

          <div>

            <h3 className="font-bold text-[#123C2B]">
              Smart Plant Care
            </h3>

            <p className="mt-1 text-sm text-[#607267] leading-6">

              AI analyzes the visible condition of
              your uploaded image. It cannot directly
              measure soil moisture, temperature or
              humidity from a photo.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AISuggestion;