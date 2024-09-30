import React, { useEffect, useState } from 'react';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useCargoStore, useDepartamentoStore } from '../../hooks';

// Esquema de validación
const validationSchema = Yup.object({
  nombre: Yup.string()
    .required('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: Yup.string()
    .required('La descripción es obligatoria')
    .min(10, 'La descripción debe tener al menos 10 caracteres'),
  departamentoId: Yup.string()
    .required('El departamento es obligatorio'),
});

export const Cargo = () => {

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { 
    cargos, 
    loadCargos, 
    saveCargo, 
    selectCargo, 
    clearSelectedCargo, 
    removeCargo, 
    activeCargo,
    isLoading,
    error
  } = useCargoStore();
  const { 
    items: departments, 
    loadDepartamentos, 
    
  } = useDepartamentoStore();

  useEffect(() => {
    loadDepartamentos();
    loadCargos();
  }, []);

  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearSelectedCargo();
    setIsEdit(false);
  };

  const handleEdit = (item) => {
    selectCargo(item);
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
        removeCargo(id);
        Swal.fire(
          'Eliminado!',
          'El registro ha sido eliminado.',
          'success'
        );
      }
    });
  };
  const handleSubmit = (values) => {
    console.log(values, 'cargos sub')
    saveCargo(values);
    handleClose();
  };

    // Función para encontrar el nombre del departamento a partir de su ID
    const getDepartmentName = (id) => {
      const department = departments.find(dep => dep.id === id);
      return department ? department.nombre : 'Desconocido';
    };

  return (
    <MainCard title="Gestión de Cargos">
      <Container>
        <Button variant="outlined" color="primary" onClick={handleOpen}>Crear Cargo</Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEdit ? 'Editar' : 'Agregar'} Cargo</DialogTitle>
          <Formik
            initialValues={activeCargo || { nombre: '', descripcion: '', departamentoId: '' }}
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
                    label="Descripción"
                    fullWidth
                    error={Boolean(errors.descripcion) && Boolean(touched.descripcion)}
                    helperText={<ErrorMessage name="descripcion" />}
                  />
                  <FormControl fullWidth margin="dense" error={Boolean(errors.departamentoId) && Boolean(touched.departamentoId)}>
                    <InputLabel id="department-label">Departamento</InputLabel>
                    <Field
                      as={Select}
                      labelId="department-label"
                      name="departamentoId"
                      label="Departamento"
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {departments.map(department => (
                        <MenuItem key={department.id} value={department.id}>{department.nombre}</MenuItem>
                      ))}
                    </Field>
                    <ErrorMessage name="departamentoId" component="div" />
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">Cancelar</Button>
                  <Button type="submit" color="primary" disabled={isSubmitting}>{isEdit ? 'Actualizar' : 'Agregar'}</Button>
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
                <TableCell>Departamento</TableCell>
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
              ) : cargos && cargos.length > 0 ? (
                cargos.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell>{getDepartmentName(item.departamentoId)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(item)}><Edit /></IconButton>
                      <IconButton onClick={() => handleDelete(item.id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No hay cargos disponibles.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </MainCard>
  );
};
