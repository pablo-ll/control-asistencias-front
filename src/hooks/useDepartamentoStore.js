import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartamentos, createDepartamento, updateDepartamento, deleteDepartamento, setActiveDepartamento, clearActiveDepartamento } from '../store/gestion/departamentoSlice';

export const useDepartamentoStore = () => {
  const dispatch = useDispatch();
  const { items, activeDepartamento, isLoading, error } = useSelector((state) => state.departamento);
    
  const loadDepartamentos = () => {
    dispatch(fetchDepartamentos());
  };

  const saveDepartamento = (departamento) => {
 
    if (departamento.id) {
      dispatch(updateDepartamento(departamento));
    } else {
      dispatch(createDepartamento(departamento));
    }
  };

  const selectDepartamento = (departamento) => {
    dispatch(setActiveDepartamento(departamento));
  };

  const clearSelectedDepartamento = () => {
    dispatch(clearActiveDepartamento());
  };

  const removeDepartamento = (id) => {
    dispatch(deleteDepartamento(id));
  };

  return {
    items,
    activeDepartamento,
    isLoading,
    error,
    loadDepartamentos,
    saveDepartamento,
    selectDepartamento,
    clearSelectedDepartamento,
    removeDepartamento,
  };
};
