import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'swiper/css'; // Importa o estilo base
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { register } from 'swiper/element/bundle'
import App from './App.tsx'
import AuthProvider from './context/AuthContext'
import './index.css'

register (); 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> 
      <App/>
    </AuthProvider>
  </StrictMode>
)
