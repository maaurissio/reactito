import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useProductsStore } from '../../store/productsStore';
import { crearPedido } from '../../services/pedidosService';
import { calcularCostoEnvio } from '../../services/shippingConfigService';
import { Estado } from '../../types/models';
import { SelectModerno } from '../../components/ui';

interface RegionCiudades {
  [key: string]: string[];
}

const ciudadesPorRegion: RegionCiudades = {
  'arica-parinacota': ['Arica', 'Putre', 'Camarones'],
  'tarapaca': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica'],
  'antofagasta': ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones', 'Taltal'],
  'atacama': ['Copiapó', 'Vallenar', 'Caldera', 'Chañaral', 'Diego de Almagro'],
  'coquimbo': ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Vicuña'],
  'valparaiso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Quillota', 'Los Andes', 'Limache'],
  'metropolitana': ['Santiago', 'Puente Alto', 'Maipú', 'Las Condes', 'La Florida', 'Ñuñoa', 'Providencia', 'Vitacura', 'San Bernardo', 'Quilicura'],
  'ohiggins': ['Rancagua', 'Machalí', 'Graneros', 'San Fernando', 'Rengo', 'Pichilemu'],
  'maule': ['Talca', 'Curicó', 'Linares', 'Molina', 'Constitución', 'Cauquenes'],
  'nuble': ['Chillán', 'San Carlos', 'Bulnes', 'Quirihue'],
  'bio-bio': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chiguayante', 'San Pedro de la Paz', 'Coronel', 'Tomé'],
  'araucania': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol', 'Victoria'],
  'los-rios': ['Valdivia', 'La Unión', 'Río Bueno', 'Panguipulli'],
  'los-lagos': ['Puerto Montt', 'Castro', 'Osorno', 'Puerto Varas', 'Ancud', 'Frutillar'],
  'aysen': ['Coyhaique', 'Puerto Aysén', 'Chile Chico'],
  'magallanes': ['Punta Arenas', 'Puerto Natales', 'Porvenir']
};

// Opciones para el select de regiones
const regionesOptions = [
  { value: 'arica-parinacota', label: 'Arica y Parinacota' },
  { value: 'tarapaca', label: 'Tarapacá' },
  { value: 'antofagasta', label: 'Antofagasta' },
  { value: 'atacama', label: 'Atacama' },
  { value: 'coquimbo', label: 'Coquimbo' },
  { value: 'valparaiso', label: 'Valparaíso' },
  { value: 'metropolitana', label: 'Región Metropolitana' },
  { value: 'ohiggins', label: "O'Higgins" },
  { value: 'maule', label: 'Maule' },
  { value: 'nuble', label: 'Ñuble' },
  { value: 'bio-bio', label: 'Biobío' },
  { value: 'araucania', label: 'La Araucanía' },
  { value: 'los-rios', label: 'Los Ríos' },
  { value: 'los-lagos', label: 'Los Lagos' },
  { value: 'aysen', label: 'Aysén' },
  { value: 'magallanes', label: 'Magallanes' }
];

