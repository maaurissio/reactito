import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IPedido } from '../../services/pedidosService';

export const Boleta = () => {
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<IPedido | null>(null);

  useEffect(() => {
    // Recuperar datos del pedido para la boleta
    const pedidoGuardado = localStorage.getItem('boletaPedido');
    
    if (!pedidoGuardado) {
      // Si no hay pedido, redirigir al catálogo
      navigate('/catalogo');
      return;
    }

    try {
      const pedidoData = JSON.parse(pedidoGuardado) as IPedido;
      setPedido(pedidoData);
    } catch (error) {
      console.error('Error al parsear pedido:', error);
      navigate('/catalogo');
    }
  }, [navigate]);

  const imprimirBoleta = () => {
    window.print();
  };

  if (!pedido) {
    return null;
  }

  const nombreCompleto = `${pedido.contacto.nombre} ${pedido.contacto.apellido}`;
  const fechaPedido = new Date(pedido.fecha).toLocaleString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header de la boleta */}
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center py-4">
              <h1 className="text-success mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                <i className="fas fa-leaf me-2"></i>
                HuertoHogar
              </h1>
              <h2 className="h4 mb-3">Boleta de Compra</h2>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1"><strong>N° Pedido:</strong> {pedido.id}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Fecha:</strong> {fechaPedido}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información del cliente */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-user me-2"></i>Información del Cliente
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2"><strong>Nombre:</strong> {nombreCompleto}</p>
                  <p className="mb-2"><strong>Email:</strong> {pedido.contacto.email}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2"><strong>Teléfono:</strong> +56 {pedido.contacto.telefono}</p>
                  <p className="mb-2"><strong>Estado:</strong> <span className="badge bg-warning text-dark">{pedido.estado}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Dirección de envío */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-truck me-2"></i>Dirección de Envío
              </h5>
            </div>
            <div className="card-body">
              <p className="mb-2"><strong>Dirección:</strong> {pedido.envio.direccion}</p>
              <p className="mb-2"><strong>Ciudad:</strong> {pedido.envio.ciudad}</p>
              <p className="mb-2"><strong>Región:</strong> {pedido.envio.region}</p>
              {pedido.envio.codigoPostal && (
                <p className="mb-2"><strong>Código Postal:</strong> {pedido.envio.codigoPostal}</p>
              )}
              {pedido.envio.notas && (
                <p className="mb-2"><strong>Notas:</strong> {pedido.envio.notas}</p>
              )}
            </div>
          </div>

          {/* Detalles de la compra */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-shopping-bag me-2"></i>Detalles de la Compra
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Precio Unitario</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.nombre}</td>
                        <td className="text-center">{item.cantidad}</td>
                        <td className="text-end">${item.precio.toLocaleString('es-CL')}</td>
                        <td className="text-end">${item.subtotal.toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-end"><strong>Subtotal:</strong></td>
                      <td className="text-end">${pedido.subtotal.toLocaleString('es-CL')}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-end">
                        <strong>Envío:</strong>
                        {pedido.envio.esGratis && <span className="text-success ms-2">(Gratis)</span>}
                      </td>
                      <td className="text-end">
                        {pedido.envio.esGratis ? (
                          <span className="text-success">$0</span>
                        ) : (
                          `$${pedido.envio.costo.toLocaleString('es-CL')}`
                        )}
                      </td>
                    </tr>
                    <tr className="table-success">
                      <td colSpan={3} className="text-end"><strong className="fs-5">TOTAL:</strong></td>
                      <td className="text-end"><strong className="fs-5">${pedido.total.toLocaleString('es-CL')}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="text-center mb-5 d-print-none">
            <button className="btn btn-success btn-lg me-3" onClick={imprimirBoleta}>
              <i className="fas fa-print me-2"></i>Imprimir Boleta
            </button>
            <button className="btn btn-outline-secondary btn-lg" onClick={() => navigate('/catalogo')}>
              <i className="fas fa-arrow-left me-2"></i>Volver al Catálogo
            </button>
          </div>

          {/* Nota legal */}
          <div className="card shadow-sm d-print-none">
            <div className="card-body text-center text-muted small">
              <p className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Esta boleta es un comprobante de tu compra. Guarda este documento para cualquier consulta o reclamo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos de impresión */}
      <style>{`
        @media print {
          .d-print-none {
            display: none !important;
          }
          body {
            font-size: 12pt;
          }
          .card {
            border: 1px solid #dee2e6 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
          .btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
