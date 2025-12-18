import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const authhandel = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
     setTimeout(() => {
       setLoading(false)
     }, 0);
      }

      if (!token) {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/token/refresh`, {}, {
          withCredentials: true
        }).then((res) => {
          localStorage.setItem('token', res.data.accessToken)
          setLoading(false)

        }).catch((err) => {
          localStorage.removeItem('token')
          console.log(err);
          navigate('/auth')

        })

      }
    } catch (error) {
      console.log(error);

    }

  }


  useEffect(() => {
authhandel()
  }, [])



  if (loading) return <div>Loading...</div>;

  return children;
};

export default ProtectedRoute;
