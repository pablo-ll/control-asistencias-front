import React, {  useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import {
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useDepartamentoStore } from '../../hooks';

// Esquema de validación
const validationSchema = Yup.object({
  nombre: Yup.string()
    .required('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: Yup.string()
    .required('La descripción es obligatoria')
    .min(10, 'La descripción debe tener al menos 10 caracteres'),
});

export const Departamento = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { 
    items, 
    loadDepartamentos, 
    saveDepartamento, 
    selectDepartamento, 
    clearSelectedDepartamento, 
    removeDepartamento, 
    activeDepartamento,
    isLoading,
    error
  } = useDepartamentoStore();

  useEffect(() => {
    loadDepartamentos();
  }, []);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearSelectedDepartamento();
    setIsEdit(false);
  };

  const handleEdit = (item) => {
    selectDepartamento(item);
    setIsEdit(true);
    handleOpen();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        removeDepartamento(id);
        Swal.fire(
          'Eliminado!',
          'El registro ha sido eliminado.',
          'success'
        );
      }
    });
  };
  const handleSubmit = (values) => {
    saveDepartamento(values);
    handleClose();
  };

  return (
    <MainCard title="Gestión de Departamentos">
      <Container>
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          Crear Departamento
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEdit ? 'Editar' : 'Agregar'} Departamento</DialogTitle>
          <Formik
            initialValues={activeDepartamento || { nombre: '', descripcion: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values);
              setSubmitting(false);
            }}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <DialogContent>
                  <Field
                    as={TextField}
                    autoFocus
                    margin="dense"
                    name="nombre"
                    label="Nombre"
                    fullWidth
                    error={Boolean(errors.nombre) && Boolean(touched.nombre)}
                    helperText={<ErrorMessage name="nombre" />}
                  />
                  <Field
                    as={TextField}
                    margin="dense"
                    name="descripcion"
                    label="Descripcion"
                    fullWidth
                    error={Boolean(errors.descripcion) && Boolean(touched.descripcion)}
                    helperText={<ErrorMessage name="descripcion" />}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancelar
                  </Button>
                  <Button type="submit" color="primary" disabled={isSubmitting}>
                    {isEdit ? 'Actualizar' : 'Agregar'}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>Cargando...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4}>Error: {error}</TableCell>
                </TableRow>
              ) : items && items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(item)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No hay departamentos disponibles.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </MainCard>
  );
};