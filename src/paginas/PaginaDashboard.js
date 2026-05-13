import { useEffect, useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from '@mui/material';

import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardIcon from '@mui/icons-material/Dashboard';

import api from '../api';

function PaginaDashboard() {

  const [estadisticas, setEstadisticas] = useState({
    clientes: 0,
    roles: 0,
    usuarios: 0
  });

  const cargarDashboard = async () => {

    try {

      const res = await api.get('/api/dashboard/');

      setEstadisticas(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    cargarDashboard();

  }, []);

  return (
    <Box>

      <Typography variant="h4" gutterBottom>
        Panel principal
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <Card>

            <CardContent>

              <PeopleIcon fontSize="large" />

              <Typography variant="h6">
                Clientes
              </Typography>

              <Typography variant="h4">
                {estadisticas.clientes}
              </Typography>

            </CardContent>

          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>

            <CardContent>

              <SecurityIcon fontSize="large" />

              <Typography variant="h6">
                Roles
              </Typography>

              <Typography variant="h4">
                {estadisticas.roles}
              </Typography>

            </CardContent>

          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>

            <CardContent>

              <DashboardIcon fontSize="large" />

              <Typography variant="h6">
                Usuarios
              </Typography>

              <Typography variant="h4">
                {estadisticas.usuarios}
              </Typography>

            </CardContent>

          </Card>
        </Grid>

      </Grid>

    </Box>
  );
}

export default PaginaDashboard;