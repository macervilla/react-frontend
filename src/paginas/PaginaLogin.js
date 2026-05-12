import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ContextoAutenticacion } from '../contextos/ContextoAutenticacion';

function PaginaLogin() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navegar = useNavigate();

  const {
    iniciarSesion: guardarSesion,
    cerrarSesion: limpiarSesion
  } = useContext(ContextoAutenticacion);

  const iniciarSesion = async () => {
    try {
      const res = await api.post('/api/token/', {
        username: usuario,
        password: contrasena
      });

      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);

      guardarSesion(usuario);
      navegar('/clientes');

      alert('Login OK');
    } catch (err) {
      console.log(err.response?.data);
      alert('Usuario o contraseña incorrectos');
    }
  };

  const cerrarSesion = () => {
    limpiarSesion();
    alert('Sesión cerrada');
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />

      <button onClick={iniciarSesion}>
        Iniciar sesión
      </button>

      <button onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default PaginaLogin;