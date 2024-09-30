import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Swal from 'sweetalert2';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import BonoAntiguedadDetailsTable from './BonoAntiguedadDetailsTable';
import { useBonoAntiguedadStore } from 'hooks';

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  fecha: Yup.date().required('La fecha es obligatoria'),
  descripcion: Yup.string().required('La descripción es obligatoria'),
  detalles: Yup.array().of(
    Yup.object().shape({
      start: Yup.number().min(0, 'El valor debe ser < 0 o = 0').required('Obligatorio'),
      end: Yup.number().min(Yup.ref('start'), 'Debe ser mayor que el inicio').required('Obligatorio'),
      porcentaje: Yup.number().min(0, 'El valor debe ser < 0 o = 0').required('Obligatorio'),
    })
  ),
});

const BonoAntiguedadForm = () => {
  const { saveBonoAntiguedad, loadBonoAntiguedad, items, isLoading } = useBonoAntiguedadStore();
  const [initialValues, setInitialValues] = useState({
    nombre: '',
    fecha: '',
    descripcion: '',
    detalles: [],
  });

  useEffect(() => {
    loadBonoAntiguedad(); 
  }, []);

  useEffect(() => {
    if (items && items.length > 0) {
      setInitialValues(items[0]);
    }
  }, [items]);

 

  const handleSubmit = async (values) => {
    console.log('values', values)
  
    try {
      await  saveBonoAntiguedad(values);
  
      Swal.fire({
        icon: 'success',
        title:  'Datos Actualizados ',
        text: 'Los datos ha sido grabados exitosamente.',
        timer: 2000,
        showConfirmButton: false,
      });
  
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al grabar los datos. Inténtalo de nuevo.',
      });
    }
  };

  return (
    isLoading ? (
      <Typography variant="h5" >Cargando...</Typography>
    ) : (
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form>
            <Paper sx={{ padding: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 2,
                }}
              >
                <Typography variant="h5">BONO DE ANTIGUEDAD</Typography>
                <Button type="submit" variant="contained" color="primary">
                  Grabar
                </Button>
              </Box>

              <TextField
                label="Nombre"
                fullWidth
                sx={{ marginBottom: 2 }}
                name="nombre"
                value={values.nombre}
                onChange={handleChange}
                error={touched.nombre && Boolean(errors.nombre)}
                helperText={touched.nombre && errors.nombre}
              />

              <Typography variant="body1">Fecha:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <TextField
                  type="date"
                  name="fecha"
                  value={values.fecha}
                  onChange={handleChange}
                  sx={{ marginRight: 1, flex: 1 }}
                  error={touched.fecha && Boolean(errors.fecha)}
                  helperText={touched.fecha && errors.fecha}
                />
              </Box>

              <TextField
                label="Descripción"
                multiline
                rows={4}
                fullWidth
                name="descripcion"
                value={values.descripcion}
                onChange={handleChange}
                error={touched.descripcion && Boolean(errors.descripcion)}
                helperText={touched.descripcion && errors.descripcion}
              />

              <BonoAntiguedadDetailsTable
                detalles={values.detalles}
                errors={errors.detalles}
                touched={touched.detalles}
                handleChange={handleChange}
              />
            </Paper>
          </Form>
        )}
      </Formik>
    )
  );
};

export default BonoAntiguedadForm;
