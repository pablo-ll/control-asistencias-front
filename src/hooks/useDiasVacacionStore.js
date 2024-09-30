import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDiasVacacion,
  createDiasVacacion,
  updateDiasVacacion,
  deleteDiasVacacion,
  setActiveDiasVacacion,
  clearActiveDiasVacacion
} from '../store/gestion/diasVacacionSlice';

export const useDiasVacacionStore = () => {
  const dispatch = useDispatch();
  const { items, activeDiasVacacion, isLoading, error } = useSelector((state) => state.diasVacacion);
    
  const loadDiasVacacion = () => {
    dispatch(fetchDiasVacacion());
  };

  const saveDiasVacacion = (diasVacacion) => {
    if (diasVacacion.id) {
      dispatch(updateDiasVacacion(diasVacacion));
    } else {
      dispatch(createDiasVacacion(diasVacacion));
    }
  };

  const selectDiasVacacion = (diasVacacion) => {
    dispatch(setActiveDiasVacacion(diasVacacion));
  };

  const clearSelectedDiasVacacion = () => {
    dispatch(clearActiveDiasVacacion());
  };

  const removeDiasVacacion = (id) => {
    dispatch(deleteDiasVacacion(id));
  };

  return {
    items,
    activeDiasVacacion,
    isLoading,
    error,
    loadDiasVacacion,
    saveDiasVacacion,
    selectDiasVacacion,
    clearSelectedDiasVacacion,
    removeDiasVacacion,
  };
};
