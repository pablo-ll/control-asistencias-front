import { useDispatch, useSelector } from 'react-redux';
import { fetchUsuarios, createUsuario, updateUsuario, deleteUsuario, setActiveUsuario, clearActiveUsuario } from '../store/gestion/usuarioSlice';

export const useUsuarioStore = () => {
  const dispatch = useDispatch();
  const { usuarios, activeUsuario, isLoading, error } = useSelector((state) => state.usuario);

  const loadUsuarios = () => {
    dispatch(fetchUsuarios());
  };

  const saveUsuario = (usuario) => {
    console.log(usuario);
    if (usuario.id) {
      dispatch(updateUsuario(usuario));
    } else {
      dispatch(createUsuario(usuario));
    }
  };

  const selectUsuario = (usuario) => {
    dispatch(setActiveUsuario(usuario));
  };

  const clearSelectedUsuario = () => {
    dispatch(clearActiveUsuario());
  };

  const removeUsuario = (id) => {
    dispatch(deleteUsuario(id));
  };

  return {
    usuarios,
    activeUsuario,
    isLoading,
    error,
    loadUsuarios,
    saveUsuario,
    selectUsuario,
    clearSelectedUsuario,
    removeUsuario,
  };
};
