import React, { useEffect, useState } from 'react';
import {
  Container,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';
import MainCard from 'ui-component/cards/MainCard';
import { useUsuarioStore, useEmpleadoStore, useRolStore } from '../../hooks';
import UsuarioForm from './UsuarioForm';

const initialStateUsuario = {
  id: null,
  username: '',
  email: '',
  password: '',
  password2: '',
  empleadoId: '',
  estado: true,
  roleRequest: {
    roleListName: []
  }
};

export const Usuario = () => {
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(initialStateUsuario);
  const [isEdit, setIsEdit] = useState(false);

  const { usuarios, loadUsuarios, saveUsuario, selectUsuario, clearSelectedUsuario, removeUsuario, isLoading, error } = useUsuarioStore();
  const { empleados, loadEmpleados } = useEmpleadoStore();
  const { roles, loadRoles } = useRolStore();

  useEffect(() => {
    loadUsuarios();
    loadEmpleados();
    loadRoles();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearSelectedUsuario();
    setIsEdit(false);
    setCurrentItem(initialStateUsuario);
  };

  const handleEdit = (usuario) => {
    selectUsuario(usuario);
    setCurrentItem({
      id: usuario.id || '',
      username: usuario.username || '',
      empleadoId: usuario.empleadoId || '',
      estado: usuario.estado || true,
      roleRequest: {
        roleListName: usuario.roleRequest?.roleListName || []
      }
    });
    setIsEdit(true);
    handleOpen();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        removeUsuario(id);
        Swal.fire('Eliminado!', 'El registro ha sido eliminado.', 'success');
      }
    });
  };

  const handleSubmit = (values) => {
    if (!isEdit && values.password !== values.password2) {
      Swal.fire('Error en registro', 'Contraseñas no son iguales', 'error');
      return;
    }

    saveUsuario(values);
    handleClose();
  };

  const handleToggleEstado = (usuario) => {
    saveUsuario({ ...usuario, estado: !usuario.estado });
  };

  const getEmpleadoEmail = (id) => {
    const empleado = empleados.find((emp) => emp.id === id);
    return empleado ? empleado.email : 'Desconocido';
  };

  return (
    <MainCard title="Gestión de Usuarios">
      <Container>
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          Crear Usuario
        </Button>
        <UsuarioForm
          open={open}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          isEdit={isEdit}
          currentItem={currentItem}
          empleados={empleados}
          roles={roles}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre de Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>Cargando...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5}>Error: {error}</TableCell>
                </TableRow>
              ) : usuarios && usuarios.length > 0 ? (
                usuarios.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{getEmpleadoEmail(item.empleadoId)}</TableCell>
                    <TableCell>
                      {item.roleRequest?.roleListName?.length > 0 ? item.roleRequest.roleListName.join(', ') : 'Sin roles asignados'}
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={<Switch checked={item.estado} onChange={() => handleToggleEstado(item)} />}
                        label={item.estado ? 'Habilitado' : 'Deshabilitado'}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(item)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDelete(item.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No hay usuarios disponibles.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </MainCard>
  );
};
