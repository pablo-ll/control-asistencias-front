import { useDispatch, useSelector } from 'react-redux';
import { fetchSolicitudes, createSolicitud, updateSolicitud, deleteSolicitud, setActiveSolicitud, clearActiveSolicitud } from '../store/gestion/solicitudSlice';

export const useSolicitudStore = () => {
  const dispatch = useDispatch();
  const { solicitudes, activeSolicitud, isLoading, error } = useSelector((state) => state.solicitud);
    
  const loadSolicitudes = () => {
    dispatch(fetchSolicitudes());
  };

  const saveSolicitud = (solicitud) => {
    console.log(solicitud, 'save');
    if (solicitud.id) {
        
      dispatch(updateSolicitud(solicitud));
    } else {
      dispatch(createSolicitud(solicitud));
    }
  };

  const selectSolicitud = (solicitud) => {
    dispatch(setActiveSolicitud(solicitud));
  };

  const clearSelectedSolicitud = () => {
    dispatch(clearActiveSolicitud());
  };

  const removeSolicitud = (id) => {
    dispatch(deleteSolicitud(id));
  };

  return {
    solicitudes,
    activeSolicitud,
    isLoading,
    error,
    loadSolicitudes,
    saveSolicitud,
    selectSolicitud,
    clearSelectedSolicitud,
    removeSolicitud,
  };
};
