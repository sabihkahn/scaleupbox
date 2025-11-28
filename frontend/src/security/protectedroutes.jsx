import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Decode JWT without package
const decodeJWT = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = localStorage.getItem("token");

      if (!accessToken) {
        localStorage.clear();
        navigate("/auth");
        return;
      }

      const decoded = decodeJWT(accessToken);
      if (!decoded) {
        localStorage.clear();
        navigate("/auth");
        return;
      }

      const now = Date.now() / 1000; // seconds
      if (decoded.exp < now) {
        // Token expired → try refreshing
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
            { withCredentials: true }
          );
          localStorage.setItem("token", res.data.token);
          setLoading(false);
        } catch (err) {
          console.error("Refresh token failed", err);
          localStorage.clear();
          navigate("/auth");
        }
      } else {
        setLoading(false);
      }
    };

    checkToken();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return children;
};

export default ProtectedRoute;
