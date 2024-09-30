import { useDispatch, useSelector } from 'react-redux';
import {  saveAsistencias } from '../store/gestion/asistenciaSlice';
export const useAsistenciaStore = () => {
  const dispatch = useDispatch();
  const { asistencias, isLoading, error } = useSelector((state) => state.asistencias);

 
  // Guardar asistencias generales
  // Guardar asistencias por empleado
  const saveAsistenciasEmpleado = (asistencias, empleadoId) => {
    dispatch(saveAsistencias({ asistencias, empleadoId }));
  };

  return {
    asistencias,
    isLoading,
    error,
    saveAsistenciasEmpleado,
  };
};
