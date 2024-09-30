import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { controlAsistenciaApi } from '../../api';

// Async actions
export const fetchContratos = createAsyncThunk(
  'contratos/fetchContratos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.get('/contratos/listar');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createContrato = createAsyncThunk(
  'contratos/createContrato',
  async (newContrato, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.post('/contratos/crear', newContrato);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateContrato = createAsyncThunk(
  'contratos/updateContrato',
  async (contrato, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.put(`/contratos/modificar/${contrato.id}`, contrato);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteContrato = createAsyncThunk(
  'contratos/deleteContrato',
  async (id, { rejectWithValue }) => {
    try {
      await controlAsistenciaApi.delete(`/contratos/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const contratoSlice = createSlice({
  name: 'contratos',
  initialState: {
    isLoading: false,
    contratos: [],
    activeContrato: null,
    error: null,
  },
  reducers: {
    setActiveContrato: (state, { payload }) => {
      state.activeContrato = payload;
    },
    clearActiveContrato: (state) => {
      state.activeContrato = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContratos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContratos.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.contratos = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchContratos.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.contratos = [];
      })
      .addCase(createContrato.fulfilled, (state, { payload }) => {
        state.contratos.push(payload);
      })
      .addCase(updateContrato.fulfilled, (state, { payload }) => {
        state.contratos = state.contratos.map(item => item.id === payload.id ? payload : item);
      })
      .addCase(deleteContrato.fulfilled, (state, { payload }) => {
        state.contratos = state.contratos.filter(item => item.id !== payload);
      });
  },
});

export const { setActiveContrato, clearActiveContrato } = contratoSlice.actions;
