import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import "@radix-ui/themes/styles.css";
import { Toaster } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from './security/protectedroutes';
import AuthLogin from './pages/AuthLogin'
import Dashboard from './pages/Dashboard';
import Forgetpassword from './pages/Forgetpassword'
import HomePage from './pages/HomePage';
import Aboutus from './Homepage/AboutUs'
import Contactus from './Homepage/Contactus'

const App = () => {


  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
<Route path='/' element={<HomePage />} />
        <Route path='/aboutus' element={<Aboutus />} />
        <Route path='/contactus' element={<Contactus />} />
        <Route path='/dashboard' element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/forgetpassword' element={<Forgetpassword />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/auth/login' element={<AuthLogin />} />
      </Routes>



    </>
  )
}

export default App