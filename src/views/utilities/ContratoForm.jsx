import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Grid
} from '@mui/material';
import Swal from 'sweetalert2';

const validationSchema = Yup.object({
  empleadoId: Yup.string().required('El empleado es obligatorio'),
  tipoEmpleado: Yup.string().required('El tipo de empleado es obligatorio'),
  fechaInicio: Yup.date().nullable().required('La fecha de inicio es obligatoria'),
  fechaFin: Yup.date()
    .nullable()
    .test('is-after-start', 'La fecha de fin debe ser posterior a la fecha de inicio', function (value) {
      const { fechaInicio } = this.parent;
      if (!fechaInicio || !value) return true;
      return new Date(value) > new Date(fechaInicio);
    }),
  fechaFiniquito: Yup.date()
    .nullable()
    .test('is-after-start', 'La fecha de finiquito debe ser posterior a la fecha de inicio', function (value) {
      const { fechaInicio } = this.parent;
      if (!fechaInicio || !value) return true;
      return new Date(value) > new Date(fechaInicio);
    }),
  haberInicial: Yup.number().required('El haber inicial es obligatorio').positive('Debe ser un número positivo'),
  contratoRespaldo: Yup.mixed().nullable(),
  finiquitoRespaldo: Yup.mixed().nullable()
});

const ContratoForm = ({ open, handleClose, handleSubmit, isEdit, currentItem, empleados }) => {
  const initialValues = {
    ...currentItem,
    fechaInicio: currentItem.fechaInicio ? new Date(currentItem.fechaInicio).toISOString().split('T')[0] : '',
    fechaFin: currentItem.fechaFin ? new Date(currentItem.fechaFin).toISOString().split('T')[0] : '',
    fechaFiniquito: currentItem.fechaFiniquito ? new Date(currentItem.fechaFiniquito).toISOString().split('T')[0] : '',
    haberActual: currentItem.haberInicial || ''
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEdit ? 'Editar' : 'Agregar'} Contrato</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          values.haberActual = values.haberInicial; // Asignar haberActual con haberInicial al enviar el formulario
          handleSubmit(values);
          Swal.fire({
            title: isEdit ? 'Contrato Actualizado' : 'Contrato Guardado',
            text: `El contrato ha sido ${isEdit ? 'actualizado' : 'guardado'} exitosamente.`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, values, setFieldValue }) => (
          <Form>
            <DialogContent>
              <FormControl fullWidth margin="dense" error={Boolean(errors.empleadoId) && Boolean(touched.empleadoId)}>
                <InputLabel id="empleado-label">Empleado</InputLabel>
                <Field
                  as={Select}
                  labelId="empleado-label"
                  name="empleadoId"
                  label="Empleado"
                  value={values.empleadoId}
                  onChange={(e) => setFieldValue('empleadoId', e.target.value)}
                  input={<OutlinedInput label="Empleado" />}
                  disabled
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {empleados.map((empleado) => (
                    <MenuItem key={empleado.id} value={empleado.id}>
                      {empleado.nombre} {empleado.apellidoPaterno}
                    </MenuItem>
                  ))}
                </Field>
                <ErrorMessage name="empleadoId" />
              </FormControl>

              <FormControl fullWidth margin="dense" error={Boolean(errors.tipoEmpleado) && Boolean(touched.tipoEmpleado)}>
                <InputLabel id="tipoEmpleado-label">Tipo de Empleado</InputLabel>
                <Field
                  as={Select}
                  labelId="tipoEmpleado-label"
                  name="tipoEmpleado"
                  label="Tipo de Empleado"
                  value={values.tipoEmpleado}
                  onChange={(e) => setFieldValue('tipoEmpleado', e.target.value)}
                  input={<OutlinedInput label="Tipo de Empleado" />}
                >
                  <MenuItem value="administrativo">Administrativo</MenuItem>
                  <MenuItem value="comercial">Comercial</MenuItem>
                </Field>
                <ErrorMessage name="tipoEmpleado" />
              </FormControl>

              <Field name="fechaInicio">
                {({ field, form }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Fecha de Inicio"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(form.errors.fechaInicio) && Boolean(form.touched.fechaInicio)}
                    helperText={<ErrorMessage name="fechaInicio" />}
                    value={field.value || ''}
                    onChange={(e) => {
                      form.setFieldValue('fechaInicio', e.target.value || null);
                    }}
                  />
                )}
              </Field>

              <Field name="fechaFin">
                {({ field, form }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Fecha de Fin"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(form.errors.fechaFin) && Boolean(form.touched.fechaFin)}
                    helperText={<ErrorMessage name="fechaFin" />}
                    value={field.value || ''}
                    onChange={(e) => {
                      form.setFieldValue('fechaFin', e.target.value || null);
                    }}
                  />
                )}
              </Field>

              <Field name="fechaFiniquito">
                {({ field, form }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Fecha de Finiquito"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(form.errors.fechaFiniquito) && Boolean(form.touched.fechaFiniquito)}
                    helperText={<ErrorMessage name="fechaFiniquito" />}
                    value={field.value || ''}
                    onChange={(e) => {
                      form.setFieldValue('fechaFiniquito', e.target.value || null);
                    }}
                  />
                )}
              </Field>

              <Field
                as={TextField}
                margin="dense"
                name="haberInicial"
                label="Haber Inicial"
                type="number"
                fullWidth
                error={Boolean(errors.haberInicial) && Boolean(touched.haberInicial)}
                helperText={<ErrorMessage name="haberInicial" />}
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
  );
};

export default ContratoForm;
