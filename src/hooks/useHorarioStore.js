import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchHorarios, 
  createHorario, 
  updateHorario, 
  deleteHorario, 
  setActiveHorario, 
  clearActiveHorario 
} from '../store/gestion/horarioSlice';

export const useHorarioStore = () => {
  const dispatch = useDispatch();
  const { horarios, activeHorario, isLoading, error } = useSelector((state) => state.horario);
    
  const loadHorarios = () => {
    dispatch(fetchHorarios());
  };

  const saveHorario = (horario) => {
    console.log(horario, 'saveHorario');
    if (horario.id) {
      dispatch(updateHorario(horario));
    } else {
      dispatch(createHorario(horario));
    }
  };

  const selectHorario = (horario) => {
    dispatch(setActiveHorario(horario));
  };

  const clearSelectedHorario = () => {
    dispatch(clearActiveHorario());
  };

  const removeHorario = (id) => {
    dispatch(deleteHorario(id));
  };

  return {
    horarios,
    activeHorario,
    isLoading,
    error,
    loadHorarios,
    saveHorario,
    selectHorario,
    clearSelectedHorario,
    removeHorario,
  };
};
