import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { controlAsistenciaApi } from '../../api';

// Async actions
export const fetchBonoAntiguedad = createAsyncThunk(
  'bonoAntiguedad/fetchBonoAntiguedad',
  async (_, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.get('/parametros/bono-antiguedad/listar');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createBonoAntiguedad = createAsyncThunk(
  'bonoAntiguedad/createBonoAntiguedad',
  async (newBonoAntiguedad, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.post('/parametros/bono-antiguedad/crear', newBonoAntiguedad);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBonoAntiguedad = createAsyncThunk(
  'bonoAntiguedad/updateBonoAntiguedad',
  async (bonoAntiguedad, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.put(`/parametros/bono-antiguedad/modificar/${bonoAntiguedad.id}`, bonoAntiguedad);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBonoAntiguedad = createAsyncThunk(
  'bonoAntiguedad/deleteBonoAntiguedad',
  async (id, { rejectWithValue }) => {
    try {
      await controlAsistenciaApi.delete(`/parametros/bono-antiguedad/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const bonoAntiguedadSlice = createSlice({
  name: 'bonoAntiguedad',
  initialState: {
    isLoading: false,
    items: [],
    activeBonoAntiguedad: null,
    error: null,
  },
  reducers: {
    setActiveBonoAntiguedad: (state, { payload }) => {
      state.activeBonoAntiguedad = payload;
    },
    clearActiveBonoAntiguedad: (state) => {
      state.activeBonoAntiguedad = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBonoAntiguedad.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBonoAntiguedad.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.items = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchBonoAntiguedad.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.items = [];
      })
      .addCase(createBonoAntiguedad.fulfilled, (state, { payload }) => {
        state.items.push(payload);
      })
      .addCase(updateBonoAntiguedad.fulfilled, (state, { payload }) => {
        state.items = state.items.map(item => item.id === payload.id ? payload : item);
      })
      .addCase(deleteBonoAntiguedad.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(item => item.id !== payload);
      });
  },
});

export const { setActiveBonoAntiguedad, clearActiveBonoAntiguedad } = bonoAntiguedadSlice.actions;
