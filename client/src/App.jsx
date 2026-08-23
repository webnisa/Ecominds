import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Plants from "./pages/Plants";
import PlantDetails from "./pages/PlantDetails";
import History from "./pages/History";
import Reminder from "./pages/Reminders";
import Profile from "./pages/Profile";
import AddPlant from "./pages/AddPlant";
import AISuggestion from "./pages/AISuggestion";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* ================= PLANTS ================= */}

        <Route
          path="/plants"
          element={
            <ProtectedRoute>
              <Plants />
            </ProtectedRoute>
          }
        />

        {/* ================= ADD PLANT ================= */}

        <Route
          path="/add-plant"
          element={
            <ProtectedRoute>
              <AddPlant />
            </ProtectedRoute>
          }
        />

        {/* ================= PLANT DETAILS ================= */}

        <Route
          path="/plants/:id"
          element={
            <ProtectedRoute>
              <PlantDetails />
            </ProtectedRoute>
          }
        />

        {/* ================= AI ================= */}

       <Route
  path="/ai-suggestion"
  element={<AISuggestion />}
/>

        {/* ================= MONITORING ================= */}

        <Route
          path="/monitoring"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        {/* ================= REMINDERS ================= */}

        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Reminder />
            </ProtectedRoute>
          }
        />

        {/* ================= PROFILE ================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;