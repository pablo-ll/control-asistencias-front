import { useDispatch, useSelector } from 'react-redux';
import { fetchCargos, createCargo, updateCargo, deleteCargo, setActiveCargo, clearActiveCargo } from '../store/gestion/cargoSlice';

export const useCargoStore = () => {
  const dispatch = useDispatch();
  const { cargos, activeCargo, isLoading, error } = useSelector((state) => state.cargo);
    
  const loadCargos = () => {
    dispatch(fetchCargos());
  };

  const saveCargo = (cargo) => {
    console.log(cargo)
    if (cargo.id) {
      dispatch(updateCargo(cargo));
    } else {
      dispatch(createCargo(cargo));
    }
  };

  const selectCargo = (cargo) => {
    dispatch(setActiveCargo(cargo));
  };

  const clearSelectedCargo = () => {
    dispatch(clearActiveCargo());
  };

  const removeCargo = (id) => {
    dispatch(deleteCargo(id));
  };

  return {
    cargos,
    activeCargo,
    isLoading,
    error,
    loadCargos,
    saveCargo,
    selectCargo,
    clearSelectedCargo,
    removeCargo,
  };
};
