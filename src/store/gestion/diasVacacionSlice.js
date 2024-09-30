import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { controlAsistenciaApi } from '../../api';

// Async actions
export const fetchDiasVacacion = createAsyncThunk(
  'diasVacacion/fetchDiasVacacion',
  async (_, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.get('/parametros/dias-vacacion/listar');
      console.log('listar', response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createDiasVacacion = createAsyncThunk(
  'diasVacacion/createDiasVacacion',
  async (newDiasVacacion, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.post('/parametros/dias-vacacion/crear', newDiasVacacion);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDiasVacacion = createAsyncThunk(
  'diasVacacion/updateDiasVacacion',
  async (diasVacacion, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.put(`/parametros/dias-vacacion/modificar/${diasVacacion.id}`, diasVacacion);
      console.log('actualizar', response.data)
      return response.data;
     
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDiasVacacion = createAsyncThunk(
  'diasVacacion/deleteDiasVacacion',
  async (id, { rejectWithValue }) => {
    try {
      await controlAsistenciaApi.delete(`/parametros/dias-vacacion/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const diasVacacionSlice = createSlice({
  name: 'diasVacacion',
  initialState: {
    isLoading: false,
    items: [],
    activeDiasVacacion: null,
    error: null,
  },
  reducers: {
    setActiveDiasVacacion: (state, { payload }) => {
      state.activeDiasVacacion = payload;
    },
    clearActiveDiasVacacion: (state) => {
      state.activeDiasVacacion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiasVacacion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDiasVacacion.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.items = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchDiasVacacion.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.items = [];
      })
      .addCase(createDiasVacacion.fulfilled, (state, { payload }) => {
        state.items.push(payload);
      })
      .addCase(updateDiasVacacion.fulfilled, (state, { payload }) => {
        state.items = state.items.map(item => item.id === payload.id ? payload : item);
      })
      .addCase(deleteDiasVacacion.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(item => item.id !== payload);
      });
  },
});

export const { setActiveDiasVacacion, clearActiveDiasVacacion } = diasVacacionSlice.actions;
