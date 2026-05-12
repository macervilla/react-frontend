import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ContextoAutenticacion } from '../contextos/ContextoAutenticacion';

function RutaProtegida({ children }) {
  const { usuario } = useContext(ContextoAutenticacion);

  const token = localStorage.getItem('access');

  if (!usuario || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;