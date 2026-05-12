import { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import RutaProtegida from './componentes/RutaProtegida';
import { ContextoAutenticacion } from './contextos/ContextoAutenticacion';

import PaginaLogin from './paginas/PaginaLogin';
import PaginaRoles from './paginas/PaginaRoles';
import PaginaClientes from './paginas/PaginaClientes';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { ContextoTema }
from './contextos/ContextoTema';

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';

function App() {
  const {
  modoOscuro,
  cambiarModo
} = useContext(ContextoTema);
  const { usuario } = useContext(ContextoAutenticacion);

  const [menuAbierto, setMenuAbierto] = useState(true);

  const anchoMenu = menuAbierto ? 220 : 70;

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMenuAbierto(!menuAbierto)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6">
              Mi Sistema
            </Typography>

            <Box sx={{ ml: 4 }}>
              Usuario: {usuario || 'No autenticado'}
            </Box>
          </Toolbar>
          <IconButton
  color="inherit"
  onClick={cambiarModo}
>

  {modoOscuro
    ? <LightModeIcon />
    : <DarkModeIcon />
  }

</IconButton>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: anchoMenu,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: anchoMenu,
              boxSizing: 'border-box',
              transition: 'width 0.3s'
            }
          }}
        >
          <Toolbar />

          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/">
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>

                  {menuAbierto && (
                    <ListItemText primary="Login" />
                  )}
                </ListItemButton>
              </ListItem>

              {usuario && (
                <>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/roles">
                      <ListItemIcon>
                        <SecurityIcon />
                      </ListItemIcon>

                      {menuAbierto && (
                        <ListItemText primary="Roles" />
                      )}
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/clientes">
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>

                      {menuAbierto && (
                        <ListItemText primary="Clientes" />
                      )}
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3
          }}
        >
          <Toolbar />

          <Routes>
            <Route path="/" element={<PaginaLogin />} />

            <Route
              path="/roles"
              element={
                <RutaProtegida>
                  <PaginaRoles />
                </RutaProtegida>
              }
            />

            <Route
              path="/clientes"
              element={
                <RutaProtegida>
                  <PaginaClientes />
                </RutaProtegida>
              }
            />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;