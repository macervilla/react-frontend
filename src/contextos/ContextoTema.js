import {
  createContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  createTheme,
  ThemeProvider
} from '@mui/material/styles';

export const ContextoTema =
  createContext();

function ProveedorTema({ children }) {

  const modoGuardado =
    localStorage.getItem('modoTema');

  const [modoOscuro, setModoOscuro] =
    useState(
      modoGuardado === 'oscuro'
    );

  useEffect(() => {

    localStorage.setItem(
      'modoTema',
      modoOscuro
        ? 'oscuro'
        : 'claro'
    );

  }, [modoOscuro]);

  const cambiarModo = () => {

    setModoOscuro(!modoOscuro);
  };

  const tema = useMemo(() =>
    createTheme({
      palette: {
        mode:
          modoOscuro
            ? 'dark'
            : 'light'
      }
    }),
    [modoOscuro]
  );

  return (

    <ContextoTema.Provider
      value={{
        modoOscuro,
        cambiarModo
      }}
    >

      <ThemeProvider theme={tema}>
        {children}
      </ThemeProvider>

    </ContextoTema.Provider>
  );
}

export default ProveedorTema;