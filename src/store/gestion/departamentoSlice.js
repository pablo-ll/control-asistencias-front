import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { controlAsistenciaApi } from '../../api';

// Async actions
 export const fetchDepartamentos = createAsyncThunk(
  'departamentos/fetchDepartamentos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.get('/departamentos/listar');
     
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
); 

export const createDepartamento = createAsyncThunk(
  'departamentos/createDepartamento',
  async (newDepartamento, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.post('/departamentos/crear', newDepartamento);
  
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDepartamento = createAsyncThunk(
  'departamentos/updateDepartamento',
  async (departamento, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.put(`/departamentos/modificar/${departamento.id}`, departamento);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDepartamento = createAsyncThunk(
  'departamentos/deleteDepartamento',
  async (id, { rejectWithValue }) => {
    try {
      await controlAsistenciaApi.delete(`/departamentos/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const departamentoSlice = createSlice({
    name: 'departamentos',
    initialState: {
      isLoading: false,
      items: [],
      activeDepartamento: null,
      error: null,
    },
  reducers: {
    setActiveDepartamento: (state, { payload }) => {
      state.activeDepartamento = payload;
    },
    clearActiveDepartamento: (state) => {
      state.activeDepartamento = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartamentos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartamentos.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.items = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchDepartamentos.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.items = [];
      })
      .addCase(createDepartamento.fulfilled, (state, { payload }) => {
        state.items.push(payload);
      })
      .addCase(updateDepartamento.fulfilled, (state, { payload }) => {
        state.items = state.items.map(item => item.id === payload.id ? payload : item);
      })
      .addCase(deleteDepartamento.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(item => item.id !== payload);
      });
  },
});

export const { setActiveDepartamento, clearActiveDepartamento } = departamentoSlice.actions;
