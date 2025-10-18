import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { IPedido } from '../../services/pedidosService';

export const CompraExitosa = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [pedido, setPedido] = useState<IPedido | null>(null);
  const pedidoCargado = useRef(false);

  useEffect(() => {
    // Solo cargar el pedido una vez (evita problemas con React Strict Mode)
    if (pedidoCargado.current) {
      return;
    }
    
    // Recuperar datos del pedido
    const pedidoGuardado = localStorage.getItem('ultimoPedido');
    
    if (!pedidoGuardado) {
      // Si no hay pedido, redirigir al catálogo
      navigate('/catalogo');
      return;
    }

    try {
      const pedidoData = JSON.parse(pedidoGuardado) as IPedido;
      setPedido(pedidoData);
      pedidoCargado.current = true;
      
      // Limpiar el localStorage después de cargar exitosamente
      localStorage.removeItem('ultimoPedido');
    } catch (error) {
      console.error('Error al parsear pedido:', error);
      navigate('/catalogo');
    }
  }, [navigate]);

  if (!pedido) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const nombreCompleto = `${pedido.contacto.nombre} ${pedido.contacto.apellido}`;

  return (
    <div>
      {/* Header de confirmación */}
      <section className="bg-success text-white py-5">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <i className="fas fa-check-circle fa-4x mb-4"></i>
              <h1 className="display-4 mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff' }}>
                ¡Compra Exitosa!
              </h1>
              <p className="lead">
                Gracias por confiar en HuertoHogar. Tu pedido está siendo procesado y recibirás una confirmación por correo electrónico.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Información del cliente */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">
                  <i className="fas fa-user me-2"></i>Información del Cliente
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Nombre:</strong>{' '}
                      <span className="text-muted">{nombreCompleto}</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Correo:</strong>{' '}
                      <span className="text-muted">{pedido.contacto.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles del pedido */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">
                  <i className="fas fa-shopping-bag me-2"></i>Detalles del Pedido
                </h4>
              </div>
              <div className="card-body">
                {/* Lista de productos */}
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="fas fa-seedling text-success me-2"></i>
                              <strong>{item.nombre}</strong>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">{item.cantidad}</span>
                          </td>
                          <td>${item.precio.toLocaleString('es-CL')}</td>
                          <td className="text-end">
                            <strong>${item.subtotal.toLocaleString('es-CL')}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="border-top pt-3 mt-3">
                  <div className="row">
                    <div className="col-md-6 offset-md-6">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>${pedido.subtotal.toLocaleString('es-CL')}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Envío:</span>
                        <span className={pedido.envio.esGratis ? 'text-success' : ''}>
                          {pedido.envio.esGratis ? 'Gratis' : `$${pedido.envio.costo.toLocaleString('es-CL')}`}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center border-top pt-2">
                        <h4 className="mb-0">Total:</h4>
                        <h4 className="mb-0 text-success">${pedido.total.toLocaleString('es-CL')}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado del pedido */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <i className="fas fa-clock text-warning me-3 fs-4"></i>
                  <div>
                    <h5 className="mb-1">
                      Estado del pedido: <span className="badge bg-warning text-dark">En preparación</span>
                    </h5>
                    <p className="mb-0 text-muted">
                      Te notificaremos cuando tu pedido esté listo para entrega.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="text-center">
              <Link to="/catalogo" className="btn btn-success btn-lg me-3">
                <i className="fas fa-shopping-cart me-2"></i>Seguir Comprando
              </Link>
              {isAuthenticated ? (
                <Link to="/perfil" className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-user me-2"></i>Ver Mi Perfil
                </Link>
              ) : (
                <Link to="/registro" className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-user-plus me-2"></i>Crear Cuenta
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
