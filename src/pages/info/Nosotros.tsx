import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuthStore } from '../../store';

// Fix para los iconos de Leaflet en producción
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Location {
  name: string;
  coords: [number, number];
  type: 'principal' | 'secundaria';
  address: string;
}

export const Nosotros = () => {
  const { user } = useAuthStore();

  // Coordenadas de Chile (centro del mapa)
  const chileCenter: [number, number] = [-35.6751, -71.5430];

  // Definir ubicaciones de HuertoHogar
  const locations: Location[] = [
    {
      name: "Santiago - Centro de distribución principal",
      coords: [-33.4489, -70.6693],
      type: "principal",
      address: "Centro de distribución principal"
    },
    {
      name: "Viña del Mar - Región de Valparaíso",
      coords: [-33.0245, -71.5518],
      type: "secundaria",
      address: "Región de Valparaíso"
    },
    {
      name: "Valparaíso - Puerto principal",
      coords: [-33.0472, -71.6127],
      type: "secundaria",
      address: "Puerto principal"
    },
    {
      name: "Concepción - Región del Biobío",
      coords: [-36.8201, -73.0444],
      type: "secundaria",
      address: "Región del Biobío"
    },
    {
      name: "Villarica - Región de la Araucanía",
      coords: [-39.2857, -72.2279],
      type: "secundaria",
      address: "Región de la Araucanía"
    },
    {
      name: "Puerto Montt - Región de Los Lagos",
      coords: [-41.4687, -72.9429],
      type: "secundaria",
      address: "Región de Los Lagos"
    }
  ];

  // Scroll to top al montar el componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="nosotros-page">
      {/* Hero Section - Con fondo verde translúcido */}
      <section className="hero-with-image">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="row justify-content-center text-center hero-content">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3 text-white title-spacing">
                Nosotros
              </h1>
              <p className="lead mb-4 text-white">
                Conectamos el campo chileno con tu hogar desde hace más de 6 años
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="pe-lg-5">
                <h2 className="h3 mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
                  Nuestra Historia
                </h2>
                <p className="text-muted mb-4 lh-lg">
                  HuertoHogar nació con una visión simple pero poderosa: llevar la frescura y calidad
                  de los productos del campo directamente a tu mesa.
                </p>
                <p className="text-muted mb-4 lh-lg">
                  Durante más de 6 años, hemos operado en 9 puntos estratégicos de Chile,
                  desde Santiago hasta Puerto Montt, construyendo puentes entre agricultores
                  locales y familias que valoran la alimentación saludable.
                </p>
                <div className="d-flex align-items-center">
                  <div className="me-4">
                    <div className="fw-bold h4 text-success mb-0">6+</div>
                    <small className="text-muted">Años de experiencia</small>
                  </div>
                  <div className="me-4">
                    <div className="fw-bold h4 text-success mb-0">9</div>
                    <small className="text-muted">Ubicaciones</small>
                  </div>
                  <div>
                    <div className="fw-bold h4 text-success mb-0">1000+</div>
                    <small className="text-muted">Familias satisfechas</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <img 
                  src="/img/vegetales1.webp" 
                  className="img-fluid rounded-3 shadow-sm"
                  alt="Historia de Huerto Hogar" 
                  style={{ borderRadius: '20px' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-success bg-opacity-10 rounded-3">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión - Minimalista */}
      <section className="py-5" style={{ backgroundColor: '#fafafa' }}>
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="h-100 p-5 bg-white rounded-3 shadow-sm">
                <div className="d-flex align-items-center mb-4">
                  <div className="me-3">
                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '60px', height: '60px' }}>
                      <i className="fas fa-bullseye text-success fs-4"></i>
                    </div>
                  </div>
                  <h3 className="h4 mb-0" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
                    Misión
                  </h3>
                </div>
                <p className="text-muted lh-lg mb-0">
                  Proporcionar productos frescos y de calidad directamente desde el campo,
                  garantizando frescura en cada entrega y fomentando la conexión entre
                  consumidores y agricultores locales.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="h-100 p-5 bg-white rounded-3 shadow-sm">
                <div className="d-flex align-items-center mb-4">
                  <div className="me-3">
                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '60px', height: '60px' }}>
                      <i className="fas fa-eye text-success fs-4"></i>
                    </div>
                  </div>
                  <h3 className="h4 mb-0" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
                    Visión
                  </h3>
                </div>
                <p className="text-muted lh-lg mb-0">
                  Ser la tienda online líder en distribución de productos frescos en Chile,
                  reconocida por nuestra calidad excepcional y compromiso con la sostenibilidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores - Minimalista */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h3" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
              Nuestros Valores
            </h2>
            <p className="text-muted">Los principios que guían nuestro trabajo diario</p>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100">
                <div className="mb-3">
                  <i className="fas fa-leaf text-success fs-1 opacity-75"></i>
                </div>
                <h5 className="fw-semibold mb-3">Sostenibilidad</h5>
                <p className="text-muted small lh-lg">
                  Promovemos prácticas agrícolas responsables con el medio ambiente
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100">
                <div className="mb-3">
                  <i className="fas fa-gem text-success fs-1 opacity-75"></i>
                </div>
                <h5 className="fw-semibold mb-3">Calidad</h5>
                <p className="text-muted small lh-lg">
                  Garantizamos productos frescos y de la más alta calidad
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100">
                <div className="mb-3">
                  <i className="fas fa-handshake text-success fs-1 opacity-75"></i>
                </div>
                <h5 className="fw-semibold mb-3">Confianza</h5>
                <p className="text-muted small lh-lg">
                  Construimos relaciones duraderas basadas en la transparencia
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100">
                <div className="mb-3">
                  <i className="fas fa-shipping-fast text-success fs-1 opacity-75"></i>
                </div>
                <h5 className="fw-semibold mb-3">Eficiencia</h5>
                <p className="text-muted small lh-lg">
                  Entregamos tus productos frescos en tiempo récord
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa Interactivo */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h3" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
              Nuestras Ubicaciones
            </h2>
            <p className="text-muted">Presentes en las principales ciudades de Chile</p>
          </div>

          {/* Contenedor del Mapa */}
          <div className="map-container mb-5">
            <MapContainer 
              center={chileCenter} 
              zoom={5} 
              style={{ height: '500px', borderRadius: '15px', overflow: 'hidden' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locations.map((location, index) => (
                <Marker key={index} position={location.coords}>
                  <Popup>
                    <div className="text-center">
                      <h6 className="text-success mb-2 fw-bold">{location.name}</h6>
                      <p className="text-muted mb-2 small">{location.address}</p>
                      <span className={`badge bg-${location.type === 'principal' ? 'success' : 'secondary'}`}>
                        {location.type === 'principal' ? 'Sede Principal' : 'Sucursal'}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Información adicional debajo del mapa */}
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                <h5 className="fw-semibold mb-3 text-success">Región Metropolitana</h5>
                <div className="mb-3">
                  <div className="d-flex align-items-start mb-2">
                    <i className="fas fa-map-marker-alt text-success me-2 mt-1"></i>
                    <div>
                      <div className="fw-medium">Santiago</div>
                      <small className="text-muted">Centro de distribución principal</small>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-start mb-2">
                    <i className="fas fa-map-marker-alt text-success me-2 mt-1"></i>
                    <div>
                      <div className="fw-medium">Viña del Mar</div>
                      <small className="text-muted">Región de Valparaíso</small>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="d-flex align-items-start">
                    <i className="fas fa-map-marker-alt text-success me-2 mt-1"></i>
                    <div>
                      <div className="fw-medium">Valparaíso</div>
                      <small className="text-muted">Puerto principal</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                <h5 className="fw-semibold mb-3 text-success">Zona Sur</h5>
                <div className="mb-3">
                  <div className="d-flex align-items-start mb-2">
                    <i className="fas fa-map-marker-alt text-success me-2 mt-1"></i>
                    <div>
                      <div className="fw-medium">Concepción</div>
                      <small className="text-muted">Región del Biobío</small>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-start mb-2">
                    <i className="fas fa-map-marker-alt text-success me-2 mt-1"></i>
                    <div>
                      <div className="fw-medium">Villarica</div>
                      <small className="text-muted">Región de la Araucanía</small>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="d-flex align-items-start">
                    <i className="fas fa-map-marker-alt text-success me-2 mt-1"></i>
                    <div>
                      <div className="fw-medium">Puerto Montt</div>
                      <small className="text-muted">Región de Los Lagos</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 shadow-sm h-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <i className="fas fa-map text-success fs-1 opacity-75 mb-3"></i>
                  <h6 className="fw-semibold mb-2">¿Tu ciudad no está?</h6>
                  <p className="text-muted small mb-3">Pronto llegaremos a más ubicaciones</p>
                  <Link to="/catalogo" className="btn btn-outline-success btn-sm">
                    Ver cobertura
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Minimalista */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center">
                <h2 className="h3 mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
                  ¿Listo para experimentar la diferencia?
                </h2>
                <p className="text-muted mb-4 lh-lg">
                  Únete a miles de familias que ya disfrutan de productos frescos y naturales
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  {user ? (
                    <>
                      <Link to="/catalogo" className="btn btn-success px-4 py-2">
                        <i className="fas fa-shopping-basket me-2"></i>
                        Ver Catálogo
                      </Link>
                      <Link to="/perfil" className="btn btn-outline-success px-4 py-2">
                        <i className="fas fa-user me-2"></i>
                        Mi Perfil
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/catalogo" className="btn btn-success px-4 py-2">
                        <i className="fas fa-shopping-basket me-2"></i>
                        Ver Catálogo
                      </Link>
                      <Link to="/registro" className="btn btn-outline-success px-4 py-2">
                        <i className="fas fa-user-plus me-2"></i>
                        Crear Cuenta
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
