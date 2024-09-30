import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Box, Paper, IconButton, TextField, InputAdornment, Card, CardContent } from '@mui/material';
import { Close, Search, Edit, Delete, ListAltSharp } from '@mui/icons-material';
import Swal from 'sweetalert2';
import MainCard from 'ui-component/cards/MainCard';
import { useCargoStore, useContratoStore, useEmpleadoStore } from '../../hooks';
import ContratoForm from './ContratoForm';
import { useNavigate } from 'react-router-dom';


const initialStateContrato = {
  id: null,
  fechaInicio: '',
  fechaFin: '',
  fechaFiniquito: '',
  haberInicial: '',
  haberActual: '',
  tipoEmpleado: '',
  comprobante: '',
  empleadoId: ''
};

export const Contratos = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(initialStateContrato);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedContrato, setSelectedContrato] = useState(null);

  const { contratos, loadContratos, saveContrato, selectContrato, clearSelectedContrato, removeContrato, isLoading, error } =
    useContratoStore();
  const { empleados, loadEmpleados } = useEmpleadoStore();
  const { cargos, loadCargos } = useCargoStore();

  useEffect(() => {
    loadContratos();
    loadEmpleados();
    loadCargos();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearSelectedContrato();
    setIsEdit(false);
    setCurrentItem(initialStateContrato);
  };

  const handleEdit = (contrato) => {
    selectContrato(contrato);
    setCurrentItem({
      id: contrato.id || '',
      fechaInicio: contrato.fechaInicio  || '',
      fechaFin: contrato.fechaFin || '',
      fechaFiniquito: contrato.fechaFiniquito || '',
      haberInicial: contrato.haberInicial || '',
      haberActual: contrato.haberActual || '',
      tipoEmpleado: contrato.tipoEmpleado || '',
      contratoRespaldo: contrato.contratoRespaldo || '',
      finiquitoRespaldo: contrato.finiquitoRespaldo || '',
      empleadoId: contrato.empleadoId || ''
    });
    setIsEdit(true);
    handleOpen();
  };

  const handleOpenDetails = (contrato) => {
    setSelectedContrato(contrato);
  };

  const handleCloseDetails = () => {
    setSelectedContrato(null);
  };

 
  const handleSubmit = async (values) => {
   
    
    try {

      const fechaInicio = values.fechaInicio ? new Date(values.fechaInicio + 'T00:00:00Z').toISOString(): '';
      const fechaFin = values.fechaFin ? new Date(values.fechaFin + 'T00:00:00Z').toISOString() :'';
      const fechaFiniquito = values.fechaFiniquito ? new Date(values.fechaFiniquito + 'T00:00:00Z').toISOString(): '';
  
      const contratoData = {
        ...values,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        fechaFiniquito: fechaFiniquito
      }
      console.log('contrato', contratoData)
     
      await saveContrato(contratoData);
       
  
      Swal.fire({
        icon: 'success',
        title: isEdit ? 'Contrato Actualizado' : 'Contrato Guardado',
        text: `El contrato ha sido ${isEdit ? 'actualizado' : 'guardado'} exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
  
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Hubo un problema al ${isEdit ? 'actualizar' : 'guardar'} el contrato. Inténtalo de nuevo.`,
      });
    }
  };

  const getEmpleadoName = (id) => {
    const empleado = empleados.find((emp) => emp.id === id);
    return empleado ? `${empleado.nombre} ${empleado.apellidoPaterno}` : 'desconocido';
  };

  const getCargoName = (id) => {
    const empleado = empleados.find((emp) => emp.id === id);
    if (!empleado) {
      return 'Desconocido';
    }
    const cargo = cargos.find((dep) => dep.id === empleado.cargoId);
    return cargo ? `${cargo.nombre}` : 'Desconocido';
  };

  return (
    <MainCard title="Gestión de Contratos">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 2
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Buscar Contrato"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              sx={{ backgroundColor: 'white', borderRadius: 1, flexGrow: 1, marginRight: 2 }}
            />

            <Button variant="contained" color="primary" onClick={() => navigate('/contratos/listar')} startIcon={<ListAltSharp />}>
              Listar Todos los Contratos
            </Button>
          </Box>
          <ContratoForm
            open={open}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
            isEdit={isEdit}
            currentItem={currentItem}
            empleados={empleados}
          />
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
            ) : contratos && contratos.length > 0 ? (
              contratos.map((contrato) => (
                <Grid item key={contrato.id} xs={12} sm={6} md={4}>
                  <Card sx={{ backgroundColor: 'rgb(248, 250, 252)' }}>
                    <CardContent onClick={() => handleOpenDetails(contrato)}>
                      <Typography variant="h4" className="contract-name" sx={{ cursor: 'pointer' }} color="secondary">
                        Contrato ID: {contrato.id}
                      </Typography>

                      <Typography sx={{ fontWeight: 'bold' }}>Empleado:</Typography>
                      <Typography className="contract-title">{getEmpleadoName(contrato.empleadoId)}</Typography>
                      <Typography sx={{ fontWeight: 'bold' }}>Cargo:</Typography>
                      <Typography className="contract-title">{getCargoName(contrato.empleadoId)}</Typography>
                      <Typography sx={{ fontWeight: 'bold' }}>Tipo de Empleado:</Typography>
                      <Typography className="contract-title">{contrato.tipoEmpleado}</Typography>
                      <Typography sx={{ fontWeight: 'bold' }}>Fecha de Inicio:</Typography>
                      <Typography className="contract-title">{new Date(contrato.fechaInicio).toLocaleDateString()}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(contrato);
                          }}
                          color="primary"
                        >
                          <Edit />
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
                    <Typography variant="h6">No hay contratos disponibles.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
        {selectedContrato && (
          <Paper
            sx={{
              backgroundColor: 'rgb(248, 250, 252)',
              padding: 2,
              borderRadius: 2,
              position: 'relative',
              width: { xs: '100%', md: '35%' },
              marginLeft: { md: 2 },
              marginTop: { xs: 2, md: 0 },
              flexGrow: 0,
              height: 'calc(100vh - 210px)',
              overflowY: 'auto'
            }}
          >
            <IconButton sx={{ position: 'absolute', top: 2, right: 2 }} onClick={handleCloseDetails}>
              <Close />
            </IconButton>
            <Typography variant="h5" className="contract-name" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Contrato ID: {selectedContrato.id}
            </Typography>
            <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>Empleado:</Typography>
            <Typography className="contract-title" sx={{ textAlign: 'center' }}>
              {getEmpleadoName(selectedContrato.empleadoId)}
            </Typography>
            <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>Tipo de Empleado:</Typography>
            <Typography className="contract-title" sx={{ textAlign: 'center' }}>
              {selectedContrato.tipoEmpleado}
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              <Typography className="contract-details" sx={{ textAlign: 'center' }}>
                <strong>Fecha de Inicio:</strong> {new Date(selectedContrato.fechaInicio.split('T')[0]).toLocaleDateString()} <br />
                <strong>Fecha Fin:</strong>{' '}
                {selectedContrato.fechaFin ? new Date(selectedContrato.fechaFin).toLocaleDateString() : 'Indefinido'} <br />
                <strong>Haber Inicial:</strong> {selectedContrato.haberInicial} <br />
                <strong>Haber Actual:</strong> {selectedContrato.haberActual} <br />
                <strong>Fecha Finiquito:</strong>{' '}
                {selectedContrato.fechaFiniquito ? new Date(selectedContrato.fechaFiniquito).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </MainCard>
  );
};
