
import React, { useState, useEffect } from "react";
import api from "../api/Axiosinterceptor";
import { DashboardContext } from "./DashboardContext";



const Dashboardcontextapi = ({children}) => {
   const [dashboardData, setDashboardData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState("");
      const [currentpage, setcurrentpage] = useState('')
  
      // 3. Fetch dashboard data once
      useEffect(() => {
          const fetchDashboard = async () => {
              try {
                  const res = await api.get("/user/data/dashboard"); // Protected API
                  setDashboardData(res.data.data[0]);
                  setLoading(false);
                  console.log(res.data);
                  
              } catch (err) {
                  console.error("Failed to fetch dashboard:", err);
                  setError("Failed to load dashboard");
                  setLoading(false);
              }
          };
  
          fetchDashboard();
      }, []);
  
      return (
          <DashboardContext.Provider value={{ dashboardData, loading, error,currentpage,setcurrentpage }}>
              {children}
          </DashboardContext.Provider>
      );
}

export default Dashboardcontextapi