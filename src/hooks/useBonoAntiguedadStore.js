import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBonoAntiguedad,
  createBonoAntiguedad,
  updateBonoAntiguedad,
  deleteBonoAntiguedad,
  setActiveBonoAntiguedad,
  clearActiveBonoAntiguedad
} from '../store/gestion/bonoAntiguedadSlice';

export const useBonoAntiguedadStore = () => {
  const dispatch = useDispatch();
  const { items, activeBonoAntiguedad, isLoading, error } = useSelector((state) => state.bonoAntiguedad);
    
  const loadBonoAntiguedad = () => {
    dispatch(fetchBonoAntiguedad());
  };

  const saveBonoAntiguedad = (bonoAntiguedad) => {
    if (bonoAntiguedad.id) {
      dispatch(updateBonoAntiguedad(bonoAntiguedad));
    } else {
      dispatch(createBonoAntiguedad(bonoAntiguedad));
    }
  };

  const selectBonoAntiguedad = (bonoAntiguedad) => {
    dispatch(setActiveBonoAntiguedad(bonoAntiguedad));
  };

  const clearSelectedBonoAntiguedad = () => {
    dispatch(clearActiveBonoAntiguedad());
  };

  const removeBonoAntiguedad = (id) => {
    dispatch(deleteBonoAntiguedad(id));
  };

  return {
    items,
    activeBonoAntiguedad,
    isLoading,
    error,
    loadBonoAntiguedad,
    saveBonoAntiguedad,
    selectBonoAntiguedad,
    clearSelectedBonoAntiguedad,
    removeBonoAntiguedad,
  };
};
