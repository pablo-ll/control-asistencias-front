import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { controlAsistenciaApi } from '../../api';

// Async actions
export const fetchHorarios = createAsyncThunk(
  'horarios/fetchHorarios',
  async (_, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.get('/parametros/horarios/listar');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createHorario = createAsyncThunk(
  'horarios/createHorario',
  async (newHorario, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.post('/parametros/horarios/crear', newHorario);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateHorario = createAsyncThunk(
  'horarios/updateHorario',
  async (horario, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.put(`/parametros/horarios/modificar/${horario.id}`, horario);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteHorario = createAsyncThunk(
  'horarios/deleteHorario',
  async (id, { rejectWithValue }) => {
    try {
      await controlAsistenciaApi.delete(`/parametros/horarios/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const horarioSlice = createSlice({
  name: 'horarios',
  initialState: {
    isLoading: false,
    horarios: [],
    activeHorario: null,
    error: null,
  },
  reducers: {
    setActiveHorario: (state, { payload }) => {
      state.activeHorario = payload;
    },
    clearActiveHorario: (state) => {
      state.activeHorario = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHorarios.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHorarios.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.horarios = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchHorarios.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.horarios = [];
      })
      .addCase(createHorario.fulfilled, (state, { payload }) => {
        state.horarios.push(payload);
      })
      .addCase(updateHorario.fulfilled, (state, { payload }) => {
        state.horarios = state.horarios.map(item => item.id === payload.id ? payload : item);
      })
      .addCase(deleteHorario.fulfilled, (state, { payload }) => {
        state.horarios = state.horarios.filter(item => item.id !== payload);
      });
  },
});

export const { setActiveHorario, clearActiveHorario } = horarioSlice.actions;

export default horarioSlice.reducer;
