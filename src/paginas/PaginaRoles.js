import { useEffect, useState } from 'react';
import api from '../api';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';

function PaginaRoles() {
  const [roles, setRoles] = useState([]);

  const [rol, setRol] = useState({
    nombre: ''
  });

  const [rolEditando, setRolEditando] = useState(null);
  const [modalFormulario, setModalFormulario] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [rolEliminar, setRolEliminar] = useState(null);

  const [notificacion, setNotificacion] = useState({
    abierta: false,
    mensaje: '',
    tipo: 'success'
  });

  const cargarRoles = async () => {
    try {
      const res = await api.get('/api/roles/');
      setRoles(res.data);
    } catch (err) {
      console.log(err.response?.data);

      setNotificacion({
        abierta: true,
        mensaje: 'Error al cargar roles',
        tipo: 'error'
      });
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const limpiarFormulario = () => {
    setRol({
      nombre: ''
    });

    setRolEditando(null);
  };

  const abrirModalNuevoRol = () => {
    limpiarFormulario();
    setModalFormulario(true);
  };

  const cerrarModalFormulario = () => {
    setModalFormulario(false);
    limpiarFormulario();
  };

  const guardarRol = async () => {
    try {
      if (!rol.nombre.trim()) {
        setNotificacion({
          abierta: true,
          mensaje: 'El nombre del rol es obligatorio',
          tipo: 'warning'
        });

        return;
      }

      if (rolEditando) {
        await api.put(`/api/roles/${rolEditando.id}/`, rol);

        setNotificacion({
          abierta: true,
          mensaje: 'Rol actualizado correctamente',
          tipo: 'success'
        });
      } else {
        await api.post('/api/roles/', rol);

        setNotificacion({
          abierta: true,
          mensaje: 'Rol creado correctamente',
          tipo: 'success'
        });
      }

      cerrarModalFormulario();
      cargarRoles();
    } catch (err) {
      console.log(err.response?.data);

      setNotificacion({
        abierta: true,
        mensaje: 'Error al guardar rol',
        tipo: 'error'
      });
    }
  };

  const editarRol = (rolSeleccionado) => {
    setRolEditando(rolSeleccionado);

    setRol({
      nombre: rolSeleccionado.nombre
    });

    setModalFormulario(true);
  };

  const abrirModalEliminar = (rolSeleccionado) => {
    setRolEliminar(rolSeleccionado);
    setModalEliminar(true);
  };

  const cerrarModalEliminar = () => {
    setModalEliminar(false);
    setRolEliminar(null);
  };

  const confirmarEliminarRol = async () => {
    try {
      await api.delete(`/api/roles/${rolEliminar.id}/`);

      setNotificacion({
        abierta: true,
        mensaje: 'Rol eliminado',
        tipo: 'success'
      });

      cerrarModalEliminar();
      cargarRoles();
    } catch (err) {
      console.log(err.response?.data);

      setNotificacion({
        abierta: true,
        mensaje: 'Error al eliminar rol',
        tipo: 'error'
      });
    }
  };

  const columnas = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      flex: 1
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => editarRol(params.row)}
          >
            Editar
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => abrirModalEliminar(params.row)}
          >
            Eliminar
          </Button>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Roles
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={abrirModalNuevoRol}
      >
        Nuevo rol
      </Button>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={roles}
          columns={columnas}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5
              }
            }
          }}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          disableRowSelectionOnClick
        />
      </Paper>

      <Dialog
        open={modalFormulario}
        onClose={cerrarModalFormulario}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {rolEditando ? 'Editar rol' : 'Nuevo rol'}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            sx={{ mt: 1 }}
            value={rol.nombre}
            onChange={(e) =>
              setRol({
                ...rol,
                nombre: e.target.value
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={cerrarModalFormulario}>
            Cancelar
          </Button>

          <Button variant="contained" onClick={guardarRol}>
            {rolEditando ? 'Guardar cambios' : 'Crear rol'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalEliminar} onClose={cerrarModalEliminar}>
        <DialogTitle>
          Eliminar rol
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            ¿Deseás eliminar el rol?
            <br />
            <br />
            <strong>{rolEliminar?.nombre}</strong>
            <br />
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={cerrarModalEliminar}>
            Cancelar
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={confirmarEliminarRol}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notificacion.abierta}
        autoHideDuration={3000}
        onClose={() =>
          setNotificacion({
            ...notificacion,
            abierta: false
          })
        }
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Alert severity={notificacion.tipo} variant="filled">
          {notificacion.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PaginaRoles;