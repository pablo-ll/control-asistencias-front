import React, { useEffect, useState } from 'react';
import {
  Button, Box, Tabs, Tab,
} from '@mui/material';
import { AddTask } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import { useCargoStore, useContratoStore, useEmpleadoStore } from '../../hooks';
import ContratoForm from './ContratoForm';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import BeneficioForm from './BeneficioForm';

const initialStateContrato = {
  id: null,
  fechaInicio: '',
  fechaFin: '',
  fechaFiniquito: '',
  haberInicial: '',
  haberActual: '',
  tipoEmpleado: '',
  contratoRespaldo: '',
  finiquitoRespaldo: '',
  empleadoId: '',
};

export const ListarContratos = () => {
  const [open, setOpen] = useState(false);
  const [selectedContrato, setSelectedContrato] = useState(null);
  const [tabIndex,setTabIndex]= useState(0); 

  const navigate = useNavigate();

  const { contratos, loadContratos, removeContrato, isLoading, error } = useContratoStore();
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
    setSelectedContrato(null);
  };

  const handleOpenDetails = (contrato) => {
    console.log(contrato, 'detail')
    setSelectedContrato(contrato);
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
        removeContrato(id);
        Swal.fire('Eliminado!', 'El registro ha sido eliminado.', 'success');
      }
    });
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

  const contratosVigentes = contratos.filter(contrato => !contrato.fechaFiniquito && !contrato.fechaFin);
  const contratosCerrados = contratos.filter(contrato => contrato.fechaFiniquito && contrato.fechaFin);
  const contratosSinRespaldo = contratos.filter(contrato => !contrato.contratoRespaldo && !contrato.finiquitoRespaldo);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.3 },
    { field: 'empleado', headerName: 'Empleado', flex: 1 },
    { field: 'cargo', headerName: 'Cargo', flex: 1 },
    { field: 'tipoEmpleado', headerName: 'Tipo de Empleado', flex: 1 },
    { field: 'fechaInicio', headerName: 'Fecha de Inicio', flex: 1 },
    { field: 'fechaFin', headerName: 'Fecha de Finalizacion', flex: 1 },
    { field: 'fechaFiniquito', headerName: 'Fecha de Finiquito', flex: 1 },
    { field: 'respaldo', headerName: 'Respaldo', flex: 0.5 },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1.5,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleOpenDetails(params.row)}>
          Gestionar Beneficios
        </Button>
      )
    }
  ];

  const getRows = (contratos) => {
    return contratos.map((contrato) => ({
      id: contrato.id,
      empleado: getEmpleadoName(contrato.empleadoId),
      cargo: getCargoName(contrato.empleadoId),
      tipoEmpleado: contrato.tipoEmpleado,
      fechaInicio: format(new Date(contrato.fechaInicio), 'yyyy-MM-dd'),
      fechaFin: contrato.fechaFin ? format(new Date(contrato.fechaFin), 'yyyy-MM-dd') : 'Indefinido',
      fechaFiniquito: contrato.fechaFiniquito ? format(new Date(contrato.fechaFiniquito), 'yyyy-MM-dd') : 'Indefinido',
      respaldo: contrato.contratoRespaldo || contrato.finiquitoRespaldo ? 'Sí' : 'No'
    }));
  };

  return (
    <MainCard title="Gestión de Contratos">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 2
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/contratos')}
            startIcon={<AddTask />}
          >
            Volver
          </Button>
        </Box>
        {selectedContrato && (
          <BeneficioForm
            open={open}
            handleClose={handleClose}
            contrato={selectedContrato}
           
          />
        )}
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 2 }}>
          <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered sx={{ width: '100%', marginBottom: 2 }}>
            <Tab label="Vigentes" />
            <Tab label="Cerrados" />
            <Tab label="Sin Respaldo" />
          </Tabs>
        </Box>
        {tabIndex === 0 && (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={getRows(contratosVigentes)}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </Box>
        )}
        {tabIndex === 1 && (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={getRows(contratosCerrados)}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </Box>
        )}
        {tabIndex === 2 && (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={getRows(contratosSinRespaldo)}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </Box>
        )}
      </Box>
    </MainCard>
  );
};