export const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { items, total, limpiarCarrito } = useCartStore();
  const { actualizarStock } = useProductsStore();
  
  const [paso, setPaso] = useState<'tipo' | 'formulario'>('tipo');
  
  // Datos del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [region, setRegion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [notas, setNotas] = useState('');
  
  const [procesando, setProcesando] = useState(false);
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<string[]>([]);

  // Preparar opciones de ciudades para el select moderno
  const ciudadesOptions = ciudadesDisponibles.map(ciudad => ({
    value: ciudad.toLowerCase().replace(/\s+/g, '-'),
    label: ciudad
  }));

  // Estados para notificación toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Scroll al inicio cuando se monta el componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Verificar si hay items en el carrito
    if (items.length === 0) {
      navigate('/catalogo');
      return;
    }

    // Pre-llenar datos si el usuario está autenticado
    if (isAuthenticated && user) {
      const nombres = user.nombre?.split(' ') || [];
      setNombre(nombres[0] || '');
      setApellido(user.apellido || nombres.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setTelefono(user.telefono || '');
      setDireccion(user.direccion || '');
    }
  }, [items.length, navigate, isAuthenticated, user]);

  useEffect(() => {
    // Actualizar ciudades cuando cambia la región
    if (region && ciudadesPorRegion[region]) {
      setCiudadesDisponibles(ciudadesPorRegion[region]);
      setCiudad(''); // Resetear ciudad al cambiar región
    } else {
      setCiudadesDisponibles([]);
    }
  }, [region]);

  const calcularCostoEnvioActual = () => {
    return calcularCostoEnvio(total);
  };

  const calcularTotal = () => {
    return total + calcularCostoEnvioActual();
  };

  // Función para mostrar notificación toast
  const mostrarToast = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToastMessage(mensaje);
    setToastType(tipo);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const seleccionarTipo = (_tipo: 'user' | 'guest' | 'register') => {
    setPaso('formulario');
  };

  const validarFormulario = (): boolean => {
    if (!nombre || !apellido || !email || !telefono) {
      mostrarToast('Por favor completa todos los campos obligatorios de contacto', 'error');
      return false;
    }

    if (!direccion || !region || !ciudad) {
      mostrarToast('Por favor completa todos los campos obligatorios de envío', 'error');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarToast('Por favor ingresa un email válido', 'error');
      return false;
    }

    // Validar teléfono (9 dígitos)
    if (telefono.length !== 9 || !/^\d{9}$/.test(telefono)) {
      mostrarToast('El teléfono debe tener exactamente 9 dígitos', 'error');
      return false;
    }

    return true;
  };

  const procesarPedido = async () => {
    console.log('=== INICIANDO PROCESO DE PEDIDO ===');
    
    if (!validarFormulario()) {
      console.log('Validación del formulario falló');
      return;
    }

    console.log('Formulario válido, procesando...');
    setProcesando(true);

    try {
      // Simular delay para UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Crear pedido
      const itemsPedido = items.map(item => ({
        id: item.producto.id,
        nombre: item.producto.nombre,
        precio: item.producto.precio,
        cantidad: item.cantidad,
        subtotal: item.subtotal
      }));

      console.log('Items del pedido:', itemsPedido);

      const costoEnvio = calcularCostoEnvioActual();
      const totalFinal = calcularTotal();

      console.log('Costos - Envío:', costoEnvio, 'Total:', totalFinal);

      const resultado = crearPedido(
        user ? { ...user, password: '', isActivo: Estado.activo } : null,
        {
          nombre,
          apellido,
          email,
          telefono
        },
        {
          direccion,
          ciudad,
          region,
          codigoPostal,
          notas,
          costo: costoEnvio,
          esGratis: costoEnvio === 0
        },
        itemsPedido,
        total,
        costoEnvio,
        totalFinal
      );

      console.log('Resultado de crearPedido:', resultado);

      if (resultado.success && resultado.pedido) {
        console.log('Pedido creado exitosamente:', resultado.pedido.id);
        
        // Actualizar stock de productos
        for (const item of items) {
          const nuevoStock = Math.max(0, item.producto.stock - item.cantidad);
          actualizarStock(item.producto.id, nuevoStock);
          console.log(`Stock actualizado para ${item.producto.nombre}: ${nuevoStock}`);
        }

        // Guardar pedido para la página de confirmación
        localStorage.setItem('ultimoPedido', JSON.stringify(resultado.pedido));
        console.log('Pedido guardado en localStorage');

        // Limpiar carrito
        limpiarCarrito();
        console.log('Carrito limpiado');

        // Redirigir a página de éxito
        console.log('Intentando navegar a /compra-exitosa...');
        
        // Usar setTimeout para asegurar que el navegador procesa la navegación
        setTimeout(() => {
          console.log('Ejecutando navigate...');
          navigate('/compra-exitosa', { replace: true });
          console.log('Navigate ejecutado');
        }, 100);
      } else {
        console.error('Error: resultado.success es false o no hay pedido');
        mostrarToast('Error al procesar el pedido. Por favor intenta nuevamente.', 'error');
        setProcesando(false);
      }
    } catch (error) {
      console.error('Error procesando pedido:', error);
      mostrarToast('Error al procesar el pedido. Por favor intenta nuevamente.', 'error');
      setProcesando(false);
    }
  };

  const volver = () => {
    setPaso('tipo');
  };

  return (
    <div className="checkout-page bg-light" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <section className="bg-success text-white py-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="mb-0" style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff' }}>
                <i className="fas fa-shopping-cart me-2"></i>Finalizar Compra
              </h2>
              <p className="mb-0 mt-1 small">Completa tu pedido de productos frescos y naturales</p>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex align-items-center justify-content-end">
                <i className="fas fa-lock me-2"></i>
                <span className="small">Compra segura</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-3">
        <div className="container">
          <div className="row g-3">
            {/* Columna izquierda - Formularios */}
            <div className="col-lg-8">
              
              {/* Paso 1: Tipo de compra */}
              {paso === 'tipo' && (
                <div className="card shadow-sm mb-3">
                  <div className="card-header bg-light py-2">
                    <h5 className="mb-0">
                      <i className="fas fa-user-circle me-2 text-success"></i>
                      Paso 1: ¿Cómo deseas realizar tu compra?
                    </h5>
                  </div>
                  <div className="card-body p-3">
                    
                    {/* Usuario logueado */}
                    {isAuthenticated ? (
                      <div>
                        <div className="card border-success bg-light">
                          <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                              <i className="fas fa-check-circle text-success me-3 fs-5"></i>
                              <div>
                                <h6 className="mb-1 text-success">¡Perfecto! Ya tienes una cuenta</h6>
                                <p className="mb-0 small text-muted">
                                  Continúa con tus datos guardados: <span className="fw-bold text-dark">{user?.email}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="btn btn-success mt-3" onClick={() => seleccionarTipo('user')}>
                          <i className="fas fa-arrow-right me-2"></i>Continuar como usuario registrado
                        </button>
                      </div>
                    ) : (
                      // Usuario no logueado
                      <div>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div 
                              className="card h-100 border-2 checkout-option" 
                              onClick={() => seleccionarTipo('guest')}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="card-body text-center">
                                <i className="fas fa-user-clock display-4 text-success mb-3"></i>
                                <h6 className="card-title">Comprar como invitado</h6>
                                <p className="card-text small text-muted">
                                  Realiza tu compra rápidamente sin crear una cuenta
                                </p>
                                <ul className="list-unstyled small text-muted">
                                  <li><i className="fas fa-check text-success me-2"></i>Proceso rápido</li>
                                  <li><i className="fas fa-check text-success me-2"></i>Sin registro necesario</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div 
                              className="card h-100 border-2 checkout-option" 
                              onClick={() => seleccionarTipo('register')}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="card-body text-center">
                                <i className="fas fa-user-plus display-4 text-success mb-3"></i>
                                <h6 className="card-title">Crear cuenta nueva</h6>
                                <p className="card-text small text-muted">
                                  Crea una cuenta para guardar tus datos y pedidos
                                </p>
                                <ul className="list-unstyled small text-muted">
                                  <li><i className="fas fa-check text-success me-2"></i>Historial de pedidos</li>
                                  <li><i className="fas fa-check text-success me-2"></i>Datos guardados</li>
                                  <li><i className="fas fa-check text-success me-2"></i>Ofertas exclusivas</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-center">
                          <p className="small text-muted">
                            ¿Ya tienes cuenta?{' '}
                            <a href="/login" className="text-success text-decoration-none">
                              <i className="fas fa-sign-in-alt me-1"></i>Inicia sesión aquí
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Paso 2: Formulario de contacto y envío */}
              {paso === 'formulario' && (
                <div className="card shadow-sm mb-3">
                  <div className="card-header bg-light py-2">
                    <h5 className="mb-0">
                      <i className="fas fa-address-card me-2 text-success"></i>
                      Paso 2: Datos de contacto y envío
                    </h5>
                  </div>
                  <div className="card-body p-3">
                    <form onSubmit={(e) => { e.preventDefault(); procesarPedido(); }}>
                      <div className="row g-2">
                        {/* Datos personales */}
                        <div className="col-12 mt-2">
                          <h6 className="text-success mb-2">
                            <i className="fas fa-user me-2"></i>Información personal
                          </h6>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="nombre" className="form-label">Nombre *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="apellido" className="form-label">Apellido *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label">Correo electrónico *</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="telefono" className="form-label">Teléfono *</label>
                          <div className="input-group">
                            <span className="input-group-text bg-success text-white">+56</span>
                            <input
                              type="tel"
                              className="form-control"
                              id="telefono"
                              placeholder="912345678"
                              maxLength={9}
                              value={telefono}
                              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 9))}
                              required
                            />
                          </div>
                          <small className="form-text text-muted">Ingresa 9 dígitos (ej: 912345678)</small>
                        </div>

                        {/* Datos de envío */}
                        <div className="col-12 mt-2">
                          <h6 className="text-success mb-2">
                            <i className="fas fa-truck me-2"></i>Dirección de envío
                          </h6>
                        </div>
                        <div className="col-12">
                          <label htmlFor="direccion" className="form-label">Dirección completa *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="direccion"
                            placeholder="Calle, número, piso, departamento"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <SelectModerno
                            label="Región"
                            value={region}
                            onChange={setRegion}
                            options={regionesOptions}
                            placeholder="Seleccionar región"
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <SelectModerno
                            label="Ciudad"
                            value={ciudad}
                            onChange={setCiudad}
                            options={ciudadesOptions}
                            placeholder={region ? 'Selecciona tu ciudad' : 'Primero selecciona una región'}
                            disabled={!region}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="codigoPostal" className="form-label">Código postal</label>
                          <input
                            type="text"
                            className="form-control"
                            id="codigoPostal"
                            value={codigoPostal}
                            onChange={(e) => setCodigoPostal(e.target.value)}
                          />
                        </div>

                        {/* Notas adicionales */}
                        <div className="col-12">
                          <label htmlFor="notas" className="form-label">Notas de entrega (opcional)</label>
                          <textarea
                            className="form-control"
                            id="notas"
                            rows={3}
                            placeholder="Instrucciones especiales para la entrega..."
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <button type="submit" className="btn btn-success btn-lg" disabled={procesando}>
                          {procesando ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>Procesando pedido...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-credit-card me-2"></i>Continuar al pago
                            </>
                          )}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary btn-lg ms-2" 
                          onClick={volver}
                          disabled={procesando}
                        >
                          <i className="fas fa-arrow-left me-2"></i>Volver
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Columna derecha - Resumen del pedido */}
            <div className="col-lg-4">
              <div className="card shadow-sm" style={{ overflow: 'hidden' }}>
                <div className="card-header bg-white border-bottom p-3">
                  <h5 className="mb-0 text-success">
                    <i className="fas fa-receipt me-2"></i>Resumen del pedido
                  </h5>
                </div>
                <div className="card-body p-3" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {items.map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div className="flex-grow-1">
                        <h6 className="mb-0 small">{item.producto.nombre}</h6>
                        <small className="text-muted">
                          {item.cantidad} x ${item.producto.precio.toLocaleString('es-CL')}
                        </small>
                      </div>
                      <div className="text-end">
                        <strong className="small">${item.subtotal.toLocaleString('es-CL')}</strong>
                      </div>
                    </div>
                  ))}

                  {/* Envío */}
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <div className="flex-grow-1">
                      <h6 className={`mb-0 small ${calcularCostoEnvioActual() === 0 ? 'text-success' : 'text-dark'}`}>
                        <i className="fas fa-truck me-1"></i>Envío
                      </h6>
                      <small className="text-muted">
                        {calcularCostoEnvioActual() === 0 ? 'Envío gratis' : 'Costo de envío'}
                      </small>
                    </div>
                    <div className="text-end">
                      {calcularCostoEnvioActual() === 0 ? (
                        <strong className="small text-success">Gratis</strong>
                      ) : (
                        <strong className="small">${calcularCostoEnvioActual().toLocaleString('es-CL')}</strong>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-light py-3 px-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-success">Total a pagar:</strong>
                    <strong className="fs-5 text-success">${calcularTotal().toLocaleString('es-CL')}</strong>
                  </div>
                  <small className="text-muted d-flex align-items-center">
                    <i className="fas fa-shield-alt me-1"></i>Compra segura y protegida
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notificación Toast */}
      {showToast && (
        <div 
          style={{ 
            position: 'fixed', 
            top: '20px', 
            right: '20px', 
            zIndex: 9999, 
            minWidth: '300px', 
            maxWidth: '400px', 
            animation: 'slideInRight 0.3s ease-out' 
          }}
        >
          <div className={`card shadow-lg border-0 border-start border-${toastType === 'error' ? 'danger' : 'success'} border-4`}>
            <div className="card-body p-3 d-flex align-items-center">
              <i className={`fas fa-${toastType === 'error' ? 'exclamation-circle text-danger' : 'check-circle text-success'} me-3`} style={{ fontSize: '2rem' }}></i>
              <div className="flex-grow-1">
                <h6 className="mb-0">{toastMessage}</h6>
              </div>
              <button 
                className="btn-close ms-2" 
                onClick={() => setShowToast(false)}
                aria-label="Cerrar"
              ></button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
