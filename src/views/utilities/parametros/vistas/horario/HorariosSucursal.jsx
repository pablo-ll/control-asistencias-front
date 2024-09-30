// HorariosSucursal.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import Swal from 'sweetalert2';
import HorariosList from './HorarioList';
import HorarioModal from './HorarioModal';
import { useHorarioStore } from '../../../../../hooks';

const HorariosSucursal = () => {

  const [isEdit, setIsEdit] = useState(false);
  const { 
    horarios, 
    loadHorarios, 
    saveHorario, 
    selectHorario, 
    clearSelectedHorario, 
    removeHorario, 
    activeHorario,
    isLoading,
    error
  } = useHorarioStore();

  useEffect(() => {
    loadHorarios();
  }, []);

  

  const [modalOpen, setModalOpen] = useState(false);
  const [currentHorario, setCurrentHorario] = useState({
    id: null,
    nombre: '',
    tipo: 'completo',
    horaEntrada: '',
    horaSalidaAlmuerzo: '',
    horaReingreso: '',
    horaSalidaFinal: '',
    horaSalida: '',
    toleranciaEntrada: '',
    toleranciaSalida: '',
    dias: [],
  });

  const handleClose = () => {
    setModalOpen(false);
    clearSelectedHorario();
    setIsEdit(false);
    setCurrentHorario(currentHorario);
  };

  const handleEditHorario = (horario) => {
    console.log(horario, 'handleEditHorario');
    selectHorario(horario);
    setCurrentHorario({
      id: horario.id || null,
      nombre: horario.nombre || '',
      tipo: horario.tipo,
      horaEntrada: horario.horaEntrada || '',
      horaSalidaAlmuerzo: horario.horaSalidaAlmuerzo || '',
      horaReingreso: horario.horaReingreso || '',
      horaSalidaFinal: horario.horaSalidaFinal || '',
      horaSalida: horario.horaSalida || '',
      toleranciaEntrada: horario.toleranciaEntrada || '',
      toleranciaSalida: horario.toleranciaSalida || '',
      dias: horario.dias || [],
      
    });
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleDeleteHorario = (id) => {
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
        removeHorario(id);
        Swal.fire(
          'Eliminado!',
          'El registro ha sido eliminado.',
          'success'
        );
      }
    });
  };
 
  const handleSaveHorario = async (horario) => {
  
    try {
      await saveHorario(horario);
  
      Swal.fire({
        icon: 'success',
        title: isEdit ? 'Horario Actualizado' : 'Horario Guardado',
        text: `El horario ha sido ${isEdit ? 'actualizado' : 'guardado'} exitosamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
  
      setModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Hubo un problema al ${isEdit ? 'actualizar' : 'guardar'} el horario. Inténtalo de nuevo.`,
      });
    }
  };
  

  return (
    <Container sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h3" gutterBottom>
        HORARIOS SUCURSAL
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <Button variant="contained" color="primary" onClick={() => {
          setCurrentHorario({
            id: null,
            nombre: '',
            tipo: 'completo',
            horaEntrada: '',
            horaSalidaAlmuerzo: '',
            horaReingreso: '',
            horaSalidaFinal: '',
            horaSalida: '',
            toleranciaEntrada: '',
            toleranciaSalida: '',
            dias: [],
          });
          setModalOpen(true);
        }}>
          Nuevo
        </Button>
      </Box>

      <HorariosList
        horarios={horarios}
        onEdit={handleEditHorario}
        onDelete={handleDeleteHorario}
      />

      <HorarioModal
        open={modalOpen}
        onClose={handleClose}
        horario={currentHorario}
        onChange={setCurrentHorario}
        onSave={handleSaveHorario}
      />
    </Container>
  );
};

export default HorariosSucursal;