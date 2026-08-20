import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { setSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        setSession(token, user);
        navigate("/problems", { replace: true });
        return;
      } catch (err) {
        console.error("Failed to parse user from OAuth callback", err);
      }
    }

    // Fallback if token is missing or invalid
    navigate("/login", { replace: true });
  }, [searchParams, setSession, navigate]);

  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-emerald-500"></div>
        <p className="text-sm text-zinc-400 font-medium">Completing Google authentication...</p>
      </div>
    </div>
  );
};
