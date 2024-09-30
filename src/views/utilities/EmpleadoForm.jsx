import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import {

  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Typography,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useDepartamentoStore, useCargoStore, useEmpleadoStore, useHorarioStore } from '../../hooks';
import CloudinaryUpload from './cloudinaryImages/CloudinaryUpload';

const selectOptions = [
  { value: 'LP', label: 'La Paz' },
  { value: 'CBBA', label: 'Cochabamba' },
  { value: 'SC', label: 'Santa Cruz' },
  { value: 'OR', label: 'Oruro' },
  { value: 'PT', label: 'Potosí' },
  { value: 'TJ', label: 'Tarija' },
  { value: 'CH', label: 'Chuquisaca' },
  { value: 'BN', label: 'Beni' },
  { value: 'PN', label: 'Pando' }
];

// Esquema de validación
const validationSchema = Yup.object({
  cedula: Yup.string().required('La cédula es obligatoria'),
  nombre: Yup.string().required('El nombre es obligatorio'),
  apellidoPaterno: Yup.string().required('El apellido paterno es obligatorio'),
  apellidoMaterno: Yup.string().required('El apellido materno es obligatorio'),
  apellidoCasada: Yup.string(), // Campo opcional
  lugarExpedito: Yup.string().required('El lugar de expedición es obligatorio'),
  fotografia: Yup.string(), // Campo opcional
  fechaNacimiento: Yup.date().required('La fecha de nacimiento es obligatoria'),
  genero: Yup.string().required('El género es obligatorio'),
  estadoCivil: Yup.string().required('El estado civil es obligatorio'),
  direccion: Yup.string().required('La dirección es obligatoria'),
  telefono: Yup.string().required('El teléfono es obligatorio'),
  email: Yup.string().email('Email inválido').required('El email es obligatorio'),
  departamentoId: Yup.number().required('El departamento es obligatorio'),
  cargoId: Yup.number().required('El cargo es obligatorio')
});

