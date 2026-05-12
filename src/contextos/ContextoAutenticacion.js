import { createContext, useState } from 'react';

export const ContextoAutenticacion = createContext();

function ProveedorAutenticacion({ children }) {

  const [usuario, setUsuario] = useState(
    localStorage.getItem('usuario') || ''
  );

  const iniciarSesion = (nombreUsuario) => {
    localStorage.setItem('usuario', nombreUsuario);
    setUsuario(nombreUsuario);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    setUsuario('');
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        usuario,
        iniciarSesion,
        cerrarSesion
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export default ProveedorAutenticacion;