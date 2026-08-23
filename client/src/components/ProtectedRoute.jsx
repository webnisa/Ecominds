import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  // Clerk abhi load ho raha hai
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FBF8]">
        <div className="text-[#166534] font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  // Login nahi hai
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;