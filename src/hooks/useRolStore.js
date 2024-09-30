import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles, createRol, updateRol, deleteRol, setActiveRol, clearActiveRol } from '../store/gestion/rolSlice';

export const useRolStore = () => {
  const dispatch = useDispatch();
  const { roles, activeRol, isLoading, error } = useSelector((state) => state.roles);
    
  const loadRoles = () => {
    dispatch(fetchRoles());
  };

  const saveRol = (rol) => {
    console.log(rol)
    if (rol.id) {
      dispatch(updateRol(rol));
    } else {
      dispatch(createRol(rol));
    }
  };

  const selectRol = (rol) => {
    dispatch(setActiveRol(rol));
  };

  const clearSelectedRol = () => {
    dispatch(clearActiveRol());
  };

  const removeRol = (id) => {
    dispatch(deleteRol(id));
  };

  return {
    roles,
    activeRol,
    isLoading,
    error,
    loadRoles,
    saveRol,
    selectRol,
    clearSelectedRol,
    removeRol,
  };
};
