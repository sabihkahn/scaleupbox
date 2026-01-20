import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Axiosinterceptor"; // Axios instance with interceptor

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
      await api.get("/auth/user/protected"); // Uses interceptor: auto token & refresh
        setLoading(false);
      
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/auth");
        console.log(err);
        
      }
    };

    verifyAuth();
  }, []);

  if (loading) return <div>Loading...</div>; // show spinner while verifying

  return children;
};

export default ProtectedRoute;