const initialState = {
  id: null,
  cedula: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  apellidoCasada: '', // Nuevo campo
  lugarExpedito: '', // Nuevo campo
  fotografia: '', // Nuevo campo
  fechaNacimiento: '',
  genero: '',
  estadoCivil: '',
  direccion: '',
  telefono: '',
  email: '',
  estado: true,
  departamentoId: '',
  cargoId: '',
  horariosSeleccionados: []
};
export const EmpleadoForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const {
    empleados,
    loadEmpleados,
    saveEmpleado,
    selectEmpleado,
    clearSelectedEmpleado,
    removeEmpleado,
    activeEmpleado,
    isLoading,
    error
  } = useEmpleadoStore();
  const { horarios, loadHorarios } = useHorarioStore();

  const { items: departamentos, loadDepartamentos } = useDepartamentoStore();
  const { cargos, loadCargos } = useCargoStore();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(initialState);
  const [isEdit, setIsEdit] = useState(false);
  const [imageUrl, setImageUrl] = useState(''); // initialValues.fotografia
  const [selectedHorarios, setSelectedHorarios] = useState([]);

  useEffect(() => {
    if (id) {
      const empleado = empleados.find((emp) => emp.id === parseInt(id));
      if (empleado) {
        if (empleado.fotografia !== imageUrl) {
          // Verificar si la URL de la imagen ha cambiado
          setImageUrl(empleado.fotografia);
        }
        setIsEdit(true);
        setInitialValues(empleado);
        setSelectedHorarios(empleado.horariosSeleccionados || []);
      }
    }
  }, [id, empleados]);

  useEffect(() => {
    loadHorarios();
  }, []);

  const handleImageUpload = (url) => {
    setImageUrl(url); // Guarda la nueva imagen en el estado
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleHorarioChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedHorarios([...selectedHorarios, parseInt(value)]);
    } else {
      setSelectedHorarios(selectedHorarios.filter((id) => id !== parseInt(value)));
    }
  };

  const handleSubmit = (values) => {
    
    
    try {
      const empleadoData = {
        ...values,
        fotografia: imageUrl,
        departamentoId: parseInt(values.departamentoId),
        cargoId: parseInt(values.cargoId),
        horariosSeleccionados: selectedHorarios
      };
      saveEmpleado(empleadoData);
      console.log('empleado', empleadoData);
  
      
  
      Swal.fire({
        icon: 'success',
        title: isEdit ? 'Empleado Actualizado' : 'Empleado Guardado',
        text: `El Empleado ha sido ${isEdit ? 'actualizado' : 'guardado'} exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
  
      navigate('/empleados');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Hubo un problema al ${isEdit ? 'actualizar' : 'guardar'} el empleado. Inténtalo de nuevo.`,
      });
    }


  };
 
  return (
    <MainCard title="Registro de Personal">
      <Box display="flex" flexDirection="column">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
          {({ isSubmitting, values, setFieldValue, errors, touched }) => (
            <Form>
              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
                <Box width={{ xs: '100%', md: '250px' }} marginRight={{ md: '16px' }} marginBottom="16px">
                  <Box
                    bgcolor="lightgray"
                    padding="16px"
                    borderRadius="30px"
                    textAlign="center"
                    height={{ xs: '100%', md: '220px' }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CloudinaryUpload initialImageUrl={imageUrl} onUpload={handleImageUpload} />
                  </Box>
                </Box>

                <Box flex={1}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={10}>
                      <Field as={TextField} name="nombre" label="Nombre del Empleado" fullWidth margin="dense" size="small" />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={values.estado}
                            onChange={(event) => setFieldValue('estado', event.target.checked)}
                            color="primary"
                          />
                        }
                        label="Estado"
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="apellidoPaterno"
                        label="Apellido Paterno del Empleado"
                        fullWidth
                        margin="dense"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="apellidoMaterno"
                        label="Apellido Materno del Empleado"
                        fullWidth
                        margin="dense"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="apellidoCasada"
                        label="Apellido de Casada (Opcional)"
                        fullWidth
                        margin="dense"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={8}>
                          <Field as={TextField} name="cedula" label="No de Documento CI" fullWidth margin="dense" size="small" />
                        </Grid>
                        <Grid item xs={4}>
                          <FormControl fullWidth margin="dense" size="small">
                            <InputLabel>Lugar de Expedición</InputLabel>
                            <Field as={Select} name="lugarExpedito" label="Lugar de Expedición">
                              <MenuItem value="">
                                <em>Seleccionar</em>
                              </MenuItem>
                              {selectOptions.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="dense" error={Boolean(errors.cargoId) && Boolean(touched.cargoId)}>
                        <InputLabel id="cargo-label">Cargo</InputLabel>
                        <Field as={Select} labelId="cargo-label" name="cargoId" label="Cargo">
                          <MenuItem value="">
                            <em>Seleccionar</em>
                          </MenuItem>
                          {cargos.map((cargo) => (
                            <MenuItem key={cargo.id} value={cargo.id}>
                              {cargo.nombre}
                            </MenuItem>
                          ))}
                        </Field>
                        <ErrorMessage name="cargoId" component="div" />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth margin="dense" error={Boolean(errors.departamentoId) && Boolean(touched.departamentoId)}>
                        <InputLabel id="department-label">Departamento</InputLabel>
                        <Field as={Select} labelId="department-label" name="departamentoId" label="Departamento">
                          <MenuItem value="">
                            <em>Seleccionar</em>
                          </MenuItem>
                          {departamentos.map((department) => (
                            <MenuItem key={department.id} value={department.id}>
                              {department.nombre}
                            </MenuItem>
                          ))}
                        </Field>
                        <ErrorMessage name="departamentoId" component="div" />
                      </FormControl>
                    </Grid>
                    {/* <Grid item xs={12} md={4}>
                       <FormControl fullWidth margin="dense" size="small">
                        <InputLabel>Supervisor</InputLabel>
                        <Field as={Select} name="supervisor" label="Supervisor">
                          <MenuItem value="">
                            <em>Seleccionar</em>
                          </MenuItem>
                          
                        </Field>
                      </FormControl> 
                    </Grid> */}
                  </Grid>
                </Box>
              </Box>
              <Box>
                <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
                  <Tab label="Datos Personales" />
                  <Tab label="Afiliacion a Gestora" />
                  <Tab label="Afiliacion CNS" />
                  <Tab label="Detalles Adicionales" /> {/* Nueva pestaña */}
                  <Tab label="Horario Laboral" />
                </Tabs>
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" bgcolor="#2196f3" color="white" padding="8px 16px" marginY="16px">
                      DATOS DE CONTACTO
                    </Typography>
                    <Field as={TextField} name="direccion" label="Dirección del empleado" fullWidth margin="dense" size="small" />

                    <Field as={TextField} name="email" label="Correo Electrónico" fullWidth margin="dense" size="small" />
                    <Field as={TextField} name="telefono" label="Teléfono/Celular" fullWidth margin="dense" size="small" />
                  </Box>
                )}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" bgcolor="#2196f3" color="white" padding="8px 16px" marginY="16px">
                      DOCUMENTO DE IDENTIDAD
                    </Typography>
                    <Field as={TextField} name="codigoPostal" label="Nro. Código Postal" fullWidth margin="dense" size="small" />
                    <Field as={TextField} name="email" label="Correo Electrónico" fullWidth margin="dense" size="small" />
                  </Box>
                )}
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h6" bgcolor="#2196f3" color="white" padding="8px 16px" marginY="16px">
                      COMUNICACIONES RECIBIDAS
                    </Typography>
                    <Field as={TextField} name="telefono" label="Teléfono/Celular" fullWidth margin="dense" size="small" />
                    <Field as={TextField} name="codigoPostal" label="Nro. Código Postal" fullWidth margin="dense" size="small" />
                    <Field as={TextField} name="email" label="Correo Electrónico" fullWidth margin="dense" size="small" />
                  </Box>
                )}
                {activeTab === 3 && (
                  <Box>
                    <Typography variant="h6" bgcolor="#2196f3" color="white" padding="8px 16px" marginY="16px">
                      DETALLES ADICIONALES
                    </Typography>
                    <Field
                      as={TextField}
                      name="fechaNacimiento"
                      label="Fecha de Nacimiento"
                      type="date"
                      fullWidth
                      margin="dense"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth margin="dense" size="small">
                      <InputLabel>Género</InputLabel>
                      <Field as={Select} name="genero" label="Género">
                        <MenuItem value="Masculino">Masculino</MenuItem>
                        <MenuItem value="Femenino">Femenino</MenuItem>
                        <MenuItem value="Otro">Otro</MenuItem>
                      </Field>
                    </FormControl>
                    <FormControl fullWidth margin="dense" size="small">
                      <InputLabel>Estado Civil</InputLabel>
                      <Field as={Select} name="estadoCivil" label="Estado Civil">
                        <MenuItem value="Soltero">Soltero</MenuItem>
                        <MenuItem value="Casado">Casado</MenuItem>
                        <MenuItem value="Divorciado">Divorciado</MenuItem>
                        <MenuItem value="Viudo">Viudo</MenuItem>
                      </Field>
                    </FormControl>
                  </Box>
                )}
                {activeTab === 4 && (
                  <Box>
                    <Typography variant="h6" bgcolor="#2196f3" color="white" padding="8px 16px" marginY="16px">
                      HORARIO LABORAL
                    </Typography>
                    <FormControl component="fieldset" fullWidth margin="dense">
                      <FormLabel component="legend">Horarios</FormLabel>
                      <FormGroup>
                        {horarios.map((horario) => (
                          <FormControlLabel
                            key={horario.id}
                            control={
                              <Checkbox
                                value={horario.id}
                                checked={selectedHorarios.includes(horario.id)}
                                onChange={handleHorarioChange}
                                name={`horariosSeleccionados.${horario.id}`} // Asegurarse que Yup capture el dato
                              />
                            }
                            label={horario.nombre}
                          />
                        ))}
                      </FormGroup>
                      <ErrorMessage name="horariosSeleccionados" component="div" />
                    </FormControl>
                  </Box>
                )}
              </Box>
              <Box textAlign="center" mt={4}>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  {isEdit ? 'Actualizar' : 'Agregar'}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    // Lógica para cancelar la acción
                    setIsEdit(false);
                    navigate('/empleados');
                  }}
                  sx={{ ml: 2 }}
                >
                  Cancelar
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </MainCard>
  );
};
