import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarUsuario } from '../../services/usuariosService';
import { Input, Button } from '../../components/ui';
import { RolUsuario } from '../../types';

export const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    usuario: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const nuevoUsuario = registrarUsuario({
        email: formData.email,
        usuario: formData.usuario,
        password: formData.password,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        direccion: formData.direccion,
        rol: RolUsuario.cliente,
        isActivo: 'Activo' as any,
      });

      if (nuevoUsuario) {
        alert('Registro exitoso. Por favor inicia sesión.');
        navigate('/auth/login');
      } else {
        setError('El email o usuario ya están registrados');
      }
    } catch (err) {
      setError('Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Crear Cuenta</h1>
          <p>Únete a HuertoHogar</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-row">
            <Input
              label="Nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <Input
              label="Apellido"
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Nombre de Usuario"
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Input
            label="Teléfono (opcional)"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />

          <Input
            label="Dirección (opcional)"
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/auth/login" className="auth-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
