import { useDispatch, useSelector } from 'react-redux';
import { fetchEmpleados, createEmpleado, updateEmpleado, deleteEmpleado, setActiveEmpleado, clearActiveEmpleado } from '../store/gestion/empleadoSlice';

export const useEmpleadoStore = () => {
  const dispatch = useDispatch();
  const { empleados, activeEmpleado, isLoading, error } = useSelector((state) => state.empleado);
    
  const loadEmpleados = () => {
    dispatch(fetchEmpleados());
  };

  

  const saveEmpleado = (empleado) => {
    console.log(empleado)
    if (empleado.id) {
      dispatch(updateEmpleado(empleado));
    } else {
      dispatch(createEmpleado(empleado));
    }
  };

  const selectEmpleado = (empleado) => {
    dispatch(setActiveEmpleado(empleado));
  };

  const clearSelectedEmpleado = () => {
    dispatch(clearActiveEmpleado());
  };

  const removeEmpleado = (id) => {
    dispatch(deleteEmpleado(id));
  };

  return {
    empleados,
    activeEmpleado,
    isLoading,
    error,
    loadEmpleados,
    saveEmpleado,
    selectEmpleado,
    clearSelectedEmpleado,
    removeEmpleado,
   
  };
};
