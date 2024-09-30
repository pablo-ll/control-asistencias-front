import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, IconButton, Switch, Grid, TextField, InputAdornment, Box, Paper, FormControlLabel } from '@mui/material';
import { Edit, Delete, Search, Add, Close } from '@mui/icons-material';
import Swal from 'sweetalert2';
import MainCard from 'ui-component/cards/MainCard';
import { useDepartamentoStore, useCargoStore, useEmpleadoStore } from '../../hooks';

export const Empleados = () => {
  const navigate = useNavigate();
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

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

  const { cargos, loadCargos } = useCargoStore();

  const { items: departments, loadDepartamentos } = useDepartamentoStore();


  useEffect(() => {
    loadDepartamentos();
    loadCargos();
    loadEmpleados();
   
  }, []);

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
        removeEmpleado(id);
        Swal.fire('Eliminado!', 'El empleado ha sido eliminado.', 'success');
      }
    });
  };

  const handleToggleEstado = ( empleado, estadoActual) => {
    const nuevoEstado = !estadoActual;
    saveEmpleado({...empleado,estado: nuevoEstado});
  };
  const handleEdit = (id) => {
    navigate(`/empleados/modificar/${id}`);
  };

  const handleOpenDetails = (empleado) => {
    setSelectedEmpleado(empleado);
  };

  const handleCloseDetails = () => {
    setSelectedEmpleado(null);
  };
  const getDepartmentName = (id) => {
    const department = departments.find(dep => dep.id === id);
    return department ? department.nombre : 'Desconocido';
  };
  const getCargoName = (id) => {
    const cargo = cargos.find(dep => dep.id === id);
    return cargo ? cargo.nombre : 'Desconocido';
  };

  return (
    <MainCard title="Gestión de Empleados">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Buscar Empleado"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: 'white', borderRadius: 1, flexGrow: 1, marginRight: 2 }}
            />
            <Button onClick={() => navigate('/empleados/crear')} variant="contained" color="primary" startIcon={<Add />}>
              Crear Empleado
            </Button>
          </Box>
          <Grid container spacing={2}>
            {isLoading ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Cargando...</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : error ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Error: {error}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : empleados && empleados.length > 0 ? (
              empleados.map((empleado) => (
                <Grid item key={empleado.id} xs={12} sm={6} md={4}>
                  <Card sx={{ backgroundColor: 'rgb(248, 250, 252)' }}>
                    <CardContent>
                      <Box sx={{ textAlign: 'center', marginBottom: 2 }}  onClick={() => handleOpenDetails(empleado)}>
                        <img
                          src={empleado.fotografia}
                          alt={empleado.nombre}
                          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', backgroundColor: 'lightblue' }}
                        />
                      </Box>
                      <Typography variant="h5" className="contact-name" sx={{ cursor: 'pointer' }}>
                        {empleado.nombre} {empleado.apellidoPaterno}
                      </Typography>
                      <Typography className="contact-title">{empleado.cedula}</Typography>
                      <Typography className="contact-title">{getCargoName(empleado.cargoId)}</Typography>
                      <Typography className="contact-title">{getDepartmentName(empleado.departamentoId)}</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <Switch checked={empleado.estado === true} onChange={() => handleToggleEstado(empleado, empleado.estado)} />
                      <Typography className="contact-title">{empleado.estado ? 'activo' : 'inactivo'}</Typography>
                      </Box>
                     
                       

                    
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(empleado.id); }}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(empleado.id); }}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">No hay empleados disponibles.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
        {selectedEmpleado ? (
          <Paper
            sx={{
              backgroundColor: 'rgb(248, 250, 252)',
              padding: 2,
              borderRadius: 2,
              position: 'relative',
              width: '35%',
              marginLeft: 2,
              flexGrow: 0,
              height: 'calc(100vh - 210px)',
            }}
          >
            <IconButton sx={{ position: 'absolute', top: 2, right: 2 }} onClick={handleCloseDetails}>
              <Close />
            </IconButton>
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
              <img
                src="https://via.placeholder.com/150"
                alt={selectedEmpleado.nombre}
                style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', backgroundColor: 'lightblue' }}
              />
            </Box>
            <Typography variant="h5" className="contact-name" sx={{ textAlign: 'center' }}>
              {selectedEmpleado.nombre} {selectedEmpleado.apellidoPaterno}
            </Typography>
            <Typography className="contact-title" sx={{ textAlign: 'center' }}>
              {selectedEmpleado.cedula}
            </Typography>
            <Typography className="contact-title" sx={{ textAlign: 'center' }}>
              {selectedEmpleado.cargo}
            </Typography>
            <Typography className="contact-title" sx={{ textAlign: 'center' }}>
              {selectedEmpleado.departamento}
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              <Typography className="contact-details" sx={{ textAlign: 'center' }}>
                Email: {selectedEmpleado.email}<br />
                Phone: {selectedEmpleado.telefono}<br />
                Location: {selectedEmpleado.ubicacion}<br />
                Birthday: {selectedEmpleado.fechaNacimiento}
              </Typography>
            </Box>
          </Paper>
        ) : null}
      </Box>
    </MainCard>
  );
};





