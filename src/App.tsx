import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout, ScrollToTop } from './components/layout';
import { ProtectedRoute, PublicRoute } from './routes';

// Pages
import { Home } from './pages/Home.tsx';
import { Catalogo } from './pages/tienda/Catalogo';
import { Carrito } from './pages/tienda/Carrito';
import { Login } from './pages/auth/Login';
import { Registro } from './pages/auth/Registro';
import { RecuperarPassword } from './pages/auth/RecuperarPassword';
import { Dashboard } from './pages/admin/Dashboard';
import { Nosotros } from './pages/info/Nosotros';
import { Blog } from './pages/info/Blog';
import { Perfil } from './pages/usuario/Perfil';
import { Checkout } from './pages/usuario/Checkout';
import { CompraExitosa } from './pages/usuario/CompraExitosa';
import { Boleta } from './pages/usuario/Boleta';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Rutas públicas con layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/catalogo"
          element={
            <MainLayout>
              <Catalogo />
            </MainLayout>
          }
        />
        <Route
          path="/carrito"
          element={
            <MainLayout>
              <Carrito />
            </MainLayout>
          }
        />
        <Route
          path="/nosotros"
          element={
            <MainLayout>
              <Nosotros />
            </MainLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <MainLayout>
              <Blog />
            </MainLayout>
          }
        />

        {/* Rutas de autenticación (solo para no autenticados) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <MainLayout>
                <Login />
              </MainLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <PublicRoute>
              <MainLayout>
                <Registro />
              </MainLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/recuperar-password"
          element={
            <PublicRoute>
              <MainLayout>
                <RecuperarPassword />
              </MainLayout>
            </PublicRoute>
          }
        />

        {/* Rutas protegidas - Solo usuarios autenticados */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Perfil />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de checkout y compra */}
        <Route
          path="/checkout"
          element={
            <MainLayout>
              <Checkout />
            </MainLayout>
          }
        />
        <Route
          path="/compra-exitosa"
          element={
            <MainLayout>
              <CompraExitosa />
            </MainLayout>
          }
        />
        <Route
          path="/boleta"
          element={
            <MainLayout>
              <Boleta />
            </MainLayout>
          }
        />

        {/* Rutas protegidas - Solo admin (sin navbar) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 - Not Found */}
        <Route
          path="*"
          element={
            <MainLayout>
              <div className="not-found">
                <h1>404</h1>
                <p>Página no encontrada</p>
              </div>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
