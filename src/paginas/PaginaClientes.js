import { useEffect, useState } from 'react';
import api from '../api';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Paper,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';

function PaginaClientes() {
  const [clientes, setClientes] = useState([]);

  const [clienteEditando, setClienteEditando] = useState(null);
  const [modalFormulario, setModalFormulario] = useState(false);

  const [cliente, setCliente] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    email: '',
    activo: true
  });

  const [notificacion, setNotificacion] = useState({
    abierta: false,
    mensaje: '',
    tipo: 'success'
  });

  const [modalEliminar, setModalEliminar] = useState(false);
  const [clienteEliminar, setClienteEliminar] = useState(null);

  const columnas = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'apellido', headerName: 'Apellido', flex: 1 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'documento', headerName: 'Documento', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'activo',
      headerName: 'Activo',
      width: 120,
      renderCell: (params) => (params.value ? 'Sí' : 'No')
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
            onClick={() => editarCliente(params.row)}
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

  const cargarClientes = async () => {

  try {

    const res = await api.get('/api/clientes/');

    setClientes(res.data);

  } catch (err) {

    console.log(err.response?.data);

    setNotificacion({
      abierta: true,
      mensaje: 'Error al cargar clientes',
      tipo: 'error'
    });
  }
};

useEffect(() => {
  cargarClientes();
}, []);

  const limpiarFormulario = () => {
    setCliente({
      nombre: '',
      apellido: '',
      documento: '',
      email: '',
      activo: true
    });

    setClienteEditando(null);
  };

  const abrirModalNuevoCliente = () => {
    limpiarFormulario();
    setModalFormulario(true);
  };

  const cerrarModalFormulario = () => {
    setModalFormulario(false);
    limpiarFormulario();
  };

  const guardarCliente = async () => {
    try {
      if (
        !cliente.nombre.trim() ||
        !cliente.apellido.trim() ||
        !cliente.documento.trim()
      ) {
        setNotificacion({
          abierta: true,
          mensaje: 'Nombre, apellido y documento son obligatorios',
          tipo: 'warning'
        });

        return;
      }

      if (clienteEditando) {
        await api.put(`/api/clientes/${clienteEditando.id}/`, cliente);

        setNotificacion({
          abierta: true,
          mensaje: 'Cliente actualizado correctamente',
          tipo: 'success'
        });
      } else {
        await api.post('/api/clientes/', cliente);

        setNotificacion({
          abierta: true,
          mensaje: 'Cliente creado correctamente',
          tipo: 'success'
        });
      }

      setModalFormulario(false);
      limpiarFormulario();
      cargarClientes();
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.data?.documento) {
        setNotificacion({
          abierta: true,
          mensaje: 'Documento duplicado',
          tipo: 'error'
        });
      } else {
        setNotificacion({
          abierta: true,
          mensaje: 'Error al guardar cliente',
          tipo: 'error'
        });
      }
    }
  };

  const editarCliente = (clienteSeleccionado) => {
    setClienteEditando(clienteSeleccionado);

    setCliente({
      nombre: clienteSeleccionado.nombre,
      apellido: clienteSeleccionado.apellido,
      documento: clienteSeleccionado.documento,
      email: clienteSeleccionado.email || '',
      activo: clienteSeleccionado.activo
    });

    setModalFormulario(true);
  };

  const abrirModalEliminar = (cliente) => {
    setClienteEliminar(cliente);
    setModalEliminar(true);
  };

  const cerrarModalEliminar = () => {
    setModalEliminar(false);
    setClienteEliminar(null);
  };

  const confirmarEliminarCliente = async () => {
    try {
      await api.delete(`/api/clientes/${clienteEliminar.id}/`);

      setNotificacion({
        abierta: true,
        mensaje: 'Cliente eliminado',
        tipo: 'success'
      });

      cerrarModalEliminar();
      cargarClientes();
    } catch (err) {
      console.log(err.response?.data);

      setNotificacion({
        abierta: true,
        mensaje: 'Error al eliminar cliente',
        tipo: 'error'
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Clientes
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={abrirModalNuevoCliente}
      >
        Nuevo cliente
      </Button>

      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={clientes}
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {clienteEditando ? 'Editar cliente' : 'Nuevo cliente'}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
            <TextField
              label="Nombre"
              fullWidth
              value={cliente.nombre}
              onChange={(e) =>
                setCliente({
                  ...cliente,
                  nombre: e.target.value
                })
              }
            />

            <TextField
              label="Apellido"
              fullWidth
              value={cliente.apellido}
              onChange={(e) =>
                setCliente({
                  ...cliente,
                  apellido: e.target.value
                })
              }
            />

            <TextField
              label="Documento"
              fullWidth
              value={cliente.documento}
              onChange={(e) =>
                setCliente({
                  ...cliente,
                  documento: e.target.value
                })
              }
            />

            <TextField
              label="Email"
              fullWidth
              value={cliente.email}
              onChange={(e) =>
                setCliente({
                  ...cliente,
                  email: e.target.value
                })
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={cliente.activo}
                  onChange={(e) =>
                    setCliente({
                      ...cliente,
                      activo: e.target.checked
                    })
                  }
                />
              }
              label="Activo"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={cerrarModalFormulario}>
            Cancelar
          </Button>

          <Button variant="contained" onClick={guardarCliente}>
            {clienteEditando ? 'Guardar cambios' : 'Crear cliente'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalEliminar} onClose={cerrarModalEliminar}>
        <DialogTitle>
          Eliminar cliente
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            ¿Deseás eliminar el cliente?
            <br />
            <br />
            <strong>
              {clienteEliminar?.apellido}, {clienteEliminar?.nombre}
            </strong>
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
            onClick={confirmarEliminarCliente}
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

export default PaginaClientes;