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
      <div className="container my-5 text-center py-5">
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando información del pedido...</p>
      </div>
    );
  }

  const nombreCompleto = `${pedido.contacto.nombre} ${pedido.contacto.apellido}`;

  return (
    <div className="compra-exitosa-page">
      {/* Hero Section - Confirmación */}
      <section className="position-relative overflow-hidden py-4" style={{ 
        background: 'linear-gradient(135deg, #2f9e44 0%, #2b8a3e 100%)'
      }}>
        <div className="container text-center text-white">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Icono de éxito animado */}
              <div className="mb-3" style={{ animation: 'scaleIn 0.5s ease-out' }}>
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white"
                     style={{ width: '80px', height: '80px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                  <i className="fas fa-check text-success" style={{ fontSize: '2.5rem' }}></i>
                </div>
              </div>

              <h1 className="display-4 fw-bold mb-3 text-white" style={{ 
                fontFamily: "'Playfair Display', serif",
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '-0.02em'
              }}>
                ¡Compra Exitosa!
              </h1>
              
              <p className="lead mb-3" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Gracias por confiar en <strong>HuertoHogar</strong>. Tu pedido está siendo procesado.
              </p>

              <div className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill" 
                   style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                <i className="fas fa-envelope"></i>
                <span>Recibirás una confirmación en tu correo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-4" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              
              {/* Card de Resumen del Pedido */}
              <div className="card border-0 shadow-sm mb-3" style={{ 
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                <div className="card-header border-0 py-3" style={{ 
                  background: 'linear-gradient(135deg, #f8fffe 0%, #f0f9f5 100%)'
                }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748', fontSize: '1.4rem' }}>
                        <i className="fas fa-receipt text-success me-2"></i>
                        Resumen del Pedido
                      </h4>
                      <small className="text-muted">
                        <i className="fas fa-calendar-alt me-1"></i>
                        {new Date(pedido.fecha).toLocaleDateString('es-CL', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </small>
                    </div>
                    <span className="badge bg-success px-3 py-2" style={{ fontSize: '0.85rem' }}>
                      Pedido #{pedido.id}
                    </span>
                  </div>
                </div>

                <div className="card-body p-3">
                  {/* Información del Cliente */}
                  <div className="row mb-3 pb-3 border-bottom">
                    <div className="col-md-6 mb-2 mb-md-0">
                      <div className="d-flex align-items-start">
                        <div className="me-2">
                          <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                               style={{ width: '40px', height: '40px' }}>
                            <i className="fas fa-user text-success" style={{ fontSize: '0.9rem' }}></i>
                          </div>
                        </div>
                        <div>
                          <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>Cliente</small>
                          <p className="mb-0 fw-semibold" style={{ fontSize: '0.95rem' }}>{nombreCompleto}</p>
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            <i className="fas fa-envelope me-1"></i>
                            {pedido.contacto.email}
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <div className="me-2">
                          <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                               style={{ width: '40px', height: '40px' }}>
                            <i className="fas fa-map-marker-alt text-success" style={{ fontSize: '0.9rem' }}></i>
                          </div>
                        </div>
                        <div>
                          <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>Dirección de Envío</small>
                          <p className="mb-0 fw-semibold" style={{ fontSize: '0.95rem' }}>{pedido.envio.direccion}</p>
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {pedido.envio.ciudad}, {pedido.envio.region}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Productos */}
                  <h5 className="mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748', fontSize: '1.2rem' }}>
                    Productos Solicitados
                  </h5>
                  
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                          <th className="border-0 py-2" style={{ fontSize: '0.85rem' }}>Producto</th>
                          <th className="border-0 py-2 text-center" style={{ fontSize: '0.85rem' }}>Cantidad</th>
                          <th className="border-0 py-2 text-end" style={{ fontSize: '0.85rem' }}>Precio Unit.</th>
                          <th className="border-0 py-2 text-end" style={{ fontSize: '0.85rem' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedido.items.map((item, index) => (
                          <tr key={item.id} style={{ borderBottom: index === pedido.items.length - 1 ? 'none' : '1px solid #e9ecef' }}>
                            <td className="py-2">
                              <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2"
                                     style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                                  <i className="fas fa-leaf text-success" style={{ fontSize: '0.8rem' }}></i>
                                </div>
                                <div>
                                  <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{item.nombre}</div>
                                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>Producto orgánico</small>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 text-center">
                              <span className="badge bg-light text-dark px-2 py-1" style={{ fontSize: '0.8rem' }}>
                                {item.cantidad}
                              </span>
                            </td>
                            <td className="py-2 text-end text-muted" style={{ fontSize: '0.85rem' }}>
                              ${item.precio.toLocaleString('es-CL')}
                            </td>
                            <td className="py-2 text-end">
                              <strong className="text-success" style={{ fontSize: '0.9rem' }}>
                                ${item.subtotal.toLocaleString('es-CL')}
                              </strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totales */}
                  <div className="row mt-3 pt-3 border-top">
                    <div className="col-md-6 offset-md-6">
                      <div className="d-flex justify-content-between mb-1 pb-1" style={{ fontSize: '0.9rem' }}>
                        <span className="text-muted">Subtotal:</span>
                        <span className="fw-semibold">${pedido.subtotal.toLocaleString('es-CL')}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 pb-2 border-bottom" style={{ fontSize: '0.9rem' }}>
                        <span className="text-muted">Costo de Envío:</span>
                        {pedido.envio.esGratis ? (
                          <span className="badge bg-success" style={{ fontSize: '0.75rem' }}>¡Gratis!</span>
                        ) : (
                          <span className="fw-semibold">${pedido.envio.costo.toLocaleString('es-CL')}</span>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>Total:</h5>
                        <h4 className="mb-0 text-success fw-bold" style={{ fontSize: '1.4rem' }}>
                          ${pedido.total.toLocaleString('es-CL')}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado del Pedido */}
              <div className="card border-0 shadow-sm mb-3" style={{ 
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
                borderLeft: '4px solid #ffc107'
              }}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <div className="bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center"
                           style={{ width: '52px', height: '52px' }}>
                        <i className="fas fa-clock text-warning" style={{ fontSize: '1.4rem' }}></i>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748', fontSize: '1.1rem' }}>
                        Estado del Pedido
                      </h5>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-warning text-dark px-2 py-1" style={{ fontSize: '0.85rem' }}>
                          En Preparación
                        </span>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>• Tiempo estimado: 24-48 horas</small>
                      </div>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-info-circle me-1"></i>
                        Te notificaremos por correo cuando tu pedido esté listo para entrega
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="text-center mt-4">
                <Link 
                  to="/catalogo" 
                  className="btn btn-success btn-lg px-4 py-2 rounded-pill me-2 mb-2 mb-md-0"
                  style={{ 
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 15px rgba(47, 158, 68, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(47, 158, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(47, 158, 68, 0.3)';
                  }}
                >
                  <i className="fas fa-shopping-basket me-2"></i>
                  Seguir Comprando
                </Link>

                {isAuthenticated ? (
                  <Link 
                    to="/perfil" 
                    className="btn btn-outline-success btn-lg px-4 py-2 rounded-pill"
                    style={{ fontWeight: '600', fontSize: '0.95rem' }}
                  >
                    <i className="fas fa-user-circle me-2"></i>
                    Ver Mis Pedidos
                  </Link>
                ) : (
                  <Link 
                    to="/registro" 
                    className="btn btn-outline-success btn-lg px-4 py-2 rounded-pill"
                    style={{ fontWeight: '600', fontSize: '0.95rem' }}
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Crear Cuenta
                  </Link>
                )}
              </div>

              {/* Mensaje de agradecimiento */}
              <div className="text-center mt-4 py-3">
                <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
                  <i className="fas fa-heart text-danger me-2"></i>
                  Gracias por apoyar la agricultura local y sostenible
                </p>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                  ¿Tienes preguntas? <Link to="/nosotros" className="text-success">Contáctanos</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animaciones CSS */}
      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
