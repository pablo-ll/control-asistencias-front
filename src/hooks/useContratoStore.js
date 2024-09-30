import { useDispatch, useSelector } from 'react-redux';
import { fetchContratos, createContrato, updateContrato, deleteContrato, setActiveContrato, clearActiveContrato } from '../store/gestion/contratoSlice';

export const useContratoStore = () => {
  const dispatch = useDispatch();
  const { contratos, activeContrato, isLoading, error } = useSelector((state) => state.contrato);
    
  const loadContratos = () => {
    dispatch(fetchContratos());
  };

  const saveContrato = (contrato) => {
    console.log(contrato)
    if (contrato.id) {
      dispatch(updateContrato(contrato));
    } else {
      dispatch(createContrato(contrato));
    }
  };

  const selectContrato = (contrato) => {
    dispatch(setActiveContrato(contrato));
  };

  const clearSelectedContrato = () => {
    dispatch(clearActiveContrato());
  };

  const removeContrato = (id) => {
    dispatch(deleteContrato(id));
  };

  return {
    contratos,
    activeContrato,
    isLoading,
    error,
    loadContratos,
    saveContrato,
    selectContrato,
    clearSelectedContrato,
    removeContrato,
  };
};