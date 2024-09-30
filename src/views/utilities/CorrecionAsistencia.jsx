import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  InputBase,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { useAsistenciaStore, useContratoStore, useEmpleadoStore, useHorarioStore } from 'hooks';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CustomTimePicker from './asistencias/CustomTimePicker';
import Swal from 'sweetalert2';

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const CorrecionAsistencia = () => {
  const { horarios, loadHorarios } = useHorarioStore();
  const { empleados, loadEmpleados, saveEmpleado } = useEmpleadoStore();
  const { id } = useParams();
  const [empleado, setEmpleado] = useState(null);
  const [rows, setRows] = useState([]);
  const [selectedHorarioId, setSelectedHorarioId] = useState(null);
  const [horarioTipo, setHorarioTipo] = useState('');
  const navigate = useNavigate();
  const { contratos, loadContratos } = useContratoStore();
  const location = useLocation();
  const { asistencias, saveAsistenciasEmpleado, isLoading, error } = useAsistenciaStore();
  const [inputValues, setInputValues] = useState({});

  // Obtener los parámetros de la URL
  const searchParams = new URLSearchParams(location.search);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  useEffect(() => {
    loadContratos();
    loadHorarios();
    loadEmpleados();
  }, []);

  useEffect(() => {
    if (id && empleados.length > 0 && horarios.length > 0 && contratos.length > 0) {
      const foundEmpleado = empleados.find((emp) => emp.id === parseInt(id));
      if (foundEmpleado) {
        setEmpleado(foundEmpleado);
        if (foundEmpleado.horariosSeleccionados.length > 0) {
          setSelectedHorarioId(foundEmpleado.horariosSeleccionados[0]);
          const horarioSeleccionado = horarios.find((h) => h.id === foundEmpleado.horariosSeleccionados[0]);
          setHorarioTipo(horarioSeleccionado.tipo);
        }
      }
    }
  }, [id, empleados, horarios, contratos]);

  useEffect(() => {
    if (empleado && selectedHorarioId) {
      processAsistencias(empleado);
    }
  }, [empleado, selectedHorarioId, month, year]);

  const processAsistencias = (empleado) => {
    if (!empleado) return;

    const contrato = contratos.find((cont) => cont.empleadoId === empleado.id);
    if (!contrato) return;

    const horarioSeleccionado = horarios.find((h) => h.id === selectedHorarioId);
    if (!horarioSeleccionado) return;

    const fechaInicioMes = new Date(year, month - 1, 1);
    const fechaFinMes = new Date(year, month, 0);
    const fechaActual = new Date();

    const fechaInicioContrato = new Date(contrato.fechaInicio);
    const fechaFinContrato = contrato.fechaFin ? new Date(contrato.fechaFin) : new Date('9999-12-31');

    const fechaInicio = new Date(Math.max(fechaInicioMes, fechaInicioContrato));
    const fechaFin = new Date(Math.min(fechaFinMes, fechaFinContrato, fechaActual));

    const asistenciasMap = new Map(empleado.asistencias.map((asist) => [asist.fecha, asist]));

    const diasLaborales = [];

    for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
      const diaSemana = diasSemana[d.getDay()];
      const fecha = d.toISOString().split('T')[0];

      if (horarioSeleccionado.dias.includes(diaSemana)) {
        const asistencia = asistenciasMap.get(fecha);
        const inputValue = inputValues[fecha] || {};

        diasLaborales.push({
          fecha: fecha,
          horaEntrada: horarioSeleccionado.horaEntrada,
          horaSalidaAlmuerzo: horarioSeleccionado.horaSalidaAlmuerzo,
          horaReingreso: horarioSeleccionado.horaReingreso,
          horaSalida:
            horarioSeleccionado.tipo === 'completo'
              ? horarioSeleccionado.horaSalidaFinal || '00:00'
              : horarioSeleccionado.horaSalida || '00:00',
          checkInMañana:
            inputValue.checkInMañana ||
            (asistencia && !asistencia.esVacacion && !asistencia.esBajaMedica ? asistencia.horaEntrada : '00:00'),
          checkOutMañana:
            inputValue.checkOutMañana ||
            (asistencia && !asistencia.esVacacion && !asistencia.esBajaMedica ? asistencia.horaSalidaAlmuerzo : '00:00'),
          checkInTarde:
            inputValue.checkInTarde ||
            (asistencia && !asistencia.esVacacion && !asistencia.esBajaMedica ? asistencia.horaEntradaAlmuerzo : '00:00'),
          checkOutTarde:
            inputValue.checkOutTarde ||
            (asistencia && !asistencia.esVacacion && !asistencia.esBajaMedica ? asistencia.horaSalida : '00:00'),

          llegadaTardeMañana:
            inputValue.llegadaTardeMañana ||
            calcularDiferenciaTarde(
              horarioSeleccionado.horaEntrada,
              asistencia && !asistencia.esVacacion && !asistencia.esBajaMedica ? asistencia.horaEntrada : '00:00'
            ),
          salidaTempranaMañana:
            inputValue.salidaTempranaMañana ||
            (horarioSeleccionado.tipo === 'completo'
              ? calcularDiferenciaTemprano(
                  horarioSeleccionado.horaSalidaAlmuerzo,
                  asistencia && !asistencia.esVacacion && !asistencia.esBajaMedica ? asistencia.horaSalidaAlmuerzo : '00:00'
                )
              : '00:00'),
          llegadaTardeTarde:
            inputValue.llegadaTardeTarde ||
            (horarioSeleccionado.tipo === 'completo'
              ? calcularDiferenciaTarde(
                  horarioSeleccionado.horaReingreso,
                  asistencia && !asistencia.esVacacion && !asistencia.esBajaMedica ? asistencia.horaEntradaAlmuerzo : '00:00'
                )
              : '00:00'),
          salidaTempranaTarde:
            inputValue.salidaTempranaTarde ||
            (horarioSeleccionado.tipo === 'completo'
              ? calcularDiferenciaTemprano(
                  horarioSeleccionado.horaSalidaFinal,
                  asistencia && !asistencia.esVacacion && !asistencia.esBajaMedica ? asistencia.horaSalida : '00:00'
                )
              : calcularDiferenciaTemprano(horarioSeleccionado.horaSalida, asistencia ? asistencia.horaSalida : '00:00')),

          observaciones: inputValue.observaciones || (asistencia ? asistencia.observaciones : ''),

          ausente: asistencia ? asistencia.ausente : false,
          permiso: asistencia ? asistencia.permiso : false,
          correccion: asistencia ? asistencia.correccion : false,
          esVacacion: asistencia ? asistencia.esVacacion : false,
          esBajaMedica: asistencia ? asistencia.esBajaMedica : false
        });
      }
    }

    setRows(diasLaborales);
  };

  
  const calcularDiferenciaTarde = (hora1, hora2) => {
    const [h1, m1] = hora1.split(':').map(Number);
    const [h2, m2] = hora2.split(':').map(Number);

    // Convertir horas y minutos a minutos totales
    const totalMin1 = h1 * 60 + m1;
    const totalMin2 = h2 * 60 + m2;

    if (totalMin2 < totalMin1) {
      return '00:00';
    }

    const diff = totalMin2 - totalMin1;

    const h = Math.floor(diff / 60);
    const m = diff % 60;

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const calcularDiferenciaTemprano = (hora1, hora2) => {
    const [h1, m1] = hora1.split(':').map(Number);
    const [h2, m2] = hora2.split(':').map(Number);

    const totalMin1 = h1 * 60 + m1;
    const totalMin2 = h2 * 60 + m2;

    if (totalMin1 < totalMin2) {
      return '00:00';
    }

    const diff = totalMin1 - totalMin2;

    const h = Math.floor(diff / 60);
    const m = diff % 60;

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const handleHorarioChange = (event) => {
    const newHorarioId = event.target.value;
    setSelectedHorarioId(newHorarioId);
    const horario = horarios.find((h) => h.id === newHorarioId);
    setHorarioTipo(horario.horaSalidaAlmuerzo ? 'completo' : 'continuo');
  };
  const shouldShowColumn = (column) => {
    if (horarioTipo === 'completo') return true;
    if (horarioTipo === 'continuo') {
      return !column.includes('Almuerzo') && !column.includes('(Mañana)') && !column.includes('(Tarde)');
    }
    return false;
  };

  const handleInputChange = (fecha, field, value) => {
    setInputValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [fecha]: {
          ...prevValues[fecha],
          [field]: value
        }
      };

      if (field === 'checkInMañana') {
        newValues[fecha].llegadaTardeMañana = calcularDiferenciaTarde(rows.find((r) => r.fecha === fecha).horaEntrada, value);
      } else if (field === 'checkOutMañana') {
        newValues[fecha].salidaTempranaMañana = calcularDiferenciaTemprano(rows.find((r) => r.fecha === fecha).horaSalidaAlmuerzo, value);
      } else if (field === 'checkInTarde') {
        newValues[fecha].llegadaTardeTarde = calcularDiferenciaTarde(rows.find((r) => r.fecha === fecha).horaReingreso, value);
      } else if (field === 'checkOutTarde') {
        newValues[fecha].salidaTempranaTarde = calcularDiferenciaTemprano(rows.find((r) => r.fecha === fecha).horaSalida, value);
      }

      return newValues;
    });
  };

  const handleSaveChanges = async () => {
    try {
      if (empleado) {
        const updatedAsistencias = rows.map((row) => {
          const inputValue = inputValues[row.fecha] || {};
          return {
            fecha: row.fecha,
            horaEntrada: inputValue.checkInMañana || row.checkInMañana,
            horaSalidaAlmuerzo: horarioTipo === 'completo' ? inputValue.checkOutMañana || row.checkOutMañana : undefined,
            horaEntradaAlmuerzo: horarioTipo === 'completo' ? inputValue.checkInTarde || row.checkInTarde : undefined,
            horaSalida: inputValue.checkOutTarde || row.checkOutTarde,
            observaciones: inputValue.observaciones || row.observaciones,
            ausente: row.ausente,
            permiso: row.permiso,
            correccion: true,
            esVacacion: row.esVacacion,
            esBajaMedica: row.esBajaMedica,

            llegadaTardeMañana: inputValue.llegadaTardeMañana || row.llegadaTardeMañana,
            salidaTempranaMañana: inputValue.salidaTempranaMañana || row.salidaTempranaMañana,
            llegadaTardeTarde: inputValue.llegadaTardeTarde || row.llegadaTardeTarde,
            salidaTempranaTarde: inputValue.salidaTempranaTarde || row.salidaTempranaTarde
          };
        });

        await saveAsistenciasEmpleado(updatedAsistencias, empleado.id);
      }

      Swal.fire({
        icon: 'success',
        title: 'Asistencias guardadas',
        text: `Las asistencias se han grabado exitosamente.`,
        timer: 3000,
        showConfirmButton: false
      });

      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Hubo un problema al grabar las asistencias del empleado. Inténtalo de nuevo.`
      });
    }
  };

  if (!empleado) return <Typography>Cargando...</Typography>;

  return (
    <MainCard title="Corrección de Asistencias">
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h3" fontWeight="bold">
              {empleado.nombre} {empleado.apellidoPaterno} {empleado.apellidoMaterno}
            </Typography>
            <Typography variant="subtitle1">CI: {empleado.cedula}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2"> Grabar antes de cambiar de horario!!</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Filtrar por Visualización:
          </Typography>
          <Select value={selectedHorarioId} onChange={handleHorarioChange} fullWidth sx={{ maxWidth: 300 }}>
            {empleado.horariosSeleccionados.map((horarioId) => {
              const horario = horarios.find((h) => h.id === horarioId);
              return (
                <MenuItem key={horarioId} value={horarioId}>
                  {horario ? horario.nombre : 'Horario Desconocido'}
                </MenuItem>
              );
            })}
          </Select>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                {shouldShowColumn('Entrada') && <TableCell>Hora Entrada</TableCell>}
                {shouldShowColumn('Salida Almuerzo') && <TableCell>Salida Almuerzo</TableCell>}
                {shouldShowColumn('Entrada Almuerzo') && <TableCell>Entrada Almuerzo</TableCell>}
                {shouldShowColumn('Salida') && <TableCell>Hora Salida</TableCell>}
                {shouldShowColumn('Check In ') && <TableCell>Check In Mañana</TableCell>}
                {shouldShowColumn('Check Out (Mañana)') && <TableCell>Check Out Mañana</TableCell>}
                {shouldShowColumn('Check In (Tarde)') && <TableCell>Check In Tarde</TableCell>}
                {shouldShowColumn('Check Out ') && <TableCell>Check Out Tarde</TableCell>}

                <TableCell>Observaciones</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.fecha}>
                  <TableCell>{row.fecha}</TableCell>
                  {shouldShowColumn('Entrada') && <TableCell>{row.horaEntrada}</TableCell>}
                  {shouldShowColumn('Salida Almuerzo') && <TableCell>{row.horaSalidaAlmuerzo}</TableCell>}
                  {shouldShowColumn('Entrada Almuerzo') && <TableCell>{row.horaReingreso}</TableCell>}
                  {shouldShowColumn('Salida') && <TableCell>{row.horaSalida}</TableCell>}
                  {shouldShowColumn('Check In ') && (
                    <TableCell>
                      <CustomTimePicker
                        label="Entrada"
                        value={inputValues[row.fecha]?.checkInMañana || row.checkInMañana}
                        onChange={handleInputChange}
                        row={row}
                        check="checkInMañana"
                      />

                      {row.esBajaMedica || row.esVacacion ? null : (
                        <Typography
                          variant="caption"
                          sx={{
                            color: (inputValues[row.fecha]?.llegadaTardeMañana || row.llegadaTardeMañana) !== '00:00' ? 'red' : 'inherit'
                          }}
                        >
                          {`Tarde: ${inputValues[row.fecha]?.llegadaTardeMañana || row.llegadaTardeMañana}`}
                        </Typography>
                      )}
                    </TableCell>
                  )}
                  {shouldShowColumn('Check Out (Mañana)') && (
                    <TableCell>
                      <CustomTimePicker
                        label="Receso"
                        value={inputValues[row.fecha]?.checkOutMañana || row.checkOutMañana}
                        onChange={handleInputChange}
                        row={row}
                        check="checkOutMañana"
                      />

                      {row.esBajaMedica || row.esVacacion ? null : (
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              (inputValues[row.fecha]?.salidaTempranaMañana || row.salidaTempranaMañana) !== '00:00' ? 'red' : 'inherit'
                          }}
                        >
                          {`Temprano: ${inputValues[row.fecha]?.salidaTempranaMañana || row.salidaTempranaMañana}`}
                        </Typography>
                      )}
                    </TableCell>
                  )}
                  {shouldShowColumn('Check In (Tarde)') && (
                    <TableCell>
                      <CustomTimePicker
                        label="Reingreso"
                        value={inputValues[row.fecha]?.checkInTarde || row.checkInTarde}
                        onChange={handleInputChange}
                        row={row}
                        check="checkInTarde"
                      />

                      {row.esBajaMedica || row.esVacacion ? null : (
                        <Typography
                          variant="caption"
                          sx={{
                            color: (inputValues[row.fecha]?.llegadaTardeTarde || row.llegadaTardeTarde) !== '00:00' ? 'red' : 'inherit'
                          }}
                        >
                          {`Tarde: ${inputValues[row.fecha]?.llegadaTardeTarde || row.llegadaTardeTarde}`}
                        </Typography>
                      )}
                    </TableCell>
                  )}
                  {shouldShowColumn('Check Out ') && (
                    <TableCell>
                      <CustomTimePicker
                        label="Salida"
                        value={inputValues[row.fecha]?.checkOutTarde || row.checkOutTarde}
                        onChange={handleInputChange}
                        row={row}
                        check="checkOutTarde"
                      />

                      {row.esBajaMedica || row.esVacacion ? null : (
                        <Typography
                          variant="caption"
                          sx={{
                            color: (inputValues[row.fecha]?.salidaTempranaTarde || row.salidaTempranaTarde) !== '00:00' ? 'red' : 'inherit'
                          }}
                        >
                          {`Temprano: ${inputValues[row.fecha]?.salidaTempranaTarde || row.salidaTempranaTarde}`}
                        </Typography>
                      )}
                    </TableCell>
                  )}

                  <TableCell>
                    <InputBase
                      placeholder="Observaciones"
                      fullWidth
                      value={inputValues[row.fecha]?.observaciones || row.observaciones || ''}
                      onChange={(e) => handleInputChange(row.fecha, 'observaciones', e.target.value)}
                      sx={{
                        bgcolor: '#eee',
                        borderRadius: 1,
                        px: 1,
                        border: '1px solid #ccc'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {row.ausente
                      ? 'Ausente'
                      : (inputValues[row.fecha]?.checkInMañana || row.checkInMañana) === '00:00' ||
                          (inputValues[row.fecha]?.checkInMañana || row.checkInMañana) === '00:00:00'
                        ? 'Falta'
                        : 'Presente'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="contained" color="primary" sx={{ mr: 2, backgroundColor: 'blue' }} onClick={handleSaveChanges}>
            Grabar
          </Button>
          <Button variant="contained" color="error" onClick={() => navigate('/asistencias')}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </MainCard>
  );
};
