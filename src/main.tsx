import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css'
// Estilos personalizados
import './styles.css'
// Estilo moderno Apple/Hero UI
import './apple-modern.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
