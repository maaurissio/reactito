import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { ProtectedRoute, PublicRoute } from './routes';

// Pages
import { Home } from './pages/Home';
import { Catalogo } from './pages/tienda/Catalogo';
import { Carrito } from './pages/tienda/Carrito';
import { Login } from './pages/auth/Login';
import { Registro } from './pages/auth/Registro';
import { Dashboard } from './pages/admin/Dashboard';

function App() {
  return (
    <BrowserRouter>
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

        {/* Rutas de autenticación (solo para no autenticados) */}
        <Route
          path="/auth/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/auth/registro"
          element={
            <PublicRoute>
              <Registro />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas - Solo admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <Dashboard />
              </MainLayout>
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
