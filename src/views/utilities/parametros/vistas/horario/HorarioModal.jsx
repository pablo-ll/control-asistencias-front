import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const HorarioModal = ({ open, onClose, horario, onSave }) => {
  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required('El nombre es obligatorio'),
    
    tipo: Yup.string()
      .required('El tipo es obligatorio'),
  
    horaEntrada: Yup.string()
      .required('La hora de entrada es obligatoria'),
    
    horaSalidaAlmuerzo: Yup.string().when('tipo', {
      is: 'completo',
      then: () => Yup.string()
        .required('La hora de salida para almuerzo es obligatoria')
        .test('almuerzo-valido', 'La hora de salida para almuerzo no puede ser antes de la hora de entrada', function(value) {
          const { horaEntrada } = this.parent;
          return horaEntrada ? value >= horaEntrada : true;
        })
    }),
  
    horaReingreso: Yup.string().when('tipo', {
      is: 'completo',
      then: () => Yup.string()
        .required('La hora de reingreso es obligatoria')
        .test('reingreso-valido', 'La hora de reingreso no puede ser antes de la hora de salida para almuerzo', function(value) {
          const { horaSalidaAlmuerzo } = this.parent;
          return horaSalidaAlmuerzo ? value >= horaSalidaAlmuerzo : true;
        })
    }),
  
    horaSalidaFinal: Yup.string().when('tipo', {
      is: 'completo',
      then: () => Yup.string()
        .required('La hora de salida final es obligatoria')
        .test('salida-final-valido', 'La hora de salida final no puede ser antes de la hora de reingreso', function(value) {
          const { horaReingreso } = this.parent;
          return horaReingreso ? value >= horaReingreso : true;
        })
    }),
  
    horaSalida: Yup.string().when('tipo', {
      is: 'continuo',
      then: () => Yup.string()
        .required('La hora de salida es obligatoria')
        .test('hora-salida-valida', 'La hora de salida no puede ser antes de la hora de entrada', function(value) {
          const { horaEntrada } = this.parent;
          return horaEntrada ? value >= horaEntrada : true;
        })
    }),
  
    toleranciaEntrada: Yup.string()
      .required('La tolerancia de entrada es obligatoria'),
  
    toleranciaSalida: Yup.string()
      .required('La tolerancia de salida es obligatoria'),
  
    dias: Yup.array()
      .min(1, 'Debe seleccionar al menos un día'),
  });

  const handleSave = (values) => {
    const savedValues = { ...values };
    if (values.tipo === 'continuo') {
      // Para horario continuo, asegúrate de que estos campos estén vacíos o undefined
      savedValues.horaSalidaAlmuerzo = undefined;
      savedValues.horaReingreso = undefined;
      savedValues.horaSalidaFinal = undefined;
    } else if (values.tipo === 'completo') {
      // Para horario completo, asegúrate de que horaSalida esté vacío o undefined
      savedValues.horaSalida = undefined;
    }
   
    onSave(savedValues);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          padding: 3,
          width: 400,
          margin: 'auto',
          marginTop: '10%',
          maxHeight: '80vh',
          overflowY: 'auto',
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h6" gutterBottom>
          {horario.id ? 'Actualizar Horario' : 'Crear Nuevo Horario'}
        </Typography>
        <Formik
          initialValues={horario}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ values, handleChange, setFieldValue, errors, touched }) => (
            <Form>
              <Box sx={{ marginBottom: 2 }}>
                <Field
                  as={TextField}
                  label="Nombre del Horario"
                  name="nombre"
                  value={values.nombre}
                  onChange={handleChange}
                  fullWidth
                  error={touched.nombre && !!errors.nombre}
                  helperText={touched.nombre && <ErrorMessage name="nombre" />}
                />
              </Box>
              <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                <FormLabel component="legend">Tipo de Horario</FormLabel>
                <RadioGroup
                  row
                  name="tipo"
                  value={values.tipo}
                  onChange={handleChange}
                >
                  <FormControlLabel value="completo" control={<Radio />} label="Completo" />
                  <FormControlLabel value="continuo" control={<Radio />} label="Continuo" />
                </RadioGroup>
              </FormControl>

              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1">Hora Entrada:</Typography>
                <Field
                  as={TextField}
                  type="time"
                  name="horaEntrada"
                  value={values.horaEntrada}
                  onChange={handleChange}
                  fullWidth
                  error={touched.horaEntrada && !!errors.horaEntrada}
                  helperText={touched.horaEntrada && <ErrorMessage name="horaEntrada" />}
                />
              </Box>

              {values.tipo === 'completo' ? (
                <>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1">Hora Salida para Almuerzo:</Typography>
                    <Field
                      as={TextField}
                      type="time"
                      name="horaSalidaAlmuerzo"
                      value={values.horaSalidaAlmuerzo}
                      onChange={handleChange}
                      fullWidth
                      error={touched.horaSalidaAlmuerzo && !!errors.horaSalidaAlmuerzo}
                      helperText={touched.horaSalidaAlmuerzo && <ErrorMessage name="horaSalidaAlmuerzo" />}
                    />
                  </Box>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1">Hora Reingreso:</Typography>
                    <Field
                      as={TextField}
                      type="time"
                      name="horaReingreso"
                      value={values.horaReingreso}
                      onChange={handleChange}
                      fullWidth
                      error={touched.horaReingreso && !!errors.horaReingreso}
                      helperText={touched.horaReingreso && <ErrorMessage name="horaReingreso" />}
                    />
                  </Box>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1">Hora Salida Final:</Typography>
                    <Field
                      as={TextField}
                      type="time"
                      name="horaSalidaFinal"
                      value={values.horaSalidaFinal}
                      onChange={handleChange}
                      fullWidth
                      error={touched.horaSalidaFinal && !!errors.horaSalidaFinal}
                      helperText={touched.horaSalidaFinal && <ErrorMessage name="horaSalidaFinal" />}
                    />
                  </Box>
                </>
              ) : (
                <Box sx={{ marginBottom: 2 }}>
                  <Typography variant="body1">Hora Salida:</Typography>
                  <Field
                    as={TextField}
                    type="time"
                    name="horaSalida"
                    value={values.horaSalida}
                    onChange={handleChange}
                    fullWidth
                    error={touched.horaSalida && !!errors.horaSalida}
                    helperText={touched.horaSalida && <ErrorMessage name="horaSalida" />}
                  />
                </Box>
              )}

              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1">Tol. Entrada:</Typography>
                <Field
                  as={TextField}
                  type="time"
                  name="toleranciaEntrada"
                  value={values.toleranciaEntrada}
                  onChange={handleChange}
                  fullWidth
                  error={touched.toleranciaEntrada && !!errors.toleranciaEntrada}
                  helperText={touched.toleranciaEntrada && <ErrorMessage name="toleranciaEntrada" />}
                />
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1">Tol. Salida:</Typography>
                <Field
                  as={TextField}
                  type="time"
                  name="toleranciaSalida"
                  value={values.toleranciaSalida}
                  onChange={handleChange}
                  fullWidth
                  error={touched.toleranciaSalida && !!errors.toleranciaSalida}
                  helperText={touched.toleranciaSalida && <ErrorMessage name="toleranciaSalida" />}
                />
              </Box>

              <Typography variant="body1">Días Aplicables:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 1, marginBottom: 2 }}>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
                  <FormControlLabel
                    key={dia}
                    control={
                      <Checkbox
                        checked={values.dias.includes(dia)}
                        onChange={() => {
                          const newDias = values.dias.includes(dia)
                            ? values.dias.filter((d) => d !== dia)
                            : [...values.dias, dia];
                          setFieldValue('dias', newDias);
                        }}
                      />
                    }
                    label={dia}
                  />
                ))}
              </Box>
              <ErrorMessage name="dias" component="div" style={{ color: 'red' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  {horario.id ? 'Actualizar' : 'Grabar'}
                </Button>
                <Button variant="contained" color="error" onClick={onClose}>
                  Cancelar
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default HorarioModal;