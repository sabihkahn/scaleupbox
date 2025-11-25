
import { createRoot } from 'react-dom/client'
import {GoogleOAuthProvider} from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'

const id = import.meta.env.VITE_CLIENT_ID
createRoot(document.getElementById('root')).render(

    <GoogleOAuthProvider clientId={id}>
      <BrowserRouter>
    <App />
      </BrowserRouter>
    </GoogleOAuthProvider>

)