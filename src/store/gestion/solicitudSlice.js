import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { controlAsistenciaApi } from '../../api';

// Async actions
export const fetchSolicitudes = createAsyncThunk(
  'solicitudes/fetchSolicitudes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.get('/solicitudes/listar');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createSolicitud = createAsyncThunk(
  'solicitudes/createSolicitud',
  async (newSolicitud, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.post('/solicitudes/crear', newSolicitud);
      console.log(response.data, 'formulario resp');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSolicitud = createAsyncThunk(
  'solicitudes/updateSolicitud',
  async (solicitud, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.put(`/solicitudes/modificar/${solicitud.id}`, solicitud);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSolicitud = createAsyncThunk(
  'solicitudes/deleteSolicitud',
  async (id, { rejectWithValue }) => {
    try {
      await controlAsistenciaApi.delete(`/solicitudes/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const solicitudSlice = createSlice({
  name: 'solicitudes',
  initialState: {
    isLoading: false,
    solicitudes: [],
    activeSolicitud: null,
    error: null,
  },
  reducers: {
    setActiveSolicitud: (state, { payload }) => {
      state.activeSolicitud = payload;
    },
    clearActiveSolicitud: (state) => {
      state.activeSolicitud = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolicitudes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSolicitudes.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.solicitudes = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchSolicitudes.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.solicitudes = [];
      })
      .addCase(createSolicitud.fulfilled, (state, { payload }) => {
        state.solicitudes.push(payload);
      })
      .addCase(updateSolicitud.fulfilled, (state, { payload }) => {
        state.solicitudes = state.solicitudes.map(item => item.id === payload.id ? payload : item);
      })
      .addCase(deleteSolicitud.fulfilled, (state, { payload }) => {
        state.solicitudes = state.solicitudes.filter(item => item.id !== payload);
      });
  },
});

export const { setActiveSolicitud, clearActiveSolicitud } = solicitudSlice.actions;
export default solicitudSlice.reducer;
