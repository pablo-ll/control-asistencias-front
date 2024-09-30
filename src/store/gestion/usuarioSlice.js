import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { controlAsistenciaApi } from '../../api';

// Async actions
export const fetchUsuarios = createAsyncThunk(
  'usuarios/fetchUsuarios',
  async (_, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.get('/usuarios/listar');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createUsuario = createAsyncThunk(
  'usuarios/createUsuario',
  async (newUsuario, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.post('/usuarios/crear', newUsuario);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUsuario = createAsyncThunk(
  'usuarios/updateUsuario',
  async (usuario, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.put(`/usuarios/modificar/${usuario.id}`, usuario);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await api.post(`/users/${userId}/change-password`, {
      currentPassword,
      newPassword
    });
    // Manejar la respuesta exitosa
  } catch (error) {
    // Manejar el error
  }
};

export const deleteUsuario = createAsyncThunk(
  'usuarios/deleteUsuario',
  async (id, { rejectWithValue }) => {
    try {
      await controlAsistenciaApi.delete(`/usuarios/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const usuarioSlice = createSlice({
  name: 'usuarios',
  initialState: {
    isLoading: false,
    usuarios: [],
    activeUsuario: null,
    error: null,
  },
  reducers: {
    setActiveUsuario: (state, { payload }) => {
      state.activeUsuario = payload;
    },
    clearActiveUsuario: (state) => {
      state.activeUsuario = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.usuarios = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchUsuarios.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.usuarios = [];
      })
      .addCase(createUsuario.fulfilled, (state, { payload }) => {
        state.usuarios.push(payload);
      })
      .addCase(updateUsuario.fulfilled, (state, { payload }) => {
        state.usuarios = state.usuarios.map(item => item.id === payload.id ? payload : item);
      })
      .addCase(deleteUsuario.fulfilled, (state, { payload }) => {
        state.usuarios = state.usuarios.filter(item => item.id !== payload);
      });
  },
});

export const { setActiveUsuario, clearActiveUsuario } = usuarioSlice.actions;

export default usuarioSlice.reducer;
