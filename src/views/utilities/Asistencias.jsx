import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  InputBase,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { useCargoStore, useContratoStore, useEmpleadoStore } from 'hooks';
import { format, isWithinInterval, parse } from 'date-fns';

export const Asistencias = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Mes actual
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Año actual

  const {
    empleados,
    loadEmpleados,
    isLoading,
    error
  } = useEmpleadoStore();

  const { cargos, loadCargos } = useCargoStore();
  const { contratos, loadContratos } = useContratoStore();

  useEffect(() => {
    loadContratos();
    loadCargos();
    loadEmpleados();
  }, []);

  // Función para convertir string de fecha en objeto Date
  const parseDate = (dateString) => parse(dateString, 'yyyy-MM-dd', new Date());

  // Filtrar empleados con contratos válidos dentro del mes y año seleccionados
  const filteredEmpleados = empleados.filter((empleado) => {
    const contrato = contratos.find((cont) => cont.id === empleado.id);
    

    if (!contrato) return false; // Si no tiene contrato, no incluir

    const fechaInicio = parseDate(contrato.fechaInicio.split('T')[0]);
    const fechaFin = contrato.fechaFin ? parseDate(contrato.fechaFin.split('T')[0]) : new Date(); // Si no tiene fecha fin, asumir presente

   

    // Crear un rango de fechas del mes seleccionado
    const startOfMonth = new Date(selectedYear, selectedMonth, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    
   
     // Verificar si cualquier día del mes seleccionado cae dentro del periodo del contrato
     return isWithinInterval(startOfMonth, { start: fechaInicio, end: fechaFin }) ||
     isWithinInterval(endOfMonth, { start: fechaInicio, end: fechaFin }) ||
     (fechaInicio <= endOfMonth && fechaFin >= startOfMonth);
  });

  
  const handleEdit = (id) => {
    navigate(`/asistencias/correccion/${id}?month=${selectedMonth + 1}&year=${selectedYear}`);
 
  };

  const getCargoName = (id) => {
    const cargo = cargos.find(dep => dep.id === id);
    return cargo ? cargo.nombre : 'Desconocido';
  };

  const getEmpleadoClass = (id) => {
    const contrato = contratos.find((cont) => cont.id === id);
    return contrato ? `${contrato.tipoEmpleado} ` : 'desconocido';
  };

  // Cambiar mes seleccionado
  const handleMonthChange = (increment) => {
    const newMonth = selectedMonth + increment;
    if (newMonth > 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else if (newMonth < 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(newMonth);
    }
  };

  return (
    <MainCard title="Gestión de Asistencias">
      <Box sx={{ p: 2 }}>
        {/* Top Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
            <IconButton onClick={() => handleMonthChange(-1)}>
              <ArrowBackIos />
            </IconButton>
            <InputBase
              value={format(new Date(selectedYear, selectedMonth), 'MMMM').toUpperCase()}
              sx={{ border: '1px solid #ccc', px: 1, borderRadius: 1, width: '80px' }}
              readOnly
            />
            <IconButton onClick={() => handleMonthChange(1)}>
              <ArrowForwardIos />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
            <IconButton onClick={() => setSelectedYear(selectedYear - 1)}>
              <ArrowBackIos />
            </IconButton>
            <InputBase
              value={selectedYear}
              sx={{ border: '1px solid #ccc', px: 1, borderRadius: 1, width: '80px' }}
              readOnly
            />
            <IconButton onClick={() => setSelectedYear(selectedYear + 1)}>
              <ArrowForwardIos />
            </IconButton>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Código Alfa</TableCell>
                <TableCell>Nombre Completo</TableCell>
                <TableCell>Clase</TableCell>
                <TableCell>R/Con Error</TableCell>
                <TableCell>R/Sin Error</TableCell>
                <TableCell>Proceso</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>Cargando...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7}>Error: {error}</TableCell>
                </TableRow>
              ) : filteredEmpleados.length > 0 ? (
                filteredEmpleados.map((empleado, index) => (
                  <TableRow key={empleado.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{empleado.cedula}</TableCell>
                    <TableCell>
                      {empleado.nombre} {empleado.apellidoPaterno}
                      <br />
                      <Typography component="span" sx={{ fontSize: '12px' }}>
                        {getCargoName(empleado.cargoId)}
                      </Typography>
                    </TableCell>
                    <TableCell>{getEmpleadoClass(empleado.id)}</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 1 }}
                        onClick={() => handleEdit(empleado.id)}
                      >
                        Corregir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>No hay asistencias disponibles para el mes seleccionado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MainCard>
  );
};
